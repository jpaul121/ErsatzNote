import React, { createContext } from 'react'

interface ErsatzNoteContext {
  user: string | null,
  setUser: React.Dispatch<React.SetStateAction<string | null>> | null,
  isLoading: boolean,
}

const initialValue: ErsatzNoteContext = {
  user: null,
  setUser: null,
  isLoading: false,
}

const UserContext = createContext<ErsatzNoteContext>(initialValue)

export default UserContext
