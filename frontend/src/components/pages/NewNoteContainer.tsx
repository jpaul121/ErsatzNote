import NoteEditorContainer from '../notes/NoteEditorContainer'
import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import styles from '../../stylesheets/pages/NewNoteContainer.module.css'

function NewNoteContainer(): JSX.Element {
  return (
    <div className={styles['new-note-container']}>
      <Sidebar />
      <NoteEditorContainer />
    </div>
  );
}

export default NewNoteContainer
