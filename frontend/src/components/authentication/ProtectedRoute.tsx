import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'

import AppContext from '../other/AppContext'
import Loading from '../other/Loading'

function ProtectedRoute(props: any) {
  const { user, isLoadingUser } = useContext(AppContext)
  const { component: Component, ...other } = props

  if (isLoadingUser) {
    return <Loading />;
  }

  if (user) {
    return (
      <Route {...other} render={props => {
        return <Component {...props} />;
      }} />
    );
  }

  return <Redirect to={'/login'} />;
}

export default ProtectedRoute
