// @ts-nocheck

import React, { useRef } from 'react'

import { Link } from 'react-router-dom'
import { ModalStatus } from '../notebooks/NotebookIndex'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'
import useDetectOutsideClick from '../../hooks/useDetectOutsideClick'

function NotebookIndexItem({ dateCreated, dateModified, name, notebookID, toggleModal }) {  
  const [ isActive, setIsActive ] = useDetectOutsideClick(dropdownRef, false)

  const dropdownRef = useRef(null)
  
  return (
    <tr>
      <th></th>
      <th><Link to={`/notebooks/${notebookID}`}>{name}</Link></th>
      <th>{dateModified}</th>
      <th>{dateCreated}</th>
      <th>
        <div className={styles['dropdown-menu']}>
          <button onClick={() => setIsActive(!isActive)}>
            <i className='fas fa-align-justify'></i>
          </button>
          {
            isActive &&
            <nav
              ref={dropdownRef}
            >
              <ul>
                <li>
                  <a className={styles['deleteNotebook']} onClick={e => toggleModal(e, ModalStatus.DeleteNotebook, notebookID)}>
                    <i className='fa fa-trash'></i>&nbsp;
                    Delete
                  </a>
                </li>
                <li>
                  <a className={styles['editNotebookName']} onClick={e => toggleModal(e, ModalStatus.RenameNotebook, notebookID)}>
                    <i className='fas fa-pencil-alt'></i>&nbsp;
                    Rename
                  </a>
                </li>
              </ul>
            </nav>
          }
        </div>
      </th>
      <th></th>
    </tr>
  );
}

export default NotebookIndexItem
