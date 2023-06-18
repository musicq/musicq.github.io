import {Link} from 'gatsby'
import React from 'react'

import {rhythm, scale} from '../utils/typography'

const Layout = ({location, title, children}) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <h3
        style={{
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            textDecoration: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h3>
    )
  }
  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: rhythm(28),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <header>{header}</header>
      <main>{children}</main>
      <footer style={{marginTop: rhythm(3)}}>
        <a
          href="https://github.com/musicq"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
        &nbsp;•&nbsp;
        <a
          href="https://twitter.com/klsg92"
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </footer>
    </div>
  )
}

export default Layout
