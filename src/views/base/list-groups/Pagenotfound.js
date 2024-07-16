import React from 'react'
const Pagenotfound = () => {
  const centeredDivStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  }

  const largeText = {
    fontSize: '2rem',
    fontWeight: 'bold',
  }

  return (
    <div style={centeredDivStyle}>
      <div style={largeText}>No users are there in the filter</div>
    </div>
  )
}

export default Pagenotfound
