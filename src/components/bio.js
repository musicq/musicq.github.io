/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import {graphql, useStaticQuery} from 'gatsby'
import Image from 'gatsby-image'
import {rhythm} from '../utils/typography'

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: {regex: "/avatar.jpg/"}) {
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
      site {
        siteMetadata {
          author
          description
          social {
            twitter
          }
        }
      }
    }
  `)

  const {author, social} = data.site.siteMetadata

  return (
    <div
      style={{
        display: `flex`,
        marginBottom: rhythm(2.5),
        alignItems: 'center',
      }}
    >
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        alt={author}
        style={{
          marginRight: rhythm(1 / 2),
          marginBottom: 0,
          minWidth: 50,
          borderRadius: `100%`,
        }}
        imgStyle={{
          borderRadius: `50%`,
        }}
      />
      <div>
        I am&nbsp;
        <a
          href={`https://twitter.com/${social.twitter}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {author}
        </a>
        .
      </div>
    </div>
  )
}

export default Bio
