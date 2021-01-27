import React, { Component } from 'react'

class NotebookIndexItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <tr>
        <th>{this.props.name}</th>
        <th>{this.props.date_modified}</th>
        <th>{this.props.date_created}</th>
      </tr>
    );
  }
}

export default NotebookIndexItem
