import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

function Widgets() {
  const [selectedFile, setSelectedFile] = useState(null)
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setFile(file)
  }
  const [file, setFile] = useState(null)
  const handleFileUpload = async () => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:5002/upload', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        // setOutputData(data)
        console.log('File uploaded successfully')
      } else {
        console.error('File upload failed')
      }
    } catch (error) {
      console.error('Error uploading file', error)
    }
  }

  // const handleFileUpload = () => {
  //   if (selectedFile) {
  //     console.log('Uploading file:', selectedFile.name)
  //     // You can perform further actions here, like sending the file to a server
  //   } else {
  //     alert('Please select a file before uploading.')
  //   }
  // }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    setSelectedFile(file)
  }

  const preventDefault = (event) => {
    event.preventDefault()
  }

  const centeredStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
  }

  const outerBoxStyle = {
    border: '1px solid rgba(0, 0, 0, 0.2)',
    padding: '60px',
    margin: '50px',
    borderRadius: '10px',
    textAlign: 'center',
  }

  const innerBoxStyle = {
    padding: '80px', // Increase padding to make the inner box larger
    borderRadius: '10px',
    transition: 'background 0.3s',
    background: 'lightblue',
  }

  const uploadIconStyle = {
    fontSize: '48px', // Adjust the icon size as needed
  }

  return (
    <div style={centeredStyle}>
      <div style={outerBoxStyle} onDrop={handleDrop} onDragOver={preventDefault}>
        <div style={innerBoxStyle}>
          <input
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="fileInput"
          />
          <label htmlFor="fileInput">
            <FontAwesomeIcon icon={faUpload} style={uploadIconStyle} />
            <br />
            <strong>Drag & Drop or Click to Upload</strong>
          </label>
          <br />
          <button className="btn btn-outline-primary" onClick={handleFileUpload}>
            Upload
          </button>
          {selectedFile && <p>Selected File: {selectedFile.name}</p>}
        </div>
      </div>
    </div>
  )
}

export default Widgets
