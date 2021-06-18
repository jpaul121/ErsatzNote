import { NoteDataObject, deserialize } from '../other/Serialization'
import React, { useEffect, useState } from 'react'

import NoteIndexItem from './NoteIndexItem'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'

function NoteIndex() {
  const [ isLoading, setLoading ] = useState(true)
  const [ noteIDs, setNoteIDs ] = useState([])

  const signal = axios.CancelToken.source()

  async function getNotes() {
    try {
      const response = await axiosInstance.get(
        `/api/notes/`, {
          cancelToken: signal.token,
        }
      )
      
      setNoteIDs(response.data.notes)

      let notes: NoteDataObject[] = []

      for (const noteID of noteIDs) {
        axiosInstance
          .get(`/api/notes/${noteID}/`)
          .then(res => notes.push(res.data))
          .catch(err => console.log(err))
      }

      return notes;
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    getNotes()
  }, [])

  async function renderNoteItems() {
    const notesList: NoteDataObject[] | undefined = await getNotes()

    if (notesList) return notesList.map(item => (
      <NoteIndexItem
        key={item.note_id}
        // @ts-ignore
        title={deserialize(item.title)}
        date_modified={item.date_modified}
        date_created={item.date_created}
      />
    ));
    
    setLoading(false)
  }
  
  return !isLoading && (
      <ul>
        {renderNoteItems()}
      </ul>
  );
}

export default NoteIndex
