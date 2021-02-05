import React, { Component } from 'react'

import { Link } from 'react-router-dom'

class NotebookIndexItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const notebook_id = this.props.id
    
    return (
      <tr>
        <th><Link to={`/notebooks/${notebook_id}`}>{this.props.name}</Link></th>
        <th>{this.props.date_modified}</th>
        <th>{this.props.date_created}</th>
      </tr>
    );
  }
}

export default NotebookIndexItem
