import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'

import Note from '../notes/Note'
import axios from 'axios'
import styles from './NotebookView.module.css'
import { withRouter } from 'react-router'

class NotebookView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      notes: null,
    }
  }

  async componentDidMount() {
    await this.renderNotes()
  }

  async getNotes() {
    const { match } = this.props
    const notebook_id = match.params.notebook_id
    
    const response = await axios.get(`/api/notebooks/${notebook_id}`)
    const noteIDs = response.data.notes
    
    let noteData = []
    
    for (let noteID of noteIDs) {
      const response = await axios.get(`/api/notes/${noteID}`)

      noteData.push(response.data)
    }

    return noteData;
  }

  async renderNotes() {
    const noteData = await this.getNotes()

    this.setState({
      isLoading: false,
      notes: noteData.map(item => {
        return (
          <Note 
            key={item.note_id}
            title={item.title}
            content={item.content}
            date_modified={item.date_modified}
          />
        );
      })
    })
  }

  render() {
    return !this.state.isLoading && (
      <div className={styles['notebook-view']}>
        <div className={styles['notebook-header']}>
          <h1 className={styles['notebook-title']}>Notebook Name</h1>
          <p className={styles['note-count']}>
            n notes
          </p>
        </div>
        <ul className={styles['note-list']}>
          {this.state.notes}
        </ul>
      </div>
    );
  }
}

const finishedNotebookView = withRouter(NotebookView)

export default finishedNotebookView
