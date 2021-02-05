import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'

import NotebookIndexItem from './NotebookIndexItem'
import axios from 'axios'

class NotebookIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      notebooks: null,
    }
  }

  async componentDidMount() {
    await this.renderNotebookItems()
  }

  async getNotebooks() {
    const response = await axios.get('/api/notebooks/')

    return response.data;
  }

  async renderNotebookItems() {
    const notebookList = await this.getNotebooks()

    this.setState({
      isLoading: false,
      notebooks: notebookList.map(item => {
        return (
          <NotebookIndexItem
            key={item.notebook_id}
            id={item.notebook_id}
            name={item.name}
            date_modified={item.date_modified}
            date_created={item.date_created}
          />
        );
      })
    })
  }

  render() {
    return !this.state.isLoading && (
      <table>
        <thead>
          <tr>
            <th>TITLE</th>
            <th>LAST UPDATED</th>
            <th>CREATED</th>
          </tr>
        </thead>
        <tbody>
          {this.state.notebooks}
        </tbody>
      </table>
    );
  }
}

export default NotebookIndex
