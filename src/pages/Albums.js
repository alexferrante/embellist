import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { fetchArtist, fetchAlbums } from '../api'
import { Album } from '../components'

const Albums = ({ artists, setArtists }) => {
  const { artistId } = useParams()

  const artist = artists.find(({ id }) => id === artistId)

  useEffect(() => {
    if (!artist) {
      // Only happens after a page refresh, i.e. when artists is an empty []
      fetchArtist(artistId).then(
        missingArtist => setArtists([...artists, missingArtist])
      )
    }

    if (artist && !artist.albums) {
      // Save albums in case they revisit this artist page later
      fetchAlbums(artistId).then(
        albums => setArtists(artists.map(
          someArtist => someArtist.id === artistId ? { ...someArtist, albums } : someArtist
        ))
      )
    }
  }, [artist])

  return !!artist && (
    <>
      <div className='hero'>
        <h2>{artist.name}</h2>
        <h3>Albums</h3>
      </div>
      {artist.albums && (
        <div className='cards'>
          {artist.albums.map(album => (
            <Album {...album} key={album.id} />
          ))}
        </div>
      )}
    </>
  )
}

Albums.propTypes = {
  artists: PropTypes.arrayOf(PropTypes.object).isRequired,
  setArtists: PropTypes.func.isRequired
}

export default Albums
