import React, { useState } from 'react'

import NoteEditor from './NoteEditor'
import NoteEditorContainer from './NoteEditorContainer'
import SideBar from '../sidebar/SideBar'
import styles from './NewNoteContainer.module.css'

function NewNoteContainer() {
  return (
    <div className={styles['new-note-container']}>
      <SideBar />
      <NoteEditorContainer />
    </div>
  );
}

export default NewNoteContainer
