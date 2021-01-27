import React, { Component } from 'react'

import axios from 'axios'

class NotebookIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notebooks: [],
    }
  }

  componentDidMount() {
    this.getNotebooks()
  }

  getNotebooks() {
    axios
      .get('/api/notebooks/')
      .then(res => this.setState({ notebooks: res.data }))
      .catch(err => console.log(err))
  }

  renderNotebookItems() {
    const notebookList = this.state.notebooks

    return notebookList.map(item => (
      <tr key={item.id}>
        <th>{item.name}</th>
        <th>{item.date_modified}</th>
        <th>{item.date_created}</th>
      </tr>
    ));
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>TITLE</th>
            <th>LAST UPDATED</th>
            <th>CREATED</th>
          </tr>
        </thead>
        <tbody>
          {this.renderNotebookItems()}
        </tbody>
      </table>
    );
  }
}

export default NotebookIndex
