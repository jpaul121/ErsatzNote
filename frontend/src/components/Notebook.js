import React, { Component } from 'react'

import Note from './Note'
import axios from 'axios'
import { withRouter } from 'react-router'

class Notebook extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notesList: [],
      notes: [],
    }
  }

  componentDidMount() {
    this.getNoteIDs()
    this.getNotes()
  }

  getNoteIDs() {
    const { match } = this.props
    const id = match.params.notebook_id
    
    axios
      .get(`/api/notebooks/${id}`)
      .then(res => { this.setState({ notesList: res.data.notes }) })
      .then(() => { console.log('response: ', this.state.notesList) })
      .catch(err => console.log(err))
  }

  getNotes() {
    // Need to make this call the API and populate something I can pass into Note components
    this.state.notesList.map(item => {
      return this.setState({ notes: [...this.state.notes, item] })
    })
  }

  renderNoteItems() {
    const notesList = this.state.notes

    notesList.map(item => {
      <Note
        title={item.note_id}
        content={item.content}
      />
    })
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
