import React, { Componeont } from 'react'

class Note extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <p>{this.props.content}</p>
      </div>
    );
  }
}

export default Note
