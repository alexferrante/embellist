import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { fetchArtist, fetchAlbums } from '../api'
// import { Album } from '../components'
import { Playlist } from '../components'

const Playlists = ({ playlists, setPlaylists }) => {
  const { playlistId } = useParams()

  const playlist = playlists.find(({ id }) => id === playlistId)

  useEffect(() => {
    if (!playlist) {
      // Only happens after a page refresh, i.e. when artists is an empty []
      fetchArtist(artistId).then(
        missingPlaylist => setPlaylists([...playlists, missingPlaylist])
      )
    }

    // if (playlist && !artist.albums) {
    //   // Save albums in case they revisit this artist page later
    //   fetchAlbums(artistId).then(
    //     albums => setArtists(artists.map(
    //       someArtist => someArtist.id === artistId ? { ...someArtist, albums } : someArtist
    //     ))
    //   )
    // }
  }, [playlist])

  return !!playlist && (
    <>
      <div className='hero'>
        <h2>{playlist.name}</h2>
        <h3>Playlists</h3>
      </div>
      {/* {artist.albums && (
        <div className='cards'>
          {artist.albums.map(album => (
            <Album {...album} key={album.id} />
          ))}
        </div>
      )} */}
    </>
  )
}

Playlists.propTypes = {
  playlists: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPlaylists: PropTypes.func.isRequired
}

export default Playlists
