import React, { Component } from 'react'

class NoteIndexItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <li>
        <span>
          {this.props.title}
        </span>
        <span>
          {this.props.date_modified}
          {this.props.date_created}
        </span>
      </li>
    );
  }
}

export default NoteIndexItem
