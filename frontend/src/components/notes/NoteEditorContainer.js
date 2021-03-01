import React, { useCallback, useState } from 'react'

import NoteEditor from './NoteEditor'
import NoteTitleBar from './NoteTitleBar'
import axios from 'axios'
import serialize from './Serializer'
import styles from './NoteEditorContainer.module.css'
import { withRouter } from 'react-router'

function NoteEditorContainer({ match }) {
  const [ title, setTitle ] = useState([])
  const [ content, setContent ] = useState([])

  const saveNote = useCallback(() => {
    // This was confusing because usually databases
    // save content in JSON and the client receives
    // plaintext, but in this case it's the other way around. 
    const plaintextContent = serialize(content)
    
    axios.put(
      `/api/notes/${match.params.note_id}`,
      {
        note_id: match.params.note_id,
        title,
        content: plaintextContent,
      }
    )
  }, [ match, title, content ])

  return (
    <div className={styles['note-editor-container']}>
      <div className={styles['editor-proper']}>
        <NoteTitleBar
          title={title}
          setTitle={setTitle}
        />
        <NoteEditor
          content={content}
          setContent={setContent}
        />
      </div>
      <button
        type='button'
        onClick={saveNote}
      >
        Save
      </button>
    </div>
  );
}

const finishedNoteEditorContainer = withRouter(NoteEditorContainer)

export default finishedNoteEditorContainer
