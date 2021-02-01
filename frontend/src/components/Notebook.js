import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'

import Note from './Note'
import axios from 'axios'
import { withRouter } from 'react-router'

class Notebook extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notes: [],
    }
  }

  async componentDidMount() {
    const noteIDs = await this.getNoteIDs()
    const notes = await this.getNotes(noteIDs)

    console.log(notes)
    
    return this.setState({ notes: notes });
  }

  async getNoteIDs() {
    const { match } = this.props
    const id = match.params.notebook_id
    
    const response = await axios.get(`/api/notebooks/${id}`)

    return response.data.notes;
  }

  async getNotes(noteIDs) {
    let notes = []
    
    for (let noteID of noteIDs) {
      const response = await axios.get(`/api/notes/${noteID}`)

      notes.push(response.data)
    }

    return notes;
  }

  renderNoteItems() {
    const notesData = this.state.notes

    return notesData.map(item => {
      <Note
        title={item.title}
        content={item.content}
      />
    });
  }

  render() {
    return (
      <div>
        {this.renderNoteItems()}
      </div>
    );
  }
}

const finishedNotebook = withRouter(Notebook)

export default finishedNotebook
