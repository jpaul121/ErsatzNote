import React, { Component } from 'react'

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
      <li key={item.id}>
        <span>
          {item.title}
        </span>
        <span>
          {item.date_modified}
          {item.date_created}
        </span>
      </li>
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
