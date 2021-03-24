import NoteEditorContainer from './NoteEditorContainer'
import React from 'react'
import SideBar from '../sidebar/SideBar'
import styles from './NewNoteContainer.module.css'

function NewNoteContainer(): JSX.Element {
  return (
    <div className={styles['new-note-container']}>
      <SideBar />
      <NoteEditorContainer />
    </div>
  );
}

export default NewNoteContainer
