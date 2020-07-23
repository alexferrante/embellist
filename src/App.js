import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home, Search, Playlists } from './pages'
import { ProtectedRoute } from './components'

const App = () => {
  const [query, setQuery] = useState('')
  const [playlists, setPlaylists] = useState([])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <header>
        <h1 className='title'></h1>
      </header>
      <main>
        <Switch>
          <Route exact path='/' component={Home} />

          <ProtectedRoute path='/search'>
            <Search
              query={query}
              setQuery={setQuery}
              playlists={playlists}
              setPlaylists={setPlaylists}
            />
          </ProtectedRoute>

          <ProtectedRoute path='/artists/:artistId'>
            <Playlists playlists={playlists} setPlaylists={setPlaylists} />
          </ProtectedRoute>
        </Switch>
      </main>
    </Router>
  )
}

export default App
