import 'regenerator-runtime/runtime.js'

import { BlockButton, Element, Leaf, MarkButton, NotebookData, SaveButton, SelectNotebook, Toolbar, useLazyRef } from './BaseComponents'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { clearEditor, deserialize, emptyValue, serialize } from '../other/Serialization'

import { Node } from 'slate'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import { match } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { withHistory } from 'slate-history'
import { withRouter } from 'react-router'

interface MatchParams {
  note_id: string,
  notebook_id?: string,
}

interface NoteEditorProps {
  content: Node[],
  match: match<MatchParams>,
  setContent: React.Dispatch<React.SetStateAction<Node[]>>,
  title: Node[],
}

interface NotebookOptions {
  label: string,
  value: string,
}

function NoteEditor({ match, content, setContent, title }: NoteEditorProps) {
  const [ notebookOptions, setNotebookOptions ] = useState<NotebookOptions[] | null>(null)
  const [ currentNotebook, setCurrentNotebook ] = useState(match.params.notebook_id ? { value: match.params.notebook_id, label: 'Select notebook...' } : null)
  const { user, renderCount, rerender } = useContext(UserContext)
  
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const editorRef = useLazyRef<Editor & ReactEditor>(() => withHistory(withReact(createEditor())))
  const _isMounted = useRef<boolean>(false)

  const editor = editorRef.current
  const signal = axios.CancelToken.source()
  const history = useHistory()
  
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
          console.log('Error: ', err.message)
        }
      }
    } else {
      clearEditor(editor, _isMounted, setContent)
    }
  }

  async function getNotebookOptions() {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/`, {
          cancelToken: signal.token,
        }
      )
      
      const notebookList: NotebookData[] = response.data
      let options = []

      for (let notebook of notebookList) {
        options.push(
          {
            label: notebook.name,
            value: notebook.notebook_id,
          }
        )
      }
  
      if (_isMounted.current) setNotebookOptions(options)
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message)
      }
    }
  }

  const saveNote = useCallback(() => {
    const editorContent: Node = { children: content }
    
    if (match.params.note_id) {
      axiosInstance.put(
        `/api/notes/${match.params.note_id}/`,
        {
          note_id: match.params.note_id,
          notebook: currentNotebook?.value,
          title,
          content: serialize(editorContent),
          user,
        }
      )
      rerender!(renderCount! + 1)
    } else {
      axiosInstance.post(
        `/api/notes/`,
        {
          title,
          content: serialize(editorContent),
          notebook: currentNotebook?.value,
          user,
        }
      )

      if (currentNotebook?.value) history.push(`/notebooks/${currentNotebook.value}`)
      rerender!(renderCount! + 1)
    }
  }, [ match, title, content, currentNotebook, rerender, renderCount ])
  
  useEffect(() => {
    _isMounted.current = true

    getNote()
    getNotebookOptions()

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
        <MarkButton format='bold' icon='format_bold' />
        <MarkButton format='italic' icon='format_italic' />
        <MarkButton format='code' icon='code' />
        <BlockButton format='heading-one' icon='looks_one' />
        <BlockButton format='heading-two' icon='looks_two' />
        <BlockButton format='block-quote' icon='format_quote' />
        <BlockButton format='bulleted-list' icon='format_list_bulleted' />
        <BlockButton format='numbered-list' icon='format_list_numbered' />
        <SelectNotebook
          currentNotebook={currentNotebook}
          notebookOptions={notebookOptions}
          setCurrentNotebook={setCurrentNotebook}
        />
        <SaveButton saveNote={saveNote} />
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
