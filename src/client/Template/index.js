import React from 'react'
import Header from '../Components/Header/Header'
import Footer from '../Components/Footer/Footer'



const Template = props => {
  const {children} = props //eslint-disable-line
  return (
    <div>
      <Header />
      <main
        style={{
          margin: '0 auto',
          width: 900,
          maxWidth: 960,
          padding: '0px 1.0875rem 1.45rem',
          paddingTop: 0
        }}>
        
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Template
