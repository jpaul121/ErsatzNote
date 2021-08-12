import { NoteDataObject, deserialize } from '../other/Serialization'
import React, { useEffect, useRef, useState } from 'react'

import NoteIndexItem from './NoteIndexItem'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'

function NoteIndex() {
  const [ isLoading, setLoading ] = useState(true)
  const [ notes, setNotes ] = useState<Array<NoteDataObject>>()
  const [ noteIDs, setNoteIDs ] = useState([])

  const _isMounted = useRef(false)

  const signal = axios.CancelToken.source()

  async function getNotes() {
    try {
      const response = await axiosInstance.get(
        `/api/notes/`, {
          cancelToken: signal.token,
        }
      )
      
      setNoteIDs(response.data.notes)

      let noteData: NoteDataObject[] = []
      for (const noteID of noteIDs) {
        axiosInstance
          .get(`/api/notes/${noteID}/`)
          .then(res => noteData.push(res.data))
          .catch(err => console.log(err))
      }

      if (_isMounted.current) {
        setNotes(noteData)
        setLoading(false)
      }
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    _isMounted.current = true
    getNotes()
    return () => {
      _isMounted.current = false
    };
  }, [ notes?.length ])
  
  return !isLoading && (
      <ul>
        {
          notes && notes.map(item => (
            <NoteIndexItem
              key={item.note_id}
              // @ts-ignore
              title={deserialize(item.title)}
              date_modified={item.date_modified}
              date_created={item.date_created}
            />
          ))
        }
      </ul>
  );
}

export default NoteIndex
