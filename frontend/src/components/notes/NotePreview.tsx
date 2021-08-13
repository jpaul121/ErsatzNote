import 'regenerator-runtime/runtime.js'

import { Link, useLocation } from 'react-router-dom'
import { NoteData, getContentPreview, getTitlePreview } from '../other/Serialization'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import AppContext from '../other/AppContext'
import Note from '../notes/Note'
import { Trie } from '../../types'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import styles from '../../stylesheets/notes/NotePreview.module.css'

interface NotePreviewData {
  [ noteID: string ]: {
    note: NoteData,
    trie: Trie,
  },
}

function NotePreview(props: RouteComponentProps<{ notebook_id?: string, note_id?: string }>) {  
  const [ notes, setNotes ] = useState<NotePreviewData>()
  const [ filteredNotes, setFilteredNotes ] = useState<NotePreviewData>()
  const [ notebookName, setNotebookName ] = useState()
  const [ isLoading, setLoadingStatus ] = useState(true)
  
  const { searchQuery } = useContext(AppContext)
  const location = useLocation()

  const _isMounted = useRef(false)

  const signal = axios.CancelToken.source()
  
  function generateTokens(note: NoteData): Set<string> {
    const titleText = getTitlePreview(note)
    const contentText = note['content']
      .replace(/(<([^>]+)>)/g, '')
      .replace(/[!,\.\?]/g, '')
      .replace('&#39;', '\'')
    
    let wordList = titleText.split(/\s+/).concat(contentText.split(/\s+/))
    wordList = wordList.map(word => word.trim().toLowerCase())

    console.log(wordList)
    
    return new Set(wordList);
  }
  
  async function getAllNotes(): Promise<Array<NoteData> | undefined> {
    try {
      const { data } = await axiosInstance.get(`/api/notes/`, {
          cancelToken: signal.token,
        }
      )

      return data.map((note: NoteData) => {
        return {
          ...note,
          title: JSON.parse(note.title as string),
        };
      });
    }
    
    catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }
  
  async function getNotesFromNotebook(): Promise<Array<NoteData> | undefined> {
    try {
      let noteData: Array<NoteData> = []

      const response = await axiosInstance.get(
        `/api/notebooks/${props.match.params.notebook_id}/`, {
          cancelToken: signal.token,
        }
      )
      
      for (let noteID of response.data.notes) {
        const { data } = await axiosInstance.get(`/api/notes/${noteID}/`, {
            cancelToken: signal.token,
          }
        )
        noteData.push(data)
      }

      if (_isMounted.current) setNotebookName(response.data.name)

      return noteData;
    }
    
    catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }
  
  async function getNoteData(): Promise<void> {
    const noteData = props.match.params.notebook_id
      ? await getNotesFromNotebook()
      : await getAllNotes()

    let processedNotes: NotePreviewData = {}
    for (const note of noteData!) {
      const tokens = generateTokens(note)
      const noteTrie = new Trie().addWords(tokens)
      processedNotes[note.note_id] = {
        note,
        trie: noteTrie,
      }
    }

    if (_isMounted.current) setNotes(processedNotes)
    if (_isMounted.current) setLoadingStatus(false)
  }
  
  useEffect(() => {
    _isMounted.current = true
    if (location.pathname === '/all-notes') setNotebookName(undefined)
    getNoteData()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    };
  }, [ location.pathname, JSON.stringify(notes) ])

  useEffect(() => {
    // If the user types in a search query, create a filtered group of
    // notes such that only notes that include possible matches will be included
    if (_isMounted.current && searchQuery && !isLoading) setFilteredNotes(Object.fromEntries(
      Object.entries(notes as Object).filter(item => {
        return searchQuery.toLowerCase().split(/\s+/).every(token => {
          return item[1].trie.includesPossibleMatch(token);
        });
      })
    ))
  }, [ searchQuery ])

  return (
    <div className={styles['notebook-view']}>
      <div className={styles['notebook-header']}>
        <h1 className={styles['notebook-title']}>
          {notebookName ? notebookName : 'All Notes'}
        </h1>
        {
          !isLoading &&
          <p className={styles['note-count']}>
            {
              (
                function displayNoteCount() {
                  if (searchQuery && filteredNotes) {
                    if (Object.keys(filteredNotes as Object).length === 1)
                      return `1 result`;
                    
                    return `${Object.keys(filteredNotes as Object).length} results`;
                  }
                  
                  else if (Object.keys(notes as Object).length === 1)
                    return `1 note`;
                  
                  return `${Object.keys(notes as Object).length} notes`;
                }
              )()
            }
          </p>
        }
      </div>
      {
        !isLoading &&
        <ul className={styles['note-list']}>
          {
            Object.values(((searchQuery && filteredNotes) ? filteredNotes : notes) as Object).map(item => {
              return (
                <Link
                  key={item['note'].note_id}
                  to={
                    props.match.params.notebook_id
                    ? `/notebooks/${item['note'].notebook}/notes/${item['note'].note_id}/`
                    : `/all-notes/${item['note'].note_id}/`
                  }
                >
                  <Note
                    note_id={item['note'].note_id}
                    title={getTitlePreview(item['note'])}
                    content={getContentPreview(item['note'])}
                    date_modified={item['note'].date_modified}
                  />
                </Link>
              );
            })
          }
        </ul>
      }
    </div>
  );
}

const finishedNotePreview = withRouter(NotePreview)

export default finishedNotePreview
