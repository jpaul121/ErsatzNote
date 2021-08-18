import 'regenerator-runtime/runtime.js'

import { BlockButton, DeleteButton, Element, Leaf, MarkButton, SaveButton, Toolbar } from './EditorComponents'
import { Descendant, Node } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { clearContent, clearTitle, deserialize, serialize } from '../other/Serialization'
import { useHistory, useLocation } from 'react-router-dom'

import AppContext from '../other/AppContext'
import ChangeNotebook from './ChangeNotebook'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import useLazyRef from '../../hooks/useLazyRef'
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
  const { user } = useContext(AppContext)
  
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const editorRef = useLazyRef<Editor & ReactEditor>(() => withHistory(withReact(createEditor())))
  const _isMounted = useRef<boolean>(false)

  const editor = editorRef.current
  const signal = axios.CancelToken.source()
  const history = useHistory()
  const location = useLocation()
  
  const deleteNote = useCallback(() => {
    if (match.params.note_id) {
      axiosInstance.delete(
        `/api/notes/${match.params.note_id}/`
      )
      
      nukeEditor()
      
      history.push(`/notebooks/${match.params.notebook_id}/`)
    } 
    
    else {
      nukeEditor()
    }
  }, [ match.params.note_id, match.params.notebook_id, content, currentNotebook, title ])
  
  async function getNote() {
    if (match.params.note_id) {
      try {
        axiosInstance.get(`/api/notes/${match.params.note_id}/`, {
            cancelToken: signal.token,
          }
        )
        .then(response => {
          if (_isMounted.current) setContent(deserialize(
            new DOMParser().parseFromString(response.data.content, 'text/html').body
          ))
        })
      } 
      
      catch (err) {
        if (axios.isCancel(err)) {
          console.log(`Error: ${err.message}`)
        }
      }
    } 
    
    else {
      nukeEditor()
    }
  }

  // Convenience function since I can't pass default arguments defined in functional components 
  // to functions imported from another file (where they're needed since I need them in this component's parent too),
  // and it looks ugly having to use these two together in the exact same way over and over in this one specific file
  function nukeEditor() {
    clearTitle(_isMounted, titleBar, setTitle)
    clearContent(_isMounted, editor, setContent)
  }

  const saveNote = useCallback(async () => {
    const editorContent: Node = { children: content }
    const destinationNotebook = currentNotebook ? currentNotebook.value : match.params.notebook_id
    
    if (match.params.note_id) {
      axiosInstance.put(`/api/notes/${match.params.note_id}/`, {
          note_id: match.params.note_id,
          notebook: destinationNotebook,
          title,
          content: serialize(editorContent),
          user,
        }
      ).then(() => {
        history.push(`/notebooks/${destinationNotebook}`)
      })
    } 
    
    else if (match.params.notebook_id) {
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
    
    else {
      axiosInstance.post(`/api/notes/`, {
          title,
          content: serialize(editorContent),
          notebook: destinationNotebook,
          user,
        }
      )
      .then(response => {
        // If the user creates a note from the 'All Notes' page, show them the note in that same page
        if (location.pathname === '/all-notes') history.push(`/all-notes/${response.data.note_id}`)

        // If the user creates a note from the 'New Note' or 'Notebook View' pages, and they
        // choose a notebook for it, then show them that note in the corresponding 'Notebook View'
        if (currentNotebook && location.pathname !== '/all-notes') history.push(`/notebooks/${currentNotebook.value}`)
      })
    }
  }, [ match.params.note_id, match.params.notebook_id, title, content, currentNotebook ])
  
  useEffect(() => {
    _isMounted.current = true
    
    getNote()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    }
  }, [ match.params.note_id, match.params.notebook_id ])

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
        style={{
          minHeight: '77vh',
          maxHeight: '77vh',
          overflowY: 'scroll',
          overflowX: 'hidden',
        }}
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
