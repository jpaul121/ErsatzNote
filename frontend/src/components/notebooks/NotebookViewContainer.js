import React, { Component } from 'react'

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
      </div>
    );
  }
}

export default NotebookViewContainer
