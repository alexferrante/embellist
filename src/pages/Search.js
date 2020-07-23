import React, { useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { getUsersPlaylists } from '../api'
import { search } from '../icons'
import Playlist from '../components/Playlist'

const Search = ({ playlists, setPlaylists }) => {
  getUsersPlaylists.then(res => console.log(res))
  console.log(playlists)
  return (
    <>
      <div className='cards'>
        {playlists.map(playlist => <Playlist {...artist} key={playlist.id} />)}
      </div>
    </>
  )
}

Search.propTypes = {
  playlists: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPlaylists: PropTypes.func.isRequired
}

export default Search
