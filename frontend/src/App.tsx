import React, { useState } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import Login from './components/pages/Login'
import NewNoteContainer from './components/pages/NewNoteContainer'
import NotebookIndexContainer from './components/pages/NotebookIndexContainer'
import NotebookViewContainer from './components/pages/NotebookViewContainer'
import ProtectedRoute from './components/authentication/ProtectedRoute'
import Signup from './components/pages/Signup'
import Splash from './components/pages/Splash'
import UserContext from './components/other/UserContext'
import useGetUser from './components/other/useGetUser'

function App() {
  const { user, setUser, isLoadingUser } = useGetUser()
  const [ renderCount, setRenderCount ] = useState(0)
  const [ searchQuery, setSearchQuery ] = useState<string>('')
  
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, isLoadingUser, renderCount, setRenderCount, searchQuery, setSearchQuery }}>
        <Switch>
          <Route exact path='/' component={Splash} />
          <ProtectedRoute path='/notebooks/:notebook_id/notes/:note_id' component={NotebookViewContainer} />
          <ProtectedRoute path='/notebooks/:notebook_id' component={NotebookViewContainer} />
          <ProtectedRoute path='/all-notes/:note_id' component={NotebookViewContainer} />
          <ProtectedRoute path='/all-notes' component={NotebookViewContainer} />
          <ProtectedRoute path='/notebooks' component={NotebookIndexContainer} />
          <ProtectedRoute path='/new-note' component={NewNoteContainer} />
          <Route path='/signup' component={Signup} />
          <Route path='/login' component={Login} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App
