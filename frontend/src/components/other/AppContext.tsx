import React, { createContext } from 'react'

interface TwoNoteContext {
  isLoadingUser: boolean,
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>,
  setUser: React.Dispatch<React.SetStateAction<string | null>> | null,
  searchQuery: string,
  user: string | null,
}

const initialContextValue: TwoNoteContext = {
  user: null,
  searchQuery: '',
  setSearchQuery: () => {},
  setUser: null,
  isLoadingUser: false,
}

const AppContext = createContext<TwoNoteContext>(initialContextValue)

export default AppContext
