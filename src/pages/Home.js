import React from 'react'
import { Redirect } from 'react-router-dom'
import { attemptLogin, isLoggedIn } from '../auth'
import { loginUrl } from '../api'
import { spotify } from '../icons'

const Home = () => {
  attemptLogin()

  if (isLoggedIn()) {
    return <Redirect to='/search' />
  }

  return (
    <div className='fullscreen'>
      <a className='box login' href={loginUrl}>
        <span>Login</span>
        <img src={spotify} alt='Spotify' draggable={false} />
      </a>
    </div>
  )
}

export default Home
