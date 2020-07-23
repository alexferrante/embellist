import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import Hyperlink from './Hyperlink'

const Album = ({ image, name, artistNames, releaseDate, totalTracks, previewUrl }) => (
  <Card
    imgSrc={image}
    href={previewUrl}
    title={name}
    subtitle={artistNames.join(', ')}
    footer={
      <>
        <div className='meta'>
          <p>{releaseDate}</p>
          <p>{totalTracks} track{totalTracks === 1 ? '' : 's'}</p>
        </div>
        <Hyperlink href={previewUrl}>
          <div className='preview'>
            Preview on Spotify
          </div>
        </Hyperlink>
      </>
    }
  />
)

Album.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  artistNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  releaseDate: PropTypes.string.isRequired,
  totalTracks: PropTypes.number.isRequired,
  previewUrl: PropTypes.string.isRequired
}

export default Album
