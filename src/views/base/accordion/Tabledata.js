import React, { useState, useEffect } from 'react'
// import data from './AllUser5.json'
import pic from './profile_4945750.png'
import Pagenotfound from './Pagenotfound'
import DataTable from './DataTable'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
const userIconUrl = pic

const Tabledata = () => {
  const [data, setUsersLearning] = useState([])
  const [filtered, setFilteredData] = useState(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All Regions')
  const [activeBu, setActiveBu] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Define the options for the dropdown
  const dropdownOptions = ['All Regions', 'GDC', 'Eu East', 'Eu West', 'Ind', 'ANZ', 'NA']
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('client'))
    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())
      .then((jsonData) => {
        setUsersLearning(jsonData.user)
        setFilteredData(jsonData.user)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      })
  }, [])
  useEffect(() => {
    let filteredData = data

    // Filter by BU if activeBu is set
    if (activeBu !== '') {
      filteredData = data.filter((item) =>
        selectedDropdownValue !== 'All Regions'
          ? item.bu !== null && item.bu.includes(activeBu) && item.region === selectedDropdownValue
          : item.bu !== null && item.bu.includes(activeBu),
      )
    } else {
      if (selectedDropdownValue !== 'All Regions') {
        // Only filter by region if it's not "All Regions"
        filteredData = data.filter((item) => item.region === selectedDropdownValue)
      }
    }

    // Filter by email or name if searchTerm is set
    if (searchTerm.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          (item.emailId !== null &&
            item.emailId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.name !== null && item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredData(filteredData)
  }, [searchTerm, selectedDropdownValue, activeBu])

  const buttonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    padding: '5px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
    transition: 'background-color 0.3s',
  }

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '10px',
  }

  const searchContainerStyle = {
    display: 'flex',
    margin: '20px',
  }

  const buttonHoverStyle = {
    backgroundColor: 'green',
  }

  const dropdownStyle = {
    width: '200px', // Set the width of the dropdown
    padding: '10px', // Add padding for spacing
    border: '1px solid #ccc', // Add a border
    borderRadius: '4px', // Add rounded corners
    backgroundColor: 'white', // Set the background color
    fontSize: '14px', // Set the font size
  }

  const toggleBu = (bu) => {
    if (activeBu === bu) {
      // If the clicked button is already active, deactivate it
      let filteredData
      if (selectedDropdownValue !== 'All Regions') {
        filteredData = data.filter((item) => item.region === selectedDropdownValue)
        setFilteredData(filteredData)
      }
      setActiveBu('')
    } else {
      // If the clicked button is not active, activate it
      setActiveBu(bu)
    }
  }

  const userDetailDisplay = (emailId) => {
    console.log(emailId)
    return <DataTable email={emailId} />
  }

  return (
     <>
      {isLoading ? (
        <div className="text-center" style={{ minHeight: '200px' }}>
          <ClipLoader color="#9C27B0" loading={isLoading} size={35} />
        </div>
      ) : (
    <div>
      <div style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
        <div style={containerStyle}>
          <div style={searchContainerStyle}>
            <input
              className="form-control mr-sm-2"
              placeholder="Search by Email or Name"
              aria-label="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
          <div>
            <select
              style={dropdownStyle}
              value={selectedDropdownValue}
              onChange={(e) => setSelectedDropdownValue(e.target.value)}
            >
              {dropdownOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>({filtered.length} Results found)</div>
          <div>
            <button
              style={{
                ...buttonStyle,
                ...(activeBu === 'EDS' ? buttonHoverStyle : {}),
              }}
              onClick={() => toggleBu('EDS')}
            >
              EDS
            </button>
            <button
              style={{
                ...buttonStyle,
                ...(activeBu === 'EBS' ? buttonHoverStyle : {}),
              }}
              onClick={() => toggleBu('EBS')}
            >
              EBS
            </button>
            <button
              style={{
                ...buttonStyle,
                ...(activeBu === 'ES' ? buttonHoverStyle : {}),
              }}
              onClick={() => toggleBu('ES')}
            >
              ES
            </button>
            <button
              style={{
                ...buttonStyle,
                ...(activeBu === 'BSS' ? buttonHoverStyle : {}),
              }}
              onClick={() => toggleBu('BSS')}
            >
              BSS
            </button>
          </div>
        </div>
      </div>
      <div style={{ height: '350px', overflowY: 'auto' }}>
        {filtered.length > 0 ? (
          <table
            className="table table-hover"
            style={{ fontSize: '14px', fontFamily: 'Verdana', fontWeight: 'solid' }}
          >
            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>BU</th>
                <th>Region</th>
                <th>GetInfo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={index} style={{ cursor: 'pointer' }} className="table-row-hover">
                  <td>
                    <img src={userIconUrl} alt="User Icon" width="30" height="30" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.emailId}</td>
                  <td>{item.bu}</td>
                  <td>{item.region}</td>
                  <td>
                    <Link to={`/user_details/${item.emailId}`}>
                      <button className="btn btn-outline-primary">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <Pagenotfound />
        )}
      </div>
    </div>)}
    </>
  )
}
export default Tabledata
