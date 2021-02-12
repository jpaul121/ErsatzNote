import React, { Component } from 'react'

import SideBar from '../sidebar/SideBar'
import styles from './NotebookIndexContainer.module.css'

class NotebookIndexContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles['notebook-index-container']}>
        <SideBar />
      </div>
    );
  }
}

export default NotebookIndexContainer
