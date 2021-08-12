// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { useContext, useEffect, useRef, useState } from 'react'
import { css, cx } from '@emotion/css'

import Modal from '../other/Modal'
import { NotebookData } from '../notes/BaseComponents'
import NotebookIndexItem from './NotebookIndexItem'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'

enum ModalStatus {
  HIDDEN,
  DELETE_NOTEBOOK,
  EDIT_NOTEBOOK,
  NEW_NOTEBOOK,
}

function NotebookIndex() {
  const [ newNotebookName, setNewNotebookName ] = useState('')
  const [ notebooks, setNotebooks ] = useState<Array<NotebookData>>()
  const [ indexLoading, setIndexLoading ] = useState(true)
  const [ currentModal, setCurrentModal ] = useState<ModalStatus>(ModalStatus.HIDDEN)
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
  }

  function deleteNotebook(e, id) {
    e.preventDefault()
    axiosInstance.delete(
      `/api/notebooks/${id}/`, {
        cancelToken: signal.token,
      }
    )
    toggleDeleteNotebookModal()
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
  }

  function toggleNewNotebookModal() {
    if (_isMounted.current) setCurrentModal(
      currentModal === ModalStatus.HIDDEN
      ? ModalStatus.NEW_NOTEBOOK
      : ModalStatus.HIDDEN
    )
  }

  function toggleEditNotebookModal(id='') {
    if (_isMounted.current && id !== '') setToAlter(id)
    if (_isMounted.current) setCurrentModal(
      currentModal === ModalStatus.HIDDEN
      ? ModalStatus.EDIT_NOTEBOOK
      : ModalStatus.HIDDEN
    )
  }
  
  function toggleDeleteNotebookModal(id='') {
    if (_isMounted.current && id !== '') setToAlter(id)
    if (_isMounted.current) setCurrentModal(
      currentModal === ModalStatus.HIDDEN
      ? ModalStatus.DELETE_NOTEBOOK
      : ModalStatus.HIDDEN
    )
  }

  async function getNotebooks(): void {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/`, {
          cancelToken: signal.token,
        }
      )
      if (_isMounted.current) {
        setNotebooks(response.data as NotebookData)
        setIndexLoading(false)
      }
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message)
      }
    }
  }

  useEffect(() => {
    _isMounted.current = true
    if (_isMounted.current) getNotebooks()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    }
  }, [ notebooks?.length ])

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
            {
              !indexLoading && notebooks.map(item => {
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
              })
            }
          </tbody>
        </table>
      </div>
      {
        (function renderModals() {
          switch (currentModal) {
          case (ModalStatus.NEW_NOTEBOOK):
            return <Modal 
              changeValue={setNewNotebookName}
              setValue={createNewNotebook}
              toggleModal={toggleNewNotebookModal}
            />;
          case (ModalStatus.EDIT_NOTEBOOK):
            return <Modal 
              changeValue={setNewNotebookName}
              setValue={editNotebookName}
              toAlter={toAlter}
              toggleModal={toggleEditNotebookModal}
            />;
          case (ModalStatus.DELETE_NOTEBOOK):
            return <Modal 
              setValue={deleteNotebook}
              toAlter={toAlter}
              toggleModal={toggleDeleteNotebookModal}
            />;
          default:
            return null;
        }
      })()
    }
    </div>
  );
}

export default NotebookIndex
