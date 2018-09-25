import React from 'react'
import '../../Assets/css/app.css'

const Footer = () => (
  <footer className="footerstyle">
    <div className="footerText">
      Made by{' '}
      <a
        href="https://www.freecodecamp.com/jonniebigodes"
        target="_noopener"
        rel="nofollow"
        style={{color: 'white'}}>
        Jonniebigodes
      </a>
    </div>
    <div className="footerText">
      Github repository:{' '}
      <a
        href="https://github.com/jonniebigodes/fcc-isqa"
        target="_noopener"
        rel="nofollow"
        style={{color: 'white'}}>
        Information Security and Quality Assurance Projects
      </a>
    </div>
  </footer>
)
export default Footer
