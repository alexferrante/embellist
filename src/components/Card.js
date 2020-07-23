import React from 'react'
import PropTypes from 'prop-types'
import { Hyperlink } from '../components'

const Card = ({ imgSrc, href = '#', title, subtitle, footer }) => (
  <div className='card'>
    <Hyperlink href={href}>
      <figure>
        <img src={imgSrc} alt={title} draggable={false} />
      </figure>
    </Hyperlink>
    <div className='card-header'>
      <h2>{title}</h2>

      <h3>{subtitle}</h3>
    </div>
    {footer && <div className='card-footer'>
      {footer}
    </div>}
  </div>
)

Card.propTypes = {
  imgSrc: PropTypes.string,
  href: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  footer: PropTypes.node
}

export default Card
