import React, { createContext } from 'react'

interface ErsatzNoteContext {
  user: string | null,
  setUser: React.Dispatch<React.SetStateAction<string | null>> | null,
  isLoadingUser: boolean,
  renderCount?: number,
  setRenderCount?: React.Dispatch<React.SetStateAction<number>>,
}

const initialValue: ErsatzNoteContext = {
  user: null,
  setUser: null,
  isLoadingUser: false,
}

const UserContext = createContext<ErsatzNoteContext>(initialValue)

export default UserContext
