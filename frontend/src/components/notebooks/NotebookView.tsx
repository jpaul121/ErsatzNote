import 'regenerator-runtime/runtime.js'

import { NoteDataObject, getContentPreview, getTitlePreview } from '../other/Serialization'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import { Link } from 'react-router-dom'
import Note from '../notes/Note'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notebooks/NotebookView.module.css'

function NotebookView(props: RouteComponentProps<{ notebook_id: string }>) {  
  const [ notebookName, setNotebookName ] = useState('')
  const [ noteList, setNoteList ] = useState<NoteDataObject[]>()
  const notebookID = props.match.params.notebook_id
  
  const [ isLoading, setLoadingStatus ] = useState(true)
  const { renderCount } = useContext(UserContext)

  const _isMounted = useRef(false)

  const signal = axios.CancelToken.source()

  async function getNotebook(): Promise<[ string, NoteDataObject[] ] | undefined> {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/${notebookID}/`, {
          cancelToken: signal.token,
        }
      )
      const name = response.data.name
      const noteIDs = response.data.notes
      
      let noteData = []
      
      for (let noteID of noteIDs) {
        const noteObject = await axiosInstance.get(
          `/api/notes/${noteID}/`, {
            cancelToken: signal.token,
          }
        )
  
        noteData.push(noteObject.data)
      }
      
      return [ name, noteData ];
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }
  
  async function loadNotes(): Promise<void> {
    const notebookContents = await getNotebook()

    if (notebookContents) {
      const [ name, noteData ] = notebookContents

      if (_isMounted.current) setNotebookName(name)
      if (_isMounted.current) setNoteList(noteData.map(item => {
        return (
          <Link key={item.note_id} to={`/notebooks/${notebookID}/notes/${item.note_id}/`}>
            <Note
              title={getTitlePreview(item)}
              content={getContentPreview(item)}
              date_modified={item.date_modified}
            />
          </Link>
        );
      }) as unknown as NoteDataObject[])
      if (_isMounted.current) setLoadingStatus(false)
    }
  }
  
  useEffect(() => {
    _isMounted.current = true
    loadNotes()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    };
  }, [ notebookID, renderCount ])

  return (
    <div className={styles['notebook-view']}>
      <div className={styles['notebook-header']}>
        <h1 className={styles['notebook-title']}>
          {notebookName}
        </h1>
        {
          !isLoading &&
          <p className={styles['note-count']}>
            {
              noteList?.length == 1
              ? '1 note'
              : `${noteList?.length} notes`
            }
          </p>
        }
      </div>
      {
        !isLoading &&
        <ul className={styles['note-list']}>
          {noteList}
        </ul>
      }
    </div>
  );
}

const finishedNotebookView = withRouter(NotebookView)

export default finishedNotebookView
