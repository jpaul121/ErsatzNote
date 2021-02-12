import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import Notebook from './components/notebooks/Notebook'
import NotebookIndex from './components/notebooks/NotebookIndex'
import NotebookIndexContainer from './components/notebooks/NotebookIndexContainer'
import React from 'react'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path='/notebooks/:notebook_id/'>
            <Notebook />
          </Route>
          <Route path='/notebooks'>
            <NotebookIndex />
          </Route>
          <Route path='/'>
            <NotebookIndexContainer />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App
