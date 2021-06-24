import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import Login from './components/authentication/Login'
import NewNoteContainer from './components/notes/NewNoteContainer';
import NotebookIndexContainer from './components/notebooks/NotebookIndexContainer'
import NotebookViewContainer from './components/notebooks/NotebookViewContainer'
import ProtectedRoute from './components/other/ProtectedRoute'
import React from 'react'
import Signup from './components/authentication/Signup'
import Splash from './components/other/Splash'
import UserContext from './components/other/UserContext'
import useGetUser from './components/other/useGetUser'
import { useState } from 'react'

function App(): JSX.Element {
  const { user, setUser, isLoading } = useGetUser()
  const [ renderCount, rerender ] = useState(0)
  
  return (
    <Router>
      <UserContext.Provider value={{ user, setUser, isLoading, renderCount, rerender }}>
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
