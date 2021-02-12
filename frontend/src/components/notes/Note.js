import React, { Component } from 'react'

class Note extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h3>{this.props.title}</h3>
        <p>{this.props.content}</p>
      </div>
    );
  }
}

export default Note
