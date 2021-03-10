import React, { Component } from 'react'

import NoteIndexItem from './NoteIndexItem'
import axios from 'axios'
import deserialize from './Deserializer'

class NoteIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      noteIDs: [],
      notes: [],
    }
  }

  componentDidMount() {
    this.getNotes()
  }

  async getNotes() {
    axios
      .get(`/api/notes/`)
      .then(res => this.setState({ noteIDs: res.data.notes }))
      .catch(err => console.log(err))

    let notes = []

    for (const noteID of this.state.noteIDs) {
      axios
        .get(`/api/notes/${noteID}`)
        .then(res => notes.push(res.data))
        .catch(err => console.log(err))
    }

    return notes;
  }

  renderNoteItems() {
    const notesList = await this.getNotes()
    
    return notesList.map(item => (
      <NoteIndexItem 
        key={item.note_id}
        title={deserialize(item.title)}
        date_modified={item.date_modified}
        date_created={item.date_created}
      />
    ));
  }
  
  render() {
    return !this.state.isLoading && (
        <ul>
          {this.renderNoteItems()}
        </ul>
    );
  }
}

export default NoteIndex
