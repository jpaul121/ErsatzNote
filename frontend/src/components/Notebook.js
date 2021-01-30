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
    const id = this.props.match.params.notebook_id
    
    axios
      .get(`/api/notebooks/${id}`)
      .then(res => { this.setState({ notesList: res.data.notes }) })
      .catch(err => console.log(err))
  }

  getNotes() {
    this.state.notesList.map(item => {
      return this.setState({ notes: [...notes, item] })
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

Notebook = withRouter(Notebook)

export default Notebook
