import React, { useEffect, useState } from 'react'
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import UserContext, { EditorContext } from './components/other/UserContext'

import Login from './components/pages/Login'
import NewNoteContainer from './components/pages/NewNoteContainer'
import NotebookIndexContainer from './components/pages/NotebookIndexContainer'
import NotebookViewContainer from './components/pages/NotebookViewContainer'
import ProtectedRoute from './components/authentication/ProtectedRoute'
import Signup from './components/pages/Signup'
import Splash from './components/pages/Splash'
import useGetUser from './components/other/useGetUser'

function App() {
  const [ editorContext, setEditorContext ] = useState<EditorContext>()
  const [ searchQuery, setSearchQuery ] = useState<string>('')

  const { user, setUser, isLoadingUser } = useGetUser()
  
  function getEditorContext() {
    if (/\/notebooks\/.*/i.test(location.pathname))
      setEditorContext(EditorContext.NewNoteInNotebook)
    
    else if (/\/notebooks\/.{15}\/notes.*/i.test(location.pathname)) 
      setEditorContext(EditorContext.NoteInNotebook)
    
    else if (/\/all-notes\/.{1,}/i.test(location.pathname))
      setEditorContext(EditorContext.NoteInAllNotes)
    
    else if (/\/new-note\/?/i.test(location.pathname))
      setEditorContext(EditorContext.NewNote)
  }

  useEffect(() => {
    getEditorContext()
  }, [ window.location.href ])
  
  return (
    <Router>
      <UserContext.Provider value={{ editorContext, isLoadingUser, searchQuery, setSearchQuery, user, setUser }}>
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
