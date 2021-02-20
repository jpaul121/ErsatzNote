import React, { Component } from 'react'

import SideBar from '../sidebar/SideBar'
import styles from './NewNoteContainer.module.css'

class NewNoteContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles['new-note-container']}>
        <SideBar />
      </div>
    );
  }
}

export default NewNoteContainer
