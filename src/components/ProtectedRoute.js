import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'
import { isLoggedIn } from '../auth'

const ProtectedRoute = ({ component: Component, children, render, ...props }) => (
  <Route {...props} render={() => {
    if (isLoggedIn()) {
      if (Component) {
        return <Component {...props} />
      } else if (render) {
        return render(props)
      } else {
        return children
      }
    }

    return <Redirect to='/' />
  }} />
)

ProtectedRoute.propTypes = {
  component: PropTypes.elementType,
  render: PropTypes.func,
  children: PropTypes.node
}

export default ProtectedRoute
