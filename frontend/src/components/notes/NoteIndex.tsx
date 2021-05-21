import { NoteDataObject, deserialize } from './Serialization'
import React, { Component } from 'react'

import NoteIndexItem from './NoteIndexItem'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'

interface NoteIndexState {
  isLoading: boolean,
  noteIDs: Array<string>,
  notes: Array<NoteDataObject>,
}

class NoteIndex extends Component<{}, NoteIndexState> {
  constructor(props: any) {
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
    axiosInstance
      .get(`/api/notes/`)
      .then(res => this.setState({ noteIDs: res.data.notes }))
      .catch(err => console.log(err))

    let notes: Array<NoteDataObject> = []

    for (const noteID of this.state.noteIDs) {
      axiosInstance
        .get(`/api/notes/${noteID}/`)
        .then(res => notes.push(res.data))
        .catch(err => console.log(err))
    }

    return notes;
  }

  async renderNoteItems() {
    const notesList = await this.getNotes()
    
    return notesList.map(item => (
      <NoteIndexItem 
        key={item.note_id}
        // @ts-ignore
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
