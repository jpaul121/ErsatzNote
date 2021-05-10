import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import NewNoteContainer from './components/notes/NewNoteContainer';
import NotebookIndexContainer from './components/notebooks/NotebookIndexContainer'
import NotebookViewContainer from './components/notebooks/NotebookViewContainer'
import React from 'react'
import { Signup } from './components/authentication/Signup'

function App(): JSX.Element {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/notebooks/:notebook_id/notes/:note_id'>
            <NotebookViewContainer />
          </Route>
          <Route path='/notebooks/:notebook_id'>
            <NotebookViewContainer />
          </Route>
          <Route path='/notebooks'>
            <NotebookIndexContainer />
          </Route>
          <Route path='/new-note'>
            <NewNoteContainer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App
