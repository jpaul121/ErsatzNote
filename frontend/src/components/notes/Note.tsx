import React, { Component } from 'react'

import { NoteDataObject } from '../other/Serialization'

class Note extends Component<NoteDataObject> {
  constructor(props: NoteDataObject) {
    super(props)
  }

  render() {
    return (
      <li>
        <h3>{this.props.title}</h3>
        <p>{this.props.content}</p>
        <h4>{this.props.date_modified}</h4>
      </li>
    );
  }
}

export default Note
