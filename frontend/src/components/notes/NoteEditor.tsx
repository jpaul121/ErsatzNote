import 'regenerator-runtime/runtime.js'

import { BlockButton, DeleteButton, Element, Leaf, MarkButton, NotebookData, SaveButton, Toolbar, useLazyRef } from './BaseComponents'
import { Descendant, Node } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { NoteDataObject, clearContent, clearTitle, deserialize, serialize } from '../other/Serialization'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import ChangeNotebook from './ChangeNotebook'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import { match } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { withHistory } from 'slate-history'

export interface MatchProps {
  note_id?: string,
  notebook_id?: string,
}

interface NoteEditorProps {
  content: Node[],
  setContent: React.Dispatch<React.SetStateAction<Node[] | null>>,
  setTitle: React.Dispatch<React.SetStateAction<Descendant[]>>,
  title: Node[],
  titleBar: Editor & ReactEditor,
}

export interface NotebookOption {
  label: string,
  value: string,
}

function NoteEditor({ match, content, setContent, setTitle, title, titleBar }: NoteEditorProps & RouteComponentProps<MatchProps>) {
  const [ notebookData, setNotebookData ] = useState<NoteDataObject[] | null>(null)
  const [ currentNotebook, setCurrentNotebook ] = useState<NotebookOption | null>(null)
  const { renderCount, setRenderCount, user } = useContext(UserContext)
  
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const editorRef = useLazyRef<Editor & ReactEditor>(() => withHistory(withReact(createEditor())))
  const _isMounted = useRef<boolean>(false)

  const editor = editorRef.current
  const signal = axios.CancelToken.source()
  const history = useHistory()
  
  const deleteNote = useCallback(() => {
    // If called from an editor that has an existing note, delete
    // the note and move on to another one in the current notebook. 
    // If there aren't any more, edit an empty note in the current notebook.
    if (match.params.note_id) {
      axiosInstance.delete(
        `/api/notes/${match.params.note_id}/`
      )
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
      if (notebookData && notebookData.length > 0) history.push(`/notebooks/${match.params.notebook_id}/`)
      // else...
      if (renderCount && setRenderCount) setRenderCount(renderCount + 1)
    } else {
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
      if (renderCount && setRenderCount) setRenderCount(renderCount + 1)
    }
  }, [ match, title, content, currentNotebook ])
  
  async function getNote() {
    if (match.params.note_id) {
      try {
        const response = await axiosInstance.get(
          `/api/notes/${match.params.note_id}/`, {
            cancelToken: signal.token,
          }
        )
        
        const document = new DOMParser().parseFromString(response.data.content, 'text/html')
        
        if (_isMounted.current) setContent(deserialize(document.body))
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(`Error: ${err.message}`)
        }
      }
    } else clearContent(_isMounted, editor, setContent)
  }

  async function getCurrentNotebook(): Promise<void> {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/${match.params.notebook_id}/`, {
          cancelToken: signal.token,
        }
      )
      
      let noteData = []
      for (let noteID of response.data.notes) {
        const noteObject = await axiosInstance.get(
          `/api/notes/${noteID}/`, {
            cancelToken: signal.token,
          }
        )
        noteData.push(noteObject.data)
      }
      
      setNotebookData(noteData)
      setCurrentNotebook(
        noteData.filter(notebook => notebook.value === match.params.notebook_id)[0]
      )
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }

  const saveNote = useCallback(async () => {
    const editorContent: Node = { children: content }
    const destinationNotebook = currentNotebook ? currentNotebook.value : match.params.notebook_id
    
    if (match.params.note_id) {
      axiosInstance.put(
        `/api/notes/${match.params.note_id}/`,
        {
          note_id: match.params.note_id,
          notebook: destinationNotebook,
          title,
          content: serialize(editorContent),
          user,
        }
      )
      if (renderCount && setRenderCount) setRenderCount(renderCount + 1)
    } else if (match.params.notebook_id) {
      axiosInstance.post(
        `/api/notes/`,
        {
          title,
          content: serialize(editorContent),
          notebook: destinationNotebook,
          user,
        }
      ).then(response => {
        history.push(`/notebooks/${destinationNotebook}/notes/${response.data.note_id}`)
        if (renderCount && setRenderCount) setRenderCount(renderCount + 1)
      })
    } else {
      axiosInstance.post(
        `/api/notes/`,
        {
          title,
          content: serialize(editorContent),
          notebook: destinationNotebook,
          user,
        }
      )

      if (currentNotebook) history.push(`/notebooks/${currentNotebook.value}`)
      if (renderCount && setRenderCount) setRenderCount(renderCount + 1)
    }
  }, [ match, title, content, currentNotebook ])
  
  useEffect(() => {
    _isMounted.current = true
    getNote()
    if (match.params.notebook_id) getCurrentNotebook()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    }
  }, [ match ])

  return (
    <Slate
      editor={editor}
      value={content}
      onChange={newContent => setContent(newContent)}
    >
      < // @ts-ignore
        Toolbar>
        <MarkButton format='bold' icon='format_bold' title='Bold' />
        <MarkButton format='italic' icon='format_italic' title='Italic' />
        <MarkButton format='code' icon='code' title='Code' />
        <BlockButton format='heading-one' icon='looks_one' title='Large Heading' />
        <BlockButton format='heading-two' icon='looks_two' title='Small Heading' />
        <BlockButton format='block-quote' icon='format_quote' title='Block Quote' />
        <BlockButton format='bulleted-list' icon='format_list_bulleted' title='Bulleted List' />
        <BlockButton format='numbered-list' icon='format_list_numbered' title='Numbered List' />
        <ChangeNotebook
          currentNotebook={currentNotebook}
          setCurrentNotebook={setCurrentNotebook}
        />
        <SaveButton saveNote={saveNote} />
        <DeleteButton deleteNote={deleteNote} />
      </Toolbar>
      <Editable
        placeholder='Write something...'
        style={{ minHeight: 600 }}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck
        autoFocus
      />
    </Slate>
  );
}

// @ts-ignore
const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
