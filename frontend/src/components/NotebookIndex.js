import React, { Component } from 'react'

import NotebookIndexItem from './NotebookIndexItem'
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
      <NotebookIndexItem
        key={item.notebook_id}
        name={item.name}
        date_modified={item.date_modified}
        date_created={item.date_created}
      />
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
