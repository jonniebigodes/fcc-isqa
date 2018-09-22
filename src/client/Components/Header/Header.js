import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => (
  <div
    style={{
      background: 'rgb(7, 141, 7)'
    }}>
    <div style={{margin: '0 auto', maxWidth: 960, padding: '1.15rem 0.875rem'}}>
      <h1 style={{margin: 0}}>
        <Link to="/" style={{textDecoration: 'none', color: 'white'}}>
          Super Duper ISQA Projects
        </Link>
      </h1>
    </div>
  </div>
)
export default Header
