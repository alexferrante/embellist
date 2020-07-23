import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import Hyperlink from './Hyperlink'

const Playlist = ({ name, id, description, image, tracks, url }) => (
  <Card
    imgSrc={image}
    href={url}
    title={name}
    subtitle={description}
    footer={
      <>
        <div className='meta'>
          <p>{tracks} track{totalTracks === 1 ? '' : 's'}</p>
        </div>
        <Hyperlink href={url}>
          <div className='preview'>
            Preview on Spotify
          </div>
        </Hyperlink>
      </>
    }
  />
)

Playlist.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  tracks: PropTypes.arrayOf(PropTypes.string).isRequired,
  spotifyURI: PropTypes.string.isRequired
}

export default Playlist