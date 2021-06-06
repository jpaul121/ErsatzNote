// @ts-nocheck

import NoteEditorContainer from '../notes/NoteEditorContainer'
import NotebookView from './NotebookView'
import React from 'react'
import SideBar from '../sidebar/SideBar'
import styles from '../../stylesheets/notebooks/NotebookViewContainer.module.css'

function NotebookViewContainer() {
  return (
    <div className={styles['notebook-view-container']}>
      <SideBar />
      <NotebookView />
      <NoteEditorContainer />
    </div>
  );
}

export default NotebookViewContainer
