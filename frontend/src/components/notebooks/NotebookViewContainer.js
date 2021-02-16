import React, { Component } from 'react'

import NoteEditor from '../notes/NoteEditor'
import NotebookView from './NotebookView'
import SideBar from '../sidebar/SideBar'
import styles from './NotebookViewContainer.module.css'

class NotebookViewContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles['notebook-view-container']}>
        <SideBar />
        <NotebookView />
        <NoteEditor />
      </div>
    );
  }
}

export default NotebookViewContainer
