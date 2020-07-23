import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const Hyperlink = ({ href, children }) => (
  href.startsWith('http') ? (
    <a
      href={href}
      rel='noopener noreferrer'
      target='_blank'
    >
      {children}
    </a>
  ) : <Link to={href}>{children}</Link>
)

Hyperlink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.node
}

export default Hyperlink
