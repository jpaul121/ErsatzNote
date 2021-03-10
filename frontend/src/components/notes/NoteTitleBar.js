import 'regenerator-runtime/runtime.js'

import { Editable, Slate, withReact } from 'slate-react'
import React, { useEffect, useMemo } from 'react'

import axios from 'axios'
import { createEditor } from 'slate'
import { deserialize } from './Deserializers'
import { withRouter } from 'react-router'

function NoteTitleBar({ match, title, setTitle }) {
  const titleBar = useMemo(() => withReact(createEditor()), [])

  useEffect(() => {
    async function getTitle() {
      if (match.params.note_id) {
        const response = await axios.get(
          `/api/notes/${match.params.note_id}`,
        )
        
        setTitle(deserialize(response.data.title))
      } else {
        setTitle([{ children: [{ text: '' }] }])
      }

    }

    getTitle()
  }, [ match ])

  return (
    <Slate
      editor={titleBar}
      value={title}
      onChange={newTitle => setTitle(newTitle)}
    >
      <Editable
        placeholder='Title'
      />
    </Slate>
  );
}

const finishedNoteTitleBar = withRouter(NoteTitleBar)

export default finishedNoteTitleBar
