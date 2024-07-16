import React, { useState, useEffect } from 'react'

import pic from './profile_4945750.png'

import { flushSync } from 'react-dom'

import Pagenotfound from './Pagenotfound'
import { ClipLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
// import users from './Userdata.json'
const userIconUrl = pic

const Tabledata = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setUsersLearning] = useState([])
  const [filtered, setFilteredData] = useState(data)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All Regions')
  const [learningSelectedDropdownValue, setLearningSelectedDropdownValue] = useState('All')
  const [activeBu, setActiveBu] = useState('')
  const [users, setUsers] = useState([])

  useEffect(() => {
    // Make an API request to fetch the JSON data

    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())

      .then((jsonData) => {
        setUsers(jsonData.user)

        setIsLoading(false)
      })

      .catch((error) => {
        console.error('Error fetching data:', error)

        setIsLoading(false)
      })
  }, [])

  console.log(users.length)

  useEffect(() => {
    const currentDate = new Date()

    const currentDateYear = currentDate.getFullYear()

    console.log(currentDateYear)

    const userLearning = []

    console.log(currentDate)

    console.log('__________________' + users.length)

    users.map((emp) => {
      if (emp.licenseType !== 'No license' && emp.licenseType !== null) {
        let hours = 0

        emp.paths &&
          emp.paths.map((path) => {
            if (path.isAssigned !== false && path.assignedOn !== null) {
              const pathAssignedDate = new Date(path.assignedOn)

              const pathAssignedYear = pathAssignedDate.getFullYear()

              path.courses &&
                path.courses.map((course) => {
                  console.log(course.enrolledOn + ' course enrolled date')

                  console.log(course.enrolledOn !== null, 'in courses loop')

                  if (course.enrolledOn && course.completionRatio === 100) {
                    const courseEnrolledDate = new Date(course.enrolledOn)

                    const courseEnrolledYear = courseEnrolledDate.getFullYear()

                    if (courseEnrolledYear === currentDateYear) {
                      hours += course.courseDuration
                    } else if (
                      courseEnrolledYear <= pathAssignedYear &&
                      pathAssignedYear === currentDateYear
                    ) {
                      hours += course.courseDuration
                    }
                  }
                })
            }
          })

        let learningHours = hours / 60

        console.log(hours)

        userLearning.push({
          name: emp.name,

          emailId: emp.emailId,

          learning_hours: learningHours.toFixed(2),

          region: emp.region,

          bu: emp.bu,
        })
      }
    })

    setUsersLearning(userLearning)
    //setIsLoading(false)
  }, [users])
  const dropdownOptions = ['All Regions', 'GDC', 'Eu East', 'Eu West', 'Ind', 'ANZ', 'NA']
  const learningDropDown = ['All', '< 40 hours', '> 40 hours', ' = 40 hours']
  useEffect(() => {
    setIsLoading(false)

    let filteredData = data

    if (activeBu === '') {
      if (
        selectedDropdownValue === 'All Regions' &&
        learningSelectedDropdownValue === '< 40 hours'
      ) {
        filteredData = data.filter((item) => item.learning_hours < 40.0)
      } else if (
        selectedDropdownValue === 'All Regions' &&
        learningSelectedDropdownValue === '> 40 hours'
      ) {
        filteredData = data.filter((item) => item.learning_hours > 40.0)
      } else if (
        selectedDropdownValue === 'All Regions' &&
        learningSelectedDropdownValue === ' = 40 hours'
      ) {
        filteredData = data.filter((item) => item.learning_hours === 40.0)
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === '< 40 hours'
      ) {
        filteredData = data.filter(
          (item) => item.learning_hours < 40.0 && item.region === selectedDropdownValue,
        )
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === '> 40 hours'
      ) {
        filteredData = data.filter(
          (item) => item.learning_hours > 40.0 && item.region === selectedDropdownValue,
        )
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === ' = 40 hours'
      ) {
        filteredData = data.filter(
          (item) => item.learning_hours === 40.0 && item.region === selectedDropdownValue,
        )
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === 'All'
      ) {
        filteredData = data.filter((item) => item.region === selectedDropdownValue)
      }
    } else {
      if (selectedDropdownValue === 'All Regions' && learningSelectedDropdownValue === 'All') {
        filteredData = data.filter((item) => item.bu === activeBu)
      } else if (
        selectedDropdownValue === 'All Regions' &&
        learningSelectedDropdownValue === '< 40 hours'
      ) {
        filteredData = data.filter((item) => item.bu === activeBu && item.learning_hours < 40.0)
      } else if (
        selectedDropdownValue === 'All Regions' &&
        learningSelectedDropdownValue === '> 40 hours'
      ) {
        filteredData = data.filter((item) => item.bu === activeBu && item.learning_hours > 40.0)
      } else if (
        selectedDropdownValue === 'All Regions' &&
        learningSelectedDropdownValue === ' = 40 hours'
      ) {
        filteredData = data.filter((item) => item.bu === activeBu && item.learning_hours === 40.0)
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === '< 40 hours'
      ) {
        filteredData = data.filter(
          (item) =>
            item.bu === activeBu &&
            item.learning_hours < 40.0 &&
            item.region === selectedDropdownValue,
        )
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === '> 40 hours'
      ) {
        filteredData = data.filter(
          (item) =>
            item.bu === activeBu &&
            item.learning_hours > 40.0 &&
            item.region === selectedDropdownValue,
        )
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === ' = 40 hours'
      ) {
        filteredData = data.filter(
          (item) =>
            item.bu === activeBu &&
            item.learning_hours === 40.0 &&
            item.region === selectedDropdownValue,
        )
      } else if (
        selectedDropdownValue !== 'All Regions' &&
        learningSelectedDropdownValue === 'All'
      ) {
        filteredData = data.filter(
          (item) => item.bu === activeBu && item.region === selectedDropdownValue,
        )
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

    flushSync(() => {
      setFilteredData(filteredData)
    })
  }, [searchTerm, selectedDropdownValue, activeBu, data, learningSelectedDropdownValue])

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
                  value={learningSelectedDropdownValue}
                  onChange={(e) => setLearningSelectedDropdownValue(e.target.value)}
                >
                  {learningDropDown.map((option) => (
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

          {
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

                  // padding: '0px',

                  fontWeight: 'bold',

                  fontSize: '1.2em',
                }}
              >{`${filtered.length} results found`}</div>
            </div>
          }

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

                    <th>Learning Hours</th>

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

                      <td>{item.learning_hours}</td>

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

export default Tabledata
