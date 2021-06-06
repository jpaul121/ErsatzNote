import 'regenerator-runtime/runtime.js'

import { BlockButton, Element, Leaf, MarkButton, SaveButton, Toolbar, useLazyRef } from './BaseComponents'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import React, { useCallback, useEffect, useRef } from 'react'
import { deserialize, emptyValue, serialize } from '../other/Serialization'

import { Node } from 'slate'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import { match } from 'react-router-dom'
import { withHistory } from 'slate-history'
import { withRouter } from 'react-router'

interface MatchParams {
  note_id: string,
}

interface NoteEditorProps {
  content: Node[],
  match: match<MatchParams>,
  setContent: React.Dispatch<React.SetStateAction<Node[]>>,
  title: Node[],
}

function NoteEditor({ match, content, setContent, title }: NoteEditorProps) {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const editorRef = useLazyRef<Editor & ReactEditor>(() => withHistory(withReact(createEditor())))
  const _isMounted = useRef<boolean>(false)

  const editor = editorRef.current

  const signal = axios.CancelToken.source()

  const saveNote = useCallback(() => {
    const editorContent: Node = { children: content }
    
    if (match.params.note_id) {
      axiosInstance.put(
        `/api/notes/${match.params.note_id}/`,
        {
          note_id: match.params.note_id,
          title,
          content: serialize(editorContent),
        }
      )
    } else {
      axiosInstance.post(
        `/api/notes/`,
        {
          title,
          content: serialize(editorContent),
        }
      )
    }
  }, [ match, title, content ])

  useEffect(() => {
    _isMounted.current = true
    
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
        if (_isMounted.current) setContent(emptyValue)
      }
    }

    getNote()

    return () => {
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
