import React, { useState, useEffect } from 'react'
import pic from './profile_4945750.png'
import { flushSync } from 'react-dom'
//import Pagenotfound from './Pagenotfound'
import { ClipLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
// import data from './AllUser5.json'
import Pagenotfound from './Pagenotfound'
const userIconUrl = pic

function LicenseType() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setUsersLearning] = useState([])
  const [filtered, setFilteredData] = useState(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All Regions')
  const [activeBu, setActiveBu] = useState('')
  const [licenseDropDown, setLicenseDropDown] = useState('All License Types')

  useEffect(() => {
    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())
      .then((jsonData) => {
        setUsersLearning(jsonData.user)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      })
  }, [])

  const dropdownOptions = ['All Regions', 'GDC', 'Eu East', 'Eu West', 'Ind', 'ANZ', 'NA']
  const licenseDropDownOptions = [
    'All License Types',
    'Enterprise',
    'Enterprise, Pro',
    'No License',
  ]
  console.log(data.length + '------------------------------')
  useEffect(() => {
    let filteredData = data

    if (activeBu === '') {
      if (selectedDropdownValue === 'All Regions' && licenseDropDown !== 'All License Types') {
        filteredData = data.filter((item) => {
          return (
            (licenseDropDown === 'No License' && !item.licenseType) ||
            (item.licenseType &&
              (item.licenseType.trim() === licenseDropDown ||
                item.licenseType.trim() === 'Deactivated'))
          )
        })
      } else if (selectedDropdownValue !== 'All Regions' && licenseDropDown !== 'All License Types') {
        filteredData = data.filter(
          (item) =>
            ((licenseDropDown === 'No License' && !item.licenseType) ||
              (item.licenseType &&
                (item.licenseType.trim() === licenseDropDown ||
                  item.licenseType.trim() === 'Deactivated'))) &&
            item.region === selectedDropdownValue,
        )
      } else if (selectedDropdownValue !== 'All Regions' && licenseDropDown === 'All License Types') {
        filteredData = data.filter((item) => item.region === selectedDropdownValue)
      } else if (selectedDropdownValue === 'All Regions' && licenseDropDown === 'All License Types') {
        filteredData = data.filter((item) => (activeBu != '' ? item.bu === activeBu : item))
      }
    } else {
      if (selectedDropdownValue === 'All Regions' && licenseDropDown !== 'All License Types') {
        filteredData = data.filter(
          (item) =>
            ((licenseDropDown === 'No License' && !item.licenseType) ||
              (item.licenseType &&
                (item.licenseType.trim() === licenseDropDown ||
                  item.licenseType.trim() === 'Deactivated'))) &&
            item.bu === activeBu,
        )
      } else if (selectedDropdownValue !== 'All Regions' && licenseDropDown !== 'All License Types') {
        filteredData = data.filter(
          (item) =>
            ((licenseDropDown === 'No License' && !item.licenseType) ||
              (item.licenseType &&
                (item.licenseType.trim() === licenseDropDown ||
                  item.licenseType.trim() === 'Deactivated'))) &&
            item.region === selectedDropdownValue &&
            item.bu === activeBu,
        )
      } else if (selectedDropdownValue !== 'All Regions' && licenseDropDown === 'All License Types') {
        filteredData = data.filter(
          (item) => item.region === selectedDropdownValue && item.bu === activeBu,
        )
      } else if (selectedDropdownValue === 'All Regions' && licenseDropDown === 'All License Types') {
        console.log('---------------------------------------------------------')
        filteredData = data.filter((item) => (activeBu != '' ? item.bu === activeBu : item))
      }
    }

    if (searchTerm.length > 0) {
      filteredData = filteredData.filter(
        (item) =>
          (item.emailId !== null &&
            item.emailId.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.name !== null && item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredData(filteredData)
  }, [searchTerm, selectedDropdownValue, activeBu, data, licenseDropDown])

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
    width: '180px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    fontSize: '16px',
  }

  const toggleBu = (bu) => {
    if (activeBu === bu) {
      let filteredData

      if (selectedDropdownValue !== 'All Regions') {
        filteredData = data.filter((item) => item.region === selectedDropdownValue)
        setFilteredData(filteredData)
      }

      setActiveBu('')
    } else {
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
              </div>
              <div>
                <select
                  style={dropdownStyle}
                  value={licenseDropDown}
                  onChange={(e) => setLicenseDropDown(e.target.value)}
                >
                  {licenseDropDownOptions.map((option) => (
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
                fontWeight: 'bold',
                fontSize: '1.2em',
              }}
            >
              {`${filtered.length} results found`}
            </div>
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
                    <th>License Type</th>
                    <th>Get Info</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <img src={userIconUrl} alt="User Icon" width="30" height="30" />
                      </td>
                      <td>
                        <div
                          style={{
                            padding: '4px',
                            display: 'inline-block',
                          }}
                        >
                          {item.name}
                        </div>

                        <p
                          style={{
                            padding: item.licenseType === 'Deactivated' ? '3px' : '0px',
                            fontSize: '10px',
                            backgroundColor: 'grey',
                            display: 'inline-block',
                            color: 'white',
                          }}
                        >
                          {item.licenseType === 'Deactivated' ? 'Deactivated' : null}
                        </p>
                      </td>
                      <td>{item.emailId}</td>
                      <td>{item.bu}</td>
                      <td>{item.region}</td>
                      <td>{item.band}</td>
                      <td>
                        {item.licenseType === 'Deactivated' ? 'No license' : item.licenseType}
                      </td>
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

export default LicenseType
