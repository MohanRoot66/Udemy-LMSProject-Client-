import React, { useState, useEffect } from 'react'
import pic from './profile_4945750.png'
import { flushSync } from 'react-dom'
//import Pagenotfound from './Pagenotfound'
import { ClipLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
import data from './Userdata.json'
import Pagenotfound from './Pagenotfound'

const userIconUrl = pic

function BandData() {
  const [data, setUsersLearning] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [filtered, setFilteredData] = useState(data)

  const [searchTerm, setSearchTerm] = useState('')

  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All Regions')

  const [activeBu, setActiveBu] = useState('')
  const [bandWiseDropDown, setbandWiseDropDown] = useState('All Bands')
  const [bandWiseData, setBandWiseData] = useState([])
  const [banddata, setBandData] = useState([])

  useEffect(() => {
  // Make an API request to fetch the JSON data

    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())
      .then((jsonData) => {
        // Filter the user data based on licenceType not equal to 'No licence' and not null
        const filteredUserData = jsonData.user.filter(
          (user) => user.licenceType !== 'No licence' && user.licenceType !== null,
        )
        setUsersLearning(jsonData.user)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    const bandwisedata = [
      ...new Set(
        data.map((item) => {
          if (item.band !== null && item.band !== undefined) {
            return item.band.replace(/\s/g, '')
          }
          return 'No band'
        }),
      ),
    ].filter((item) => item !== undefined)
    console.log(bandwisedata)

    bandwisedata.sort((a, b) => {
      // Compare based on length
      if (a.length !== b.length) {
        return a.length - b.length
      }

      // If lengths are the same, compare based on starting alphabet
      return a.localeCompare(b)
    })
    const uniquebandwisedata = ['All Bands', ...bandwisedata]

    setBandData(uniquebandwisedata)
    console.log('******', banddata)
    setBandWiseData(uniquebandwisedata)
    console.log(bandWiseData)
  }, [data])

  // Define the options for the dropdown

  const dropdownOptions = ['All Regions', 'GDC', 'Eu East', 'Eu West', 'Ind', 'ANZ', 'NA']

  useEffect(() => {
    // alert('Useeffect------------------------------------2')
    let filteredData = data

    if (activeBu === '') {
      if (selectedDropdownValue === 'All Regions' && bandWiseDropDown !== 'All Bands') {
        filteredData = data.filter((item) => {
          return (
            (bandWiseDropDown === 'No band' && !item.band) ||
            (item.band && item.band.trim() === bandWiseDropDown)
          )
        })
      } else if (selectedDropdownValue !== 'All Regions' && bandWiseDropDown !== 'All Bands') {
        filteredData = data.filter(
          (item) =>
            ((bandWiseDropDown === 'No band' && !item.band) ||
              (item.band && item.band.trim() === bandWiseDropDown)) &&
            item.region === selectedDropdownValue,
        )
      } else if (selectedDropdownValue !== 'All Regions' && bandWiseDropDown === 'All Bands') {
        filteredData = data.filter((item) => item.region === selectedDropdownValue)
      }
    } else {
      if (selectedDropdownValue === 'All Regions' && bandWiseDropDown !== 'All Bands') {
        filteredData = data.filter(
          (item) =>
            ((bandWiseDropDown === 'No band' && !item.band) ||
              (item.band && item.band.trim() === bandWiseDropDown)) &&
            item.bu === activeBu,
        )
      } else if (selectedDropdownValue !== 'All Regions' && bandWiseDropDown !== 'All Bands') {
        filteredData = data.filter(
          (item) =>
            ((bandWiseDropDown === 'No band' && !item.band) ||
              (item.band && item.band.trim() === bandWiseDropDown)) &&
            item.region === selectedDropdownValue &&
            item.bu === activeBu,
        )
      } else if (selectedDropdownValue !== 'All Regions' && bandWiseDropDown === 'All Bands') {
        filteredData = data.filter(
          (item) => item.region === selectedDropdownValue && item.bu === activeBu,
        )
      } else if (selectedDropdownValue === 'All Regions' && bandWiseDropDown === 'All Bands') {
        filteredData = data.filter((item) => item.bu === activeBu)
      }
    }

    //   Filter by email or name if searchTerm is set

    if (searchTerm.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          (item.emailId !== null &&
            item.emailId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.name !== null && item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredData(filteredData)
  }, [searchTerm, selectedDropdownValue, activeBu, data, bandWiseDropDown])

  useEffect(() => {
    if (selectedDropdownValue === 'All Regions') {
      setBandWiseData(banddata)
      localStorage.setItem('bands', banddata)
    } else if (selectedDropdownValue !== 'All Regions') {
      const bandwisedata = [
        ...new Set(
          data.map((item) => {
            if (
              item.band !== null &&
              item.band !== undefined &&
              item.region === selectedDropdownValue
            ) {
              return item.band.replace(/\s/g, '')
            }
            return 'No band'
          }),
        ),
      ].filter((item) => item !== undefined)
      console.log(bandwisedata)

      bandwisedata.sort((a, b) => {
        // Compare based on length
        if (a.length !== b.length) {
          return a.length - b.length
        }
        // If lengths are the same, compare based on starting alphabet
        return a.localeCompare(b)
      })
      const uniquebandwisedata = ['All Bands', ...bandwisedata]
      setBandWiseData(uniquebandwisedata)
    }
  }, [selectedDropdownValue])

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
    width: '180px', // Set the width of the dropdown
    padding: '7px', // Add padding for spacing
    border: '1px solid #ccc', // Add a border
    borderRadius: '4px', // Add rounded corners
    backgroundColor: 'white', // Set the background color
    fontSize: '13px', // Set the font size
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

  const filteredCount = filtered.length
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
                {/* <span> ({filteredCount} results found)</span> */}
              </div>

              <div>
                <select
                  style={dropdownStyle}
                  value={bandWiseDropDown}
                  onChange={(e) => setbandWiseDropDown(e.target.value)}
                >
                  {(bandWiseData.length === 0 && selectedDropdownValue === 'All Regions'
                    ? banddata
                    : bandWiseData
                  ).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

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
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                // padding: '10px',
                fontWeight: 'bold',
                fontSize: '1.2em',
              }}
            >{`${filtered.length} results found`}</div>
          </div>
          {filtered.length > 0 ? (
            <div style={{ height: '340px', overflowY: 'auto' }}>
              <table className="table table-hover">
                <thead
                  style={{ position: 'sticky', top: 0, backgroundColor: 'white', fontSize: '14px' }}
                >
                  <tr>
                    <th></th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>BU</th>

                    <th>Region</th>

                    <th>Band</th>

                    <th>Get Info</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img src={userIconUrl} alt="User Icon" width="30" height="30" />
                      </td>

                      <td>{item.name}</td>

                      <td>{item.emailId}</td>

                      <td>{item.bu}</td>

                      <td>{item.region}</td>

                      <td>{item.band}</td>
                      <td>
                        <Link to={`/user_details/${item.emailId}`}>
                          <button className="btn btn-outline-primary">View</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Pagenotfound />
          )}
        </div>
      )}
    </>
  )
}

export default BandData
