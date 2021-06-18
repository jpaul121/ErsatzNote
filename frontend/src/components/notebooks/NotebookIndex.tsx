// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { useContext, useEffect, useRef, useState } from 'react'

import NotebookData from '../notes/BaseComponents'
import NotebookIndexItem from './NotebookIndexItem'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'

function NotebookIndex() {
  const [ newNotebookName, setNewNotebookName ] = useState('')
  const [ notebooks, setNotebooks ] = useState(null)
  const [ modalOpen, setModal ] = useState(false)
  const [ indexLoading, setIndexLoading ] = useState(true)
  const [ renderCount, rerender ] = useState(0)
  
  const { user } = useContext(UserContext)

  const _isMounted = useRef(false)
  const signal = axios.CancelToken.source()

  function createNewNotebook(e) {
    e.preventDefault()
    axiosInstance.post(
      `/api/notebooks/`, {
        name: newNotebookName,
        user,
      }, {
        cancelToken: signal.token,
      }
    )
    toggleModal(e)
    rerender(renderCount + 1)
  }

  async function getNotebooks() {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/`, {
          cancelToken: signal.token,
        }
      )
      return response.data as NotebookData;
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message)
      }
    }
  }

  async function renderNotebookItems() {
    const notebookList = await getNotebooks()
    
    if (_isMounted.current && notebookList) {
      setIndexLoading(false)
      setNotebooks(notebookList.map(item => {
        return (
          <NotebookIndexItem
            key={item.notebook_id}
            id={item.notebook_id}
            name={item.name}
            date_modified={item.date_modified}
            date_created={item.date_created}
          />
        );
      }))
    }
  }
  
  function toggleModal(e) {
    e.preventDefault()
    setModal(!modalOpen)
  }

  useEffect(() => {
    _isMounted.current = true
    if (_isMounted.current) renderNotebookItems()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    }
  }, [ renderCount ])

  return !indexLoading as ReactElement<any> && (
    <div className={styles['notebook-index']}>
      <div className={styles['notebook-table']}>
        <div className={styles['table-top']}>
          <h3 className={styles['table-header']}>
            Notebooks
          </h3>
          <button className={styles['new-notebook']} onClick={e => toggleModal(e)}>
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
            {notebooks}
          </tbody>
        </table>
      </div>
      {
        modalOpen &&
        <form className={styles['create-notebook-form']}>
          <h1 className={styles['notebook-title']}>
            Create new notebook&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </h1>
          <input type='text' placeholder='Name' name='name' onChange={e => setNewNotebookName(e.target.value)} />
          <div className={styles['new-notebook-buttons']}>
            <span>
              <button className={styles['cancel']} onClick={e => toggleModal(e)}>
                Cancel
              </button>
              &nbsp;&nbsp;&nbsp;
              <button className={styles['continue']} onClick={e => createNewNotebook(e)}>
                Continue
              </button>
            </span>
          </div>
        </form>
      }
    </div>
  );
}

export default NotebookIndex
