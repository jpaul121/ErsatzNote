import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'

import Note from './Note'
import axios from 'axios'
import { withRouter } from 'react-router'

class Notebook extends Component {
  constructor(props) {
    super(props)

    this.state = {
      noteData: null,
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

    return this.setState({ noteData: noteData });
  }

  async renderNotes() {
    await this.getNotes()
    const noteData = this.state.noteData

    return this.setState({
      notes: noteData.map(item => {
        return (
          <Note 
            key={item.note_id}
            title={item.title}
            content={item.content}
          />
        );
      })
    });
  }

  render() {
    console.log(this.state.notes)
    return this.state.notes;
  }
}

const finishedNotebook = withRouter(Notebook)

export default finishedNotebook
