import React, { createContext } from 'react'

export enum EditorContext {
  NewNote,
  NewNoteInNotebook,
  NoteInAllNotes,
  NoteInNotebook,
  NoEditor,
}

interface ErsatzNoteContext {
  editorContext?: EditorContext,
  isLoadingUser: boolean,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  setUser: React.Dispatch<React.SetStateAction<string | null>> | null,
  searchQuery: string,
  user: string | null,
}

const initialValue: ErsatzNoteContext = {
  user: null,
  searchQuery: '',
  setSearchQuery: () => {},
  setUser: null,
  isLoadingUser: false,
}

const UserContext = createContext<ErsatzNoteContext>(initialValue)

export default UserContext
