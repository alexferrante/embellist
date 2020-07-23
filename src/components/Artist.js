import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import { star } from '../icons'

const Artist = ({ id, image, name, followers, stars }) => (
  <Card
    imgSrc={image}
    href={`/artists/${id}`}
    title={name}
    subtitle={`${followers} followers`}
    footer={
      <div className='stars'>
        {Array.from(Array(stars), (_, index) => (
          <img key={index} className='star' src={star} alt='Star' />
        ))}
      </div>
    }
  />
)

Artist.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  followers: PropTypes.string.isRequired,
  stars: PropTypes.number.isRequired
}

export default Artist
