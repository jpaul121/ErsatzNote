// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { css, cx } from '@emotion/css'

import Modal from '../other/Modal'
import NotebookData from '../notes/BaseComponents'
import NotebookIndexItem from './NotebookIndexItem'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'

function NotebookIndex() {
  const [ newNotebookName, setNewNotebookName ] = useState('')
  const [ notebooks, setNotebooks ] = useState(null)
  const [ newNotebookModal, setNewNotebookModal ] = useState(false)
  const [ indexLoading, setIndexLoading ] = useState(true)
  const [ renderCount, rerender ] = useState(0)
  const [ deleteNotebookModal, setDeleteNotebookModal ] = useState(false)
  const [ editNotebookModal, setEditNotebookModal ] = useState(false)
  const [ toAlter, setToAlter ] = useState('')
  
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
    toggleNewNotebookModal()
    rerender(renderCount + 1)
  }

  function deleteNotebook(e, id) {
    e.preventDefault()
    axiosInstance.delete(
      `/api/notebooks/${id}/`, {
        cancelToken: signal.token,
      }
    )
    toggleDeleteNotebookModal()
    rerender(renderCount + 1)
  }

  function editNotebookName(e, id) {
    e.preventDefault()
    axiosInstance.put(
      `/api/notebooks/${id}/`, {
        name: newNotebookName,
      }, {
        cancelToken: signal.token,
      }
    )
    toggleEditNotebookModal()
    rerender(renderCount + 1)
  }

  function toggleNewNotebookModal() {
    if (_isMounted.current) setNewNotebookModal(!newNotebookModal)
  }

  function toggleEditNotebookModal(id='') {
    if (_isMounted.current && id !== '') setToAlter(id)
    if (_isMounted.current) setEditNotebookModal(!editNotebookModal)
  }
  
  function toggleDeleteNotebookModal(id='') {
    if (_isMounted.current && id !== '') setToAlter(id)
    if (_isMounted.current) setDeleteNotebookModal(!deleteNotebookModal)
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
            notebookID={item.notebook_id}
            name={item.name}
            dateModified={item.date_modified}
            dateCreated={item.date_created}
            toggleDeleteNotebookModal={toggleDeleteNotebookModal}
            toggleEditNotebookModal={toggleEditNotebookModal}
          />
        );
      }))
    }
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
          <button className={styles['new-notebook']} onClick={() => toggleNewNotebookModal()}>
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
              <th style={{ textAlign: 'right' }}>OPTIONS</th>
              <th></th>
            </tr>
          </thead>
          <tbody className={styles['table-body']}>
            {notebooks}
          </tbody>
        </table>
      </div>
      {
        (function renderModals() {
          switch (true) {
          case (newNotebookModal && !editNotebookModal && !deleteNotebookModal):
            return <Modal 
              changeValue={setNewNotebookName}
              setValue={createNewNotebook}
              toggleModal={toggleNewNotebookModal}
            />;
          case (!newNotebookModal && editNotebookModal && !deleteNotebookModal):
            return <Modal 
              changeValue={setNewNotebookName}
              setValue={editNotebookName}
              toAlter={toAlter}
              toggleModal={toggleEditNotebookModal}
            />;
          case (!newNotebookModal && !editNotebookModal && deleteNotebookModal):
            return <Modal 
              setValue={deleteNotebook}
              toAlter={toAlter}
              toggleModal={toggleDeleteNotebookModal}
            />;
          default:
            break;
        }
      })()
      }
    </div>
  );
}

export default NotebookIndex
