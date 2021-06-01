import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import { Login } from './components/authentication/Login'
import NewNoteContainer from './components/notes/NewNoteContainer';
import NotebookIndexContainer from './components/notebooks/NotebookIndexContainer'
import NotebookViewContainer from './components/notebooks/NotebookViewContainer'
import React from 'react'
import { Signup } from './components/authentication/Signup'
import { Splash } from './components/other/Splash'

function App(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={Splash} />
        <Route path='/notebooks/:notebook_id/notes/:note_id' component={NotebookViewContainer} />
        <Route path='/notebooks/:notebook_id' component={NotebookViewContainer} />
        <Route path='/notebooks' component={NotebookIndexContainer} />
        <Route path='/new-note' component={NewNoteContainer} />
        <Route path='/signup' component={Signup} />
        <Route path='/login' component={Login} />
      </Switch>
    </Router>
  );
}

export default App
