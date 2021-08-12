// @ts-nocheck

import NoteEditorContainer from '../notes/NoteEditorContainer'
import NotePreview from '../notes/NotePreview'
import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import styles from '../../stylesheets/pages/NotebookViewContainer.module.css'

function NotebookViewContainer() {
  return (
    <div className={styles['notebook-view-container']}>
      <Sidebar />
      <NotePreview />
      <NoteEditorContainer />
    </div>
  );
}

export default NotebookViewContainer
