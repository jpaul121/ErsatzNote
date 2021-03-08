import React, { useState } from 'react'

import NoteEditor from './NoteEditor'
import NoteTitleBar from './NoteTitleBar'
import styles from './NoteEditorContainer.module.css'

function NoteEditorContainer() {
  const [ title, setTitle ] = useState([])
  const [ content, setContent ] = useState([])

  return (
    <div className={styles['note-editor-container']}>
      <div className={styles['editor-proper']}>
        <NoteTitleBar
          title={title}
          setTitle={setTitle}
        />
        <NoteEditor
          title={title}
          content={content}
          setContent={setContent}
        />
      </div>
    </div>
  );
}

export default NoteEditorContainer
