import 'regenerator-runtime/runtime.js'

import { BlockButton, DeleteButton, Element, Leaf, MarkButton, NotebookData, SaveButton, Toolbar, useLazyRef } from './BaseComponents'
import { Descendant, Node } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { clearContent, clearTitle, deserialize, serialize } from '../other/Serialization'
import { useHistory, useLocation } from 'react-router-dom'

import ChangeNotebook from './ChangeNotebook'
import UserContext from '../other/UserContext'
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
  const [ notebookOptions, setNotebookOptions ] = useState<Array<NotebookOption>>()
  const [ currentNotebook, setCurrentNotebook ] = useState<Array<NotebookOption>>()
  const { user } = useContext(UserContext)
  
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const editorRef = useLazyRef<Editor & ReactEditor>(() => withHistory(withReact(createEditor())))
  const _isMounted = useRef<boolean>(false)

  const editor = editorRef.current
  const signal = axios.CancelToken.source()
  const history = useHistory()
  const location = useLocation()
  
  const deleteNote = useCallback(() => {
    // If called from an editor that has an existing note, delete
    // the note and edit an empty note in the current notebook.
    if (match.params.note_id) {
      axiosInstance.delete(
        `/api/notes/${match.params.note_id}/`
      )
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
      if (match.params.notebook_id) history.push(`/notebooks/${match.params.notebook_id}/`)
    } else {
      clearTitle(_isMounted, titleBar, setTitle)
      clearContent(_isMounted, editor, setContent)
    }
  }, [ match.params.note_id, match.params.notebook_id, title, content ])
  
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

  // Apparently, I should try this without async first
  function getNotebookOptions(inputValue: string | undefined, callback: Function): void {
    if (!inputValue)
      return callback([]);
    
    try {
      axiosInstance.get(`/api/notebooks/`, { cancelToken: signal.token })
        .then(response => {
          let newNotebookOptions = []
          for (const notebook of response.data) {
            newNotebookOptions.push({ label: notebook.name, value: notebook.notebook_id })
          }
          setNotebookOptions(newNotebookOptions)
          callback(notebookOptions)
      })
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }

  const saveNote = useCallback(async () => {
    const editorContent: Node = { children: content }
    const destinationNotebook = currentNotebook ? currentNotebook[0].value : match.params.notebook_id
    
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
      })
    } else {
      const response = await axiosInstance.post(
        `/api/notes/`,
        {
          title,
          content: serialize(editorContent),
          notebook: destinationNotebook,
          user,
        }
      )

      if (currentNotebook && location.pathname !== '/all-notes') history.push(`/notebooks/${currentNotebook[0].value}`)
      if (location.pathname === '/all-notes') history.push(`/all-notes/${response.data.note_id}`)
    }
  }, [ match, title, content, currentNotebook ])

  function filterNotebookOptions(notebookName: string) {
    return notebookOptions?.filter(notebook =>
      notebook.label === notebookName
    );
  }
  
  useEffect(() => {
    _isMounted.current = true
    getNote()

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
          filterNotebookOptions={filterNotebookOptions}
          getNotebookOptions={getNotebookOptions}
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
