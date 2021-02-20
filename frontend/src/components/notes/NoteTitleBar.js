import 'regenerator-runtime/runtime.js'

import { Editable, Slate, withReact } from 'slate-react'
import React, { useEffect, useMemo, useState } from 'react'

import { createEditor } from 'slate'
import { withRouter } from 'react-router'

function NoteTitleBar({ match, ref }) {
  const titleBar = useMemo(() => withReact(createEditor()), [])
  const [ title, setTitle ] = useState([])

  useEffect(() => {
    async function getTitle() {
      const response = await axios.get(
        `/api/notes/${match.params.note_id}`,
      )

      setTitle(deserialize(response.data.title))
    }

    getTitle()
  }, [ match ])

  return (
    <Slate
      editor={titleBar}
      value={title}
      onChange={newTitle => setTitle(newTitle)}
      ref={ref}
    >
      <Editable
        placeholder='Title'
      />
    </Slate>
  );
}

const finishedNoteTitleBar = withRouter(NoteTitleBar)

export default finishedNoteTitleBar
