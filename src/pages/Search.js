import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { searchArtists } from '../api'
import { searchUsersPlaylists } from '../api'
import { search } from '../icons'
import { Artist } from '../components'

const Search = ({ query, setQuery, artists, setArtists }) => {
  const [delay, setDelay] = useState()
  const [isDirty, setIsDirty] = useState(artists.length)

  const handleChange = e => {
    const query = e.target.value

    setQuery(query)
    setIsDirty(true)

    delay && clearTimeout(delay)

    if (query) {
      setDelay(
        setTimeout(() => searchArtists(query).then(setArtists), 250)
      )
    } else {
      setArtists([])
    }
  }

  return (
    <>
      <div className={clsx('flex', !isDirty && 'fullscreen')}>
        <div className='box search'>
          <input
            autoFocus
            className='search-box'
            placeholder='Search for an artist...'
            value={query}
            onChange={handleChange}
          />
          <img src={search} alt='Search' draggable={false} />
        </div>
      </div>
      <div className='cards'>
        {artists.map(artist => <Artist {...artist} key={artist.id} />)}
      </div>
    </>
  )
}

Search.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  artists: PropTypes.arrayOf(PropTypes.object).isRequired,
  setArtists: PropTypes.func.isRequired
}

export default Search
