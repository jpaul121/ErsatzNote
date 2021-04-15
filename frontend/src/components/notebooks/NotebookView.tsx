import 'regenerator-runtime/runtime.js'

import { NoteDataObject, getContentPreview, getTitlePreview } from '../notes/Serialization'
import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import { Link } from 'react-router-dom'
import Note from '../notes/Note'
import axios from 'axios'
import styles from './NotebookView.module.css'

function NotebookView(props: RouteComponentProps<{ notebook_id: string }>) {  
  const [ notebookName, setNotebookName ] = useState('')
  const [ noteList, setNoteList ] = useState<NoteDataObject[]>()
  const notebookID = props.match.params.notebook_id
  
  const [ _isLoading, _setLoadingStatus ] = useState(true)
  const _isMounted = useRef(false)

  const signal = axios.CancelToken.source()

  useEffect(() => {
    async function getNotebook(): Promise<[ string, NoteDataObject[] ] | undefined> {      
      try {
        const response = await axios.get(
          `/api/notebooks/${notebookID}`, {
            cancelToken: signal.token,
          }
        )
        const name = response.data.name
        const noteIDs = response.data.notes
        
        let noteData = []
        
        for (let noteID of noteIDs) {
          const noteObject = await axios.get(
            `/api/notes/${noteID}`, {
              cancelToken: signal.token,
            }
          )
    
          noteData.push(noteObject.data)
        }
        
        return [ name, noteData ];
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Error: ', err)
        }
      }
    }
    
    async function loadNotes() {
      const notebookContents = await getNotebook()

      if (notebookContents) {
        const [ name, noteData ] = notebookContents

        console.log(noteData)
  
        if (_isMounted.current) setNotebookName(name)
        if (_isMounted.current) setNoteList(noteData.map(item => {
          return (
            <Link key={item.note_id} to={`/notebooks/${notebookID}/notes/${item.note_id}`}>
              <Note 
                title={getTitlePreview(item)}
                content={getContentPreview(item)}
                date_modified={item.date_modified}
              />
            </Link>
          );
        }) as unknown as NoteDataObject[])
        if (_isMounted.current) _setLoadingStatus(false)
      }
    }

    _isMounted.current = true
    loadNotes()

    return () => {
      signal.cancel('Request is being cancelled.')
    };
  }, [ notebookID ])

  return (
    <div className={styles['notebook-view']}>
      <div className={styles['notebook-header']}>
        <h1 className={styles['notebook-title']}>{notebookName}</h1>
        {
          !_isLoading &&
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
        !_isLoading &&
        <ul className={styles['note-list']}>
          {noteList}
        </ul>
      }
    </div>
  );
}

const finishedNotebookView = withRouter(NotebookView)

export default finishedNotebookView
