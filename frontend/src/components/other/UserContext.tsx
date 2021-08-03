import { createContext } from 'react'

interface ErsatzNoteContext {
  user: string | null,
  setUser: React.Dispatch<React.SetStateAction<string | null>> | null,
  isLoading: boolean,
  renderCount?: number,
  rerender?: React.Dispatch<React.SetStateAction<number>>,
}

const initialValue: ErsatzNoteContext = {
  user: null,
  setUser: null,
  isLoading: false,
}

const UserContext = createContext<ErsatzNoteContext>(initialValue)

export default UserContext
