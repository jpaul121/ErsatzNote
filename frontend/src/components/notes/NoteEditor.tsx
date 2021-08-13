import 'regenerator-runtime/runtime.js'

import { BlockButton, DeleteButton, Element, Leaf, MarkButton, SaveButton, Toolbar, useLazyRef } from './BaseComponents'
import { Descendant, Node } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import UserContext, { EditorContext } from '../other/UserContext'
import { clearContent, clearTitle, deserialize, serialize } from '../other/Serialization'
import { useHistory, useLocation } from 'react-router-dom'

import ChangeNotebook from './ChangeNotebook'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import { match } from 'react-router-dom'
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
  const [ currentNotebook, setCurrentNotebook ] = useState<NotebookOption | null>(null)
  
  const { editorContext, user } = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const _isMounted = useRef<boolean>(false)
  const editorRef = useLazyRef<Editor & ReactEditor>(() => withHistory(withReact(createEditor())))
  const editor = editorRef.current

  const signal = axios.CancelToken.source()
  
  const deleteNote = useCallback(() => {
    if (editorContext === EditorContext.NoteInNotebook || EditorContext.NoteInAllNotes) {
      axiosInstance.delete(`/api/notes/${match.params.note_id}/`)
      
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
      
      history.push(`/notebooks/${match.params.notebook_id}`)
    }
    
    else {
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
    }
  }, [ match, title, content, currentNotebook ])
  
  const getNote = useCallback(() => {
    if (editorContext === EditorContext.NoteInNotebook || EditorContext.NoteInAllNotes) {
      try {
        axiosInstance.get(
          `/api/notes/${match.params.note_id}/`, {
            cancelToken: signal.token,
          }
        )
        .then(response => {
          if (_isMounted.current) {
            setContent(
              deserialize(
                new DOMParser().parseFromString(response.data.content, 'text/html').body
              )
            )
          }
        })
      }      
      
      catch (err) {
        if (axios.isCancel(err)) {
          console.log(`Error: ${err.message}`)
        }
      }
    }
    
    else if (editorContext === EditorContext.NewNote || EditorContext.NewNoteInNotebook) {
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
    }
  }, [ match.params.note_id, match.params.notebook_id, editorContext ])

  async function getCurrentNotebook(): Promise<void> {
    try {
      axiosInstance.get(
        `/api/notebooks/${match.params.notebook_id}/`, {
          cancelToken: signal.token,
        }
      )
      .then(async response => {
        let noteData = []
        for (let noteID of response.data.notes) {
          const noteObject = await axiosInstance.get(
            `/api/notes/${noteID}/`, {
              cancelToken: signal.token,
            }
          )
          noteData.push(noteObject.data)
        }
        
        setCurrentNotebook(
          noteData.filter(notebook => notebook.value === match.params.notebook_id)[0]
        )
      })
    }
    
    catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }

  const saveNote = useCallback(async () => {
    const editorContent: Node = { children: content }
    const destinationNotebook = currentNotebook ? currentNotebook.value : match.params.notebook_id
    
    if (editorContext === EditorContext.NoteInNotebook || EditorContext.NoteInAllNotes) {
      axiosInstance.put(`/api/notes/${match.params.note_id}/`, {
          note_id: match.params.note_id,
          notebook: destinationNotebook,
          title,
          content: serialize(editorContent),
          user,
        }
      )
    } 
    
    else if (editorContext === EditorContext.NewNoteInNotebook) {
      axiosInstance.post(`/api/notes/`, {
          title,
          content: serialize(editorContent),
          notebook: destinationNotebook,
          user,
        }
      )
      .then(response => {
        history.push(`/notebooks/${destinationNotebook}/notes/${response.data.note_id}`)
      })
    } 
    
    else if (editorContext === EditorContext.NewNote) {
      axiosInstance.post(`/api/notes/`, {
          title,
          content: serialize(editorContent),
          notebook: destinationNotebook,
          user,
        }
      )
      .then(response => {
        if (currentNotebook && location.pathname === '/new-note')
          history.push(`/notebooks/${currentNotebook.value}`)
        if (location.pathname === '/all-notes')
          history.push(`/all-notes/${response.data.note_id}`)
      })
    }
  }, [ match, title, content, currentNotebook ])
  
  useEffect(() => {
    _isMounted.current = true
    
    if (_isMounted.current) getNote()
    
    if (match.params.notebook_id) getCurrentNotebook()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    }
  }, [ match.params.note_id, match.params.notebook_id, editorContext ])

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
        style={{ minHeight: '75vh' }}
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
