// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { useContext, useEffect, useState } from 'react'

import NotebookIndexItem from './NotebookIndexItem'
import UserContext from '../other/UserContext'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'

function NotebookIndex() {
  const { user } = useContext(UserContext)
  const [ newNotebookName, setNewNotebookName ] = useState('')
  const [ notebooks, setNotebooks ] = useState(null)
  const [ modalOpen, setModal ] = useState(false)
  const [ indexLoading, setIndexLoading ] = useState(true)

  function createNewNotebook(e) {
    e.preventDefault()
    axiosInstance.post(
      `/api/notebooks/`,
      {
        name: newNotebookName,
        user,
      }
    )
    toggleModal(e)
  }

  async function getNotebooks() {
    const response = await axiosInstance.get(`/api/notebooks/`)

    return response.data;
  }
  
  function toggleModal(e) {
    e.preventDefault()
    setModal(!modalOpen)
  }

  useEffect(() => {
    async function renderNotebookItems() {
      const notebookList = await getNotebooks()

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

    renderNotebookItems()
  }, [])

  return !indexLoading && (
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
            <i id={styles['close-modal']} className='fas fa-times'></i>
          </h1>
          <p className={styles['.notebook-tagline']}>
            Notebooks are useful for grouping notes around a common topic.
          </p>
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
