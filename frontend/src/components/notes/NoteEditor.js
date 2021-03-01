import 'regenerator-runtime/runtime.js'

import { BlockButton, MarkButton, Toolbar } from './BaseComponents'
import { Editable, Slate, withReact } from 'slate-react'
import React, { useEffect, useMemo } from 'react'

import axios from 'axios'
import { createEditor } from 'slate'
import deserialize from './Deserializer'
import { withRouter } from 'react-router'

// to-do: add toolbar
function NoteEditor({ match, content, setContent }) {
  const editor = useMemo(() => withReact(createEditor()), [])

  useEffect(() => {
    async function getNote() {
      const response = await axios.get(
        `/api/notes/${match.params.note_id}`,
      )
      
      setContent(deserialize(response.data.content))
    }

    getNote()
  }, [ match ])

  return (
    <Slate
      editor={editor}
      value={content}
      onChange={newContent => setContent(newContent)}
    >
      <Toolbar>
        <MarkButton format='bold' icon='format_bold' />
        <MarkButton format='italic' icon='format_italic' />
        <MarkButton format='code' icon='code' />
        <BlockButton format='heading-one' icon='looks_one' />
        <BlockButton format='heading-two' icon='looks_two' />
        <BlockButton format='block_quote' icon='format_quote' />
        <BlockButton format='numbered_list' icon='format_list_numbered' />
        <BlockButton format='bulleted_list' icon='format_list_bulleted' />
      </Toolbar>
      <Editable
        placeholder='Write something...'
      />
    </Slate>
  );
}

const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
