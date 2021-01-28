import React, { Component } from 'react'

import NoteIndexItem from './NoteIndexItem'
import axios from 'axios'

class NoteIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
    }
  }

  componentDidMount() {
    this.getNotes()
  }

  getNotes() {
    axios
      .get('/api/notes/')
      .then(res => this.setState({ notes: res.data }))
      .catch(err => console.log(err))
  }

  renderNoteItems() {
    const notesList = this.state.notes
    
    return notesList.map(item => (
      <NoteIndexItem 
        key={item.note_id}
        title={item.title}
        date_modified={item.date_modified}
        date_created={item.date_created}
      />
    ));
  }
  
  render() {
    return (
        <ul>
          {this.renderNoteItems()}
        </ul>
    );
  }
}

export default NoteIndex
