// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'
import { deserialize, getContentPreview, getTitlePreview } from '../notes/Serialization'

import { Link } from 'react-router-dom'
import Note from '../notes/Note'
import axios from 'axios'
import styles from './NotebookView.module.css'
import { withRouter } from 'react-router'

class NotebookView extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: true,
      name: null,
      notes: null,
    }
  }

  async componentDidMount() {
    await this.renderNotes()
  }

  async getNotebook() {
    const { match } = this.props
    const notebook_id = match.params.notebook_id
    
    const response = await axios.get(`/api/notebooks/${notebook_id}`)
    const name = response.data.name
    const noteIDs = response.data.notes
    
    let noteData = []
    
    for (let noteID of noteIDs) {
      const response = await axios.get(`/api/notes/${noteID}`)

      noteData.push(response.data)
    }

    return [ name, noteData ];
  }

  async renderNotes() {
    const [ name, noteData ] = await this.getNotebook()
    const notebook_id = this.props.match.params.notebook_id

    this.setState({
      isLoading: false,
      name,
      notes: noteData.map(item => {
        return (
          <Link key={item.note_id} to={`/notebooks/${notebook_id}/notes/${item.note_id}`}>
            <Note 
              title={getTitlePreview(item)}
              content={deserialize(item)}
              date_modified={item.date_modified}
            />
          </Link>
        );
      })
    })
  }

  render() {
    return !this.state.isLoading && (
      <div className={styles['notebook-view']}>
        <div className={styles['notebook-header']}>
          <h1 className={styles['notebook-title']}>{this.state.name}</h1>
          <p className={styles['note-count']}>
            {
              this.state.notes.length == 1
              ? '1 note'
              : `${this.state.notes.length} notes`
            }
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
