import React, { useContext, useRef } from "react"

import AppContext from '../other/AppContext'
import { ModalStatus } from "../notebooks/NotebookIndex"
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/other/Modal.module.css'

interface ModalProps {
  getNotebooks: Function,
  modalStatus: ModalStatus,
  newNotebookName?: string,
  notebookToAlter?: string,
  setNewNotebookName: React.Dispatch<React.SetStateAction<string>>,
  toggleModal: Function,
}

function Modal({ getNotebooks, modalStatus, newNotebookName, notebookToAlter, setNewNotebookName, toggleModal }: ModalProps) {
  const { user } = useContext(AppContext)
  
  const signal = axios.CancelToken.source()
  
  function createNewNotebook(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
    getNotebooks()
  }

  function deleteNotebook(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    e.preventDefault()
    
    axiosInstance.delete(
      `/api/notebooks/${id}/`, {
        cancelToken: signal.token,
      }
    )
    
    toggleModal(e)
    getNotebooks()
  }

  function editNotebookName(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) {
    e.preventDefault()
    
    axiosInstance.put(
      `/api/notebooks/${id}/`, {
        name: newNotebookName,
      }, {
        cancelToken: signal.token,
      }
    )
    
    toggleModal(e)
    getNotebooks()
  }

  function handleSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault()
    
    switch (modalStatus) {
      case ModalStatus.NewNotebook:
        createNewNotebook(e)
      
      case ModalStatus.DeleteNotebook:
        deleteNotebook(e, notebookToAlter!)
      
      case ModalStatus.RenameNotebook:
        editNotebookName(e, notebookToAlter!)
    }
  }
  
  return (
    <form className={styles['modal-form']}>
      {
        (function renderModalTitle() {
          switch (modalStatus) {
            case ModalStatus.NewNotebook:
              return (
                <h1 className={styles['modal-title']}>
                  Create new notebook&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </h1>
              );
            case ModalStatus.DeleteNotebook:
              return (
                <h1 className={styles['modal-title']}>
                  Are you sure you'd like to delete this notebook?&nbsp;
                </h1>
              );
            case ModalStatus.RenameNotebook:
              return (
                <h1 className={styles['modal-title']}>
                  Edit notebook name&nbsp;&nbsp;&nbsp;&nbsp;
                </h1>
              );
          }
        })()
      }
      {
        (modalStatus === ModalStatus.NewNotebook || ModalStatus.RenameNotebook) &&
        <input type='text' placeholder='Name' name='name' onChange={e => setNewNotebookName(e.target.value)} />
      }
      <div className={styles['modal-buttons']}>
        <span>
          <button className={styles['cancel-button']} onClick={e => toggleModal(e)}>
            Cancel
          </button>
          &nbsp;&nbsp;&nbsp;
          <button className={styles['continue-button']} onClick={e => handleSubmit(e)}>
            Continue
          </button>
        </span>
      </div>
    </form>
  );
}

export default Modal
