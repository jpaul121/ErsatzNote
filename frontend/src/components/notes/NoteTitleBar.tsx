// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import { Editable, Slate, withReact } from 'slate-react'
import React, { useEffect, useMemo, useRef } from 'react'

import { axiosInstance } from '../../axiosAPI'
import { clearEditor } from '../other/Serialization'
import { createEditor } from 'slate'
import { withRouter } from 'react-router'

function NoteTitleBar({ match, title, setTitle }) {
  const titleBar = useMemo(() => withReact(createEditor()), [])
  
  const _isMounted = useRef(false)

  useEffect(() => {
    async function getTitle() {
      if (match.params.note_id) {
        const response = await axiosInstance.get(
          `/api/notes/${match.params.note_id}`,
        )
        
        if (_isMounted.current) setTitle(response.data.title)
      } else clearEditor(titleBar, _isMounted, setTitle)
    }

    _isMounted.current = true
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
