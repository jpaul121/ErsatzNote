import React, { Component } from 'react'

import axios from 'axios'

class NotesList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: [],
    }
  }

  componentDidMount() {
    this.refreshList()
  }

  refreshList() {
    axios
      .get('/api/notes/')
      .then(res => this.setState({ notes: res.data }))
      .catch(err => console.log(err))
  }

  renderNotes() {
    const notesList = this.state.notes ? this.state.notes : [{title: 'Nothing here!', id: 'nope', date_created: 'nope', date_modified: 'nope'}]
    console.log(notesList)
    
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
          {this.renderNotes()}
        </ul>
    );
  }
}

export default NotesList
