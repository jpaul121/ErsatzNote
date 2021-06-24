// @ts-nocheck

import React, { useRef } from 'react'
import { css, cx } from '@emotion/css'

import { Link } from 'react-router-dom'
import styles from '../../stylesheets/notebooks/NotebookIndex.module.css'
import { useDetectOutsideClick } from '../notes/BaseComponents'

function NotebookIndexItem({ notebookID, name, dateModified, dateCreated, toggleDeleteNotebookModal, toggleEditNotebookModal }) {  
  const dropdownRef = useRef(null)
  const [ isActive, setIsActive ] = useDetectOutsideClick(dropdownRef, false)
  
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
                  <a className={styles['deleteNotebook']} onClick={() => toggleDeleteNotebookModal(notebookID)}>
                    <i className='fa fa-trash'></i>&nbsp;
                    Delete
                  </a>
                </li>
                <li>
                  <a className={styles['editNotebookName']} onClick={() => toggleEditNotebookModal(notebookID)}>
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
