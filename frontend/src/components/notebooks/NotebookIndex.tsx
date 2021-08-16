// @ts-nocheck

import 'regenerator-runtime/runtime.js'

import React, { useEffect, useRef, useState } from 'react'

import Modal from '../other/Modal'
import { NotebookData } from '../notes/EditorComponents'
import NotebookIndexItem from './NotebookIndexItem'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'

export enum ModalStatus {
  Hidden,
  DeleteNotebook,
  NewNotebook,
  RenameNotebook,
}

function NotebookIndex() {
  const [ newNotebookName, setNewNotebookName ] = useState('')
  const [ notebooks, setNotebooks ] = useState<Array<NotebookData>>()
  const [ indexLoading, setIndexLoading ] = useState(true)
  const [ modalStatus, setModalStatus ] = useState<Modal>(ModalStatus.Hidden)
  const [ notebookToAlter, setNotebookToAlter ] = useState('')

  const _isMounted = useRef(false)
  const signal = axios.CancelToken.source()

  async function getNotebooks() {
    setIndexLoading(true)
    
    try {
      axiosInstance.get(
        `/api/notebooks/`, {
          cancelToken: signal.token,
        }
      )
      .then(response => {
        if (_isMounted.current) {
          setNotebooks(response.data as NotebookData)
          setIndexLoading(false)
        }
      })
    } 
    
    catch(err) {
      if (axios.isCancel(err)) {
        console.log('Error: ', err.message)
      }
    }
  }

  function toggleModal(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, newModalStatus=ModalStatus.Hidden, id='') {
    e.preventDefault()
    
    if (newModalStatus === ModalStatus.Hidden)
      setModalStatus(newModalStatus)
    
    if (id !== '')
      setNotebookToAlter(id)
    
    switch (modalStatus) {
      case ModalStatus.NewNotebook:
        if (_isMounted.current) setCurrentModalStatus(
          currentModalStatus === ModalStatus.Hidden
          ? ModalStatus.NewNotebook
          : ModalStatus.Hidden
        )
      
      case ModalStatus.RenameNotebook:
        if (_isMounted.current && id !== '') setNotebookToAlter(id)
        if (_isMounted.current) setCurrentModalStatus(
          currentModalStatus === ModalStatus.Hidden
          ? ModalStatus.RenameNotebook
          : ModalStatus.Hidden
        )
      
      case ModalStatus.DeleteNotebook:
        if (_isMounted.current && id !== '') setNotebookToAlter(id)
        if (_isMounted.current) setCurrentModalStatus(
          currentModalStatus === ModalStatus.Hidden
          ? ModalStatus.DeleteNotebook
          : ModalStatus.Hidden
        )
    }
  }

  useEffect(() => {
    _isMounted.current = true
    if (_isMounted.current) getNotebooks()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    }
  }, [ modalStatus, JSON.stringify(notebooks) ])

  return !indexLoading as ReactElement<any> && (
    <div className={styles['notebook-index']}>
      <div className={styles['notebook-table']}>
        <div className={styles['table-top']}>
          <h3 className={styles['table-header']}>
            Notebooks
          </h3>
          <button className={styles['new-notebook']} onClick={e => toggleModal(e, ModalStatus.NewNotebook)}>
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
                    toggleModal={toggleModal}
                  />
                );
              })
            }
          </tbody>
        </table>
      </div>
      {
        (modalStatus !== ModalStatus.Hidden) &&
        <Modal
          getNotebooks={getNotebooks}
          modalStatus={modalStatus}
          newNotebookName={newNotebookName}
          notebookToAlter={notebookToAlter}
          setNewNotebookName={setNewNotebookName}
          toggleModal={toggleModal}
        />
      }
    </div>
  );
}

export default NotebookIndex
