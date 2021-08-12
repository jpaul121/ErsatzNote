import React, { useContext, useEffect, useRef, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router'

import AsyncSelect from 'react-select/async'
import { NotebookData } from '../notes/BaseComponents'
import { NotebookOption } from './NoteEditor'
import UserContext from '../other/UserContext'
import axios from 'axios'
import { axiosInstance } from '../../axiosAPI'

function ChangeNotebook({ filterNotebookOptions, getNotebookOptions, match, setCurrentNotebook, currentNotebook }: {
  currentNotebook: Array<NotebookOption> | undefined,
  filterNotebookOptions: (newNotebookName: string) => Array<NotebookOption> | undefined,
  getNotebookOptions: (inputValue: string | undefined, callback: Function) => void,
  setCurrentNotebook: React.Dispatch<React.SetStateAction<Array<NotebookOption> | undefined>>,
} & RouteComponentProps<{ note_id?: string, notebook_id?: string }>) {
  
  const customStyles = {
    control: (base: any) => ({
      ...base,
      width: 300,
      minWidth: 300,
    })
  }

  function handleChange(newNotebookName: string) {
    // Set the new value in state, return newNotebookName.
    // It will then call the loadOptions function with the 
    // newNotebookName as a parameter. 
    setCurrentNotebook(filterNotebookOptions(newNotebookName))
    return newNotebookName;
  }

  return (
    <AsyncSelect
      // @ts-ignore
      defaultOptions
      loadOptions={getNotebookOptions}
      onInputChange={handleChange}
      placeholder='Select Notebook...'
      styles={customStyles}
    />
  );
}

// @ts-ignore
const finishedChangeNotebook = withRouter(ChangeNotebook)

export default finishedChangeNotebook
