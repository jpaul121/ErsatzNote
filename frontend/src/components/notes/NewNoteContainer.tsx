import NoteEditorContainer from './NoteEditorContainer'
import { NoteEditorSize } from './NoteEditorContainer'
import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import styles from '../../stylesheets/notes/NewNoteContainer.module.css'

function NewNoteContainer(): JSX.Element {
  return (
    <div className={styles['new-note-container']}>
      <Sidebar />
      <NoteEditorContainer size={NoteEditorSize.FullScreen} />
    </div>
  );
}

export default NewNoteContainer
