import React, { useCallback, useMemo } from 'react'

import NoteEditor from './NoteEditor'
import NoteTitleBar from './NoteTitleBar'
import axios from 'axios'
import serialize from './Serializer'
import styles from './NoteEditorContainer.module.css'
import { withRouter } from 'react-router'

function NoteEditorContainer({ match }) {  
  function getInput(node) {
    return node.value;
  }
  
  const title = getInput.bind({})
  const content = getInput.bind({})

  const saveNote = useCallback(() => {
    // This was confusing because usually databases
    // save content in JSON and the client receives
    // plaintext, but in this case it's the other way around. 
    const title = title
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
      <NoteTitleBar ref={title} />
      <NoteEditor ref={content} />
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
