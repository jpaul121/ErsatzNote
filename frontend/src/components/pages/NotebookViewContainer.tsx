// @ts-nocheck

import NoteEditorContainer, { NoteEditorSize } from '../notes/NoteEditorContainer'

import NotePreview from '../notes/NotePreview'
import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import styles from '../../stylesheets/pages/NotebookViewContainer.module.css'

function NotebookViewContainer() {
  return (
    <div className={styles['notebook-view-container']}>
      <Sidebar />
      <NotePreview />
      <NoteEditorContainer size={NoteEditorSize.Medium} />
    </div>
  );
}

export default NotebookViewContainer
