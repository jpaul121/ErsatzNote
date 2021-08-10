import 'regenerator-runtime/runtime.js'

import { NoteDataObject, getContentPreview, getTitlePreview } from '../other/Serialization'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import { Link } from 'react-router-dom'
import Note from '../notes/Note'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'
import Trie from '../other/Trie'

import styles from '../../stylesheets/notebooks/NotebookView.module.css'

interface NotePreviewData {
  [ noteID: string ]: {
    note: NoteDataObject,
    trie: Trie,
  },
}

function NotebookView(props: RouteComponentProps<{ notebook_id: string }>) {  
  const [ notebookName, setNotebookName ] = useState('')
  const [ notes, setNotes ] = useState<NotePreviewData>()
  const [ filteredNotes, setFilteredNotes ] = useState<Array<NoteDataObject>>()
  const notebookID = props.match.params.notebook_id
  
  const [ isLoading, setLoadingStatus ] = useState(true)
  const { renderCount, searchQuery } = useContext(UserContext)

  const _isMounted = useRef(false)

  const signal = axios.CancelToken.source()

  function displayNoteCount(): string {
    if (searchQuery && filteredNotes) {
      if (Object.keys(filteredNotes as Object).length === 1) return `1 result`;
      return `${Object.keys(filteredNotes as Object).length} results`;
    } else if (Object.keys(notes as Object).length === 1) return `1 note`;
    return `${Object.keys(notes as Object).length} notes`;
  }
  
  async function generateTokens(note: NoteDataObject): Promise<Set<string>> {
    // Strip the HTML from a note's content and turn it
    // into a collection of unique words that can be searched for
    const strippedTitle = getTitlePreview(note)
    const strippedContent = note['content'].replace(/(<([^>]+)>)/gi, '')
    let wordList = strippedTitle.split(/\s+/).concat(strippedContent.split(/\s+/))
    wordList = wordList.map(word => word.trim().toLowerCase())
    return new Set(wordList);
  }
  
  async function getNotebookData(): Promise<void> {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/${notebookID}/`, {
          cancelToken: signal.token,
        }
      )
      const name = response.data.name
      const noteIDs = response.data.notes
      
      let noteData: Array<NoteDataObject> = []
      for (let noteID of noteIDs) {
        const noteObject = await axiosInstance.get(
          `/api/notes/${noteID}/`, {
            cancelToken: signal.token,
          }
        )
        noteData.push(noteObject.data)
      }
      
      if (_isMounted.current) setNotebookName(name)
      
      let processedNotes: NotePreviewData = {}
      for (const note of noteData) {
        const tokens = await generateTokens(note)
        const noteTrie = new Trie().addWords(tokens)
        processedNotes[note.note_id] = {
          note,
          trie: noteTrie,
        }
      }

      if (_isMounted.current) setNotes(processedNotes)
      if (_isMounted.current) setLoadingStatus(false)
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }
  
  useEffect(() => {
    _isMounted.current = true
    getNotebookData()

    return () => {
      _isMounted.current = false
      signal.cancel('Request is being cancelled.')
    };
  }, [ notebookID, renderCount ])

  useEffect(() => {
    // If the user has input a search query, create a filtered group of
    // notes such that only notes that include possible matches will be included
    if (_isMounted.current && searchQuery && !isLoading) setFilteredNotes(Array.from(
      Object.values(notes as Object).filter(value => {
        return searchQuery.toLowerCase().split(/\s+/).every(token => {
          return value['trie'].includesPossibleMatch(token);
        });
      })
    ))
  }, [ searchQuery ])

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
              displayNoteCount()
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
                <Link key={item['note'].note_id} to={`/notebooks/${notebookID}/notes/${item['note'].note_id}/`}>
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

const finishedNotebookView = withRouter(NotebookView)

export default finishedNotebookView
