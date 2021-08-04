import React, { useState } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import Login from './components/authentication/Login'
import NewNoteContainer from './components/notes/NewNoteContainer'
import NotebookIndexContainer from './components/notebooks/NotebookIndexContainer'
import NotebookViewContainer from './components/notebooks/NotebookViewContainer'
import ProtectedRoute from './components/other/ProtectedRoute'
import Signup from './components/authentication/Signup'
import Splash from './components/other/Splash'
import UserContext from './components/other/UserContext'
import useGetUser from './components/other/useGetUser'

function App() {
  const { user, setUser, isLoadingUser } = useGetUser()
  const [ renderCount, setRenderCount ] = useState(0)
  
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, isLoadingUser, renderCount, setRenderCount }}>
        <Switch>
          <Route exact path='/' component={Splash} />
          <ProtectedRoute path='/notebooks/:notebook_id/notes/:note_id' component={NotebookViewContainer} />
          <ProtectedRoute path='/notebooks/:notebook_id' component={NotebookViewContainer} />
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
