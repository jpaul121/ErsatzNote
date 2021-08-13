import React, { useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import AsyncSelect from 'react-select/async'
import { NotebookData } from '../other/Serialization'
import { NotebookOption } from './NoteEditor'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'

function ChangeNotebook({ currentNotebook, match, setCurrentNotebook }: {
  currentNotebook: NotebookOption | null,
  setCurrentNotebook: React.Dispatch<React.SetStateAction<NotebookOption | null>>,
} & RouteComponentProps<{ note_id?: string, notebook_id?: string }>) {
  const [ notebookOptions, setNotebookOptions ] = useState<NotebookOption[] | null>(null)
  
  const _isMounted = useRef(false)
  const signal = axios.CancelToken.source()

  const customStyles = {
    control: (base: any) => ({
      ...base,
      width: 300,
      minWidth: 300,
    })
  }

  async function getNotebookOptions() {
    try {
      const response = await axiosInstance.get(
        `/api/notebooks/`, {
          cancelToken: signal.token,
        }
      )
      
      const notebookList: NotebookData[] = response.data
      let options = []

      for (let notebook of notebookList) {
        options.push(
          {
            label: notebook.name,
            value: notebook.notebook_id,
          }
        )
      }
  
      if (_isMounted.current) setNotebookOptions(options)
      if (_isMounted.current && notebookOptions) setCurrentNotebook(
        notebookOptions[notebookOptions.findIndex(notebook => notebook.value === match.params.notebook_id)]
      )
      
      return options;
    } catch(err) {
      if (axios.isCancel(err)) {
        console.log(`Error: ${err.message}`)
      }
    }
  }

  useEffect(() => {
    if (!notebookOptions) getNotebookOptions()
  }, [ notebookOptions ])

  return (
    <AsyncSelect
      // @ts-ignore
      loadOptions={getNotebookOptions}
      cacheOptions
      defaultOptions
      value={currentNotebook}
      defaultValue={
        notebookOptions
        ? notebookOptions[notebookOptions.findIndex(notebook => notebook.value === match.params.notebook_id)]
        : null
      }
      onChange={option => setCurrentNotebook(option)}
      placeholder='Select Notebook...'
      styles={customStyles}
    />
  );
}

// @ts-ignore
const finishedChangeNotebook = withRouter(ChangeNotebook)

export default finishedChangeNotebook
