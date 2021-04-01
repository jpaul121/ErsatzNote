import 'regenerator-runtime/runtime.js'

import { BlockButton, Element, Leaf, MarkButton, SaveButton, Toolbar } from './BaseComponents'
import { Editable, Slate, withReact } from 'slate-react'
import React, { useCallback, useEffect, useMemo } from 'react'
import { deserialize, emptyValue, serialize } from './Serialization'

import { Node } from 'slate'
import axios from 'axios'
import { createEditor } from 'slate'
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
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])

  const saveNote = useCallback(() => {
    if (match.params.note_id) {
      axios.put(
        `/api/notes/${match.params.note_id}/`,
        {
          note_id: match.params.note_id,
          title,
          content: serialize({ children: content }),
        }
      )
    } else {
      axios.post(
        `/api/notes/`,
        {
          title,
          content: serialize({ children: content }),
        }
      )
    }
  }, [ match, title, content ])

  useEffect(() => {
    async function getNote() {
      if (match.params.note_id) {
        const response = await axios.get(
          `/api/notes/${match.params.note_id}/`,
        )
        
        console.log('Django response data:\n', 'NoteEditor.js, line 43\n', response.data)

        const document = new DOMParser().parseFromString(response.data.content, 'text/html')
        
        setContent(deserialize(document.body))
      } else {
        setContent(emptyValue)
      }
    }

    getNote()
  }, [ match ])

  return (
    <Slate
      editor={editor}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
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
        <BlockButton format='block_quote' icon='format_quote' />
        <BlockButton format='bulleted_list' icon='format_list_bulleted' />
        <BlockButton format='numbered_list' icon='format_list_numbered' />
        <SaveButton saveNote={saveNote} />
      </Toolbar>
      <Editable
        placeholder='Write something...'
        style={{ minHeight: 600 }}
        spellCheck
        autoFocus
      />
    </Slate>
  );
}

// @ts-ignore
const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
