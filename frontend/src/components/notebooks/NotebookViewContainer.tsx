// @ts-nocheck

import NoteEditorContainer, { NoteEditorSize } from '../notes/NoteEditorContainer'

import NotebookView from './NotebookView'
import React from 'react'
import SideBar from '../sidebar/SideBar'
import styles from '../../stylesheets/notebooks/NotebookViewContainer.module.css'

function NotebookViewContainer() {
  return (
    <div className={styles['notebook-view-container']}>
      <SideBar />
      <NotebookView />
      <NoteEditorContainer size={NoteEditorSize.Medium} />
    </div>
  );
}

export default NotebookViewContainer
