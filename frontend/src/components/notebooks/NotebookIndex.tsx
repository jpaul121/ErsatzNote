// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { Component } from 'react'

import NotebookIndexItem from './NotebookIndexItem'
import axios from 'axios'
import styles from './NotebookIndex.module.css'

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
      <div className={styles['notebook-index']}>
        <div className={styles['notebook-table']}>
          <div className={styles['table-top']}>
            <h3 className={styles['table-header']}>
              Notebooks
            </h3>
            <button className={styles['new-notebook']}>
              <i className={'fas fa-book-medical'}></i>
              &nbsp;&nbsp;New Notebook
            </button>
          </div>
          <table className={styles['table-proper']}>
            <thead className={styles['table-head']}>
              <tr className={styles['header-row']}>
                <th></th>
                <th>TITLE</th>
                <th>LAST UPDATED</th>
                <th>CREATED</th>
              </tr>
            </thead>
            <tbody className={styles['table-body']}>
              {this.state.notebooks}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default NotebookIndex
