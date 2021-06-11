import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'

import Loading from './Loading'
import UserContext from './UserContext'

function ProtectedRoute(props: any) {
  const { user, isLoading } = useContext(UserContext)
  const { component: Component, ...other } = props

  if (isLoading) {
    return <Loading />;
  }

  if (user) {
    return (
      <Route {...other} render={props => {
        return <Component {...props} />;
      }} />
    );
  }

  return <Redirect to={'/login/'} />;
}

export default ProtectedRoute
