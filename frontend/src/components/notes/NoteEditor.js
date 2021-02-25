import 'regenerator-runtime/runtime.js'

import { Editable, Slate, withReact } from 'slate-react'
import React, { useEffect, useMemo, useState } from 'react'

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
      <Editable
        placeholder='Write something...'
      />
    </Slate>
  );
}

const finishedNoteEditor = withRouter(NoteEditor)

export default finishedNoteEditor
