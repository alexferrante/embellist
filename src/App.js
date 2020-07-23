import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Home, Search, Albums } from './pages'
import { ProtectedRoute } from './components'

const App = () => {
  const [query, setQuery] = useState('')
  const [artists, setArtists] = useState([])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <header>
        <h1 className='title'>Spotify Artist Search</h1>
      </header>
      <main>
        <Switch>
          <Route exact path='/' component={Home} />

          <ProtectedRoute path='/search'>
            <Search
              query={query}
              setQuery={setQuery}
              artists={artists}
              setArtists={setArtists}
            />
          </ProtectedRoute>

          <ProtectedRoute path='/artists/:artistId'>
            <Albums artists={artists} setArtists={setArtists} />
          </ProtectedRoute>
        </Switch>
      </main>
    </Router>
  )
}

export default App
