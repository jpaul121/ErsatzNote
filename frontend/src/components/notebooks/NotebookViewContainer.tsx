// @ts-nocheck

import React, { Component } from 'react'

import NoteEditorContainer from '../notes/NoteEditorContainer'
import NotebookView from './NotebookView'
import SideBar from '../sidebar/SideBar'
import styles from './NotebookViewContainer.module.css'

class NotebookViewContainer extends Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return (
      <div className={styles['notebook-view-container']}>
        <SideBar />
        <NotebookView />
        <NoteEditorContainer />
      </div>
    );
  }
}

export default NotebookViewContainer
