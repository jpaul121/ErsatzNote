import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import NotebookIndex from './components/NotebookIndex'
import React from 'react'

function App() {
  return (
    <Router>
      <div>
        <h1>ErsatzNote</h1>
        <Switch>
          <Route path='/notebooks'>
            <NotebookIndex />
          </Route>
          <Route path='/'>
            <h2>Home</h2>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App
