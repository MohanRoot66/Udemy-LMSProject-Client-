import React, { useState, useEffect, useRef } from 'react'

import { useParams } from 'react-router-dom'
import pic from './usericon2.png'
import pic1 from './blueCircle.png'
import pic2 from './tickMark.png'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { CChart } from '@coreui/react-chartjs'
// import data1 from './AllUser5.json'
import { ClipLoader } from 'react-spinners'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const DataTable = () => {
  let { emailId } = useParams()
  let enrolledCount = 0
  let completedCourses = 0
  let completed_assigned = 0
  const [data, setUsersLearning] = useState([])
  const [filteredUsers1, setFilteredusers1] = useState([])
  const chartRef = useRef(null)

  //const filteredUsers = data.filter((user) => user.emailId === emailId)
  const [expandedPaths, setExpandedPaths] = useState({})
  const [expandedCourses, setExpandedCourses] = useState({})
  const [isPathsContainerVisible, setPathsContainerVisible] = useState(false)

  const [userLearning, userLearnt] = useState(0)
  const [consumedHours, consumed] = useState(0)
  const [assignedHours, UserAssignedHours] = useState(0)
  const [hoursToComplete, HoursToComplete] = useState(0)
  const [filteredUsers, setFilteredusers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
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
  // useEffect(() => {
  //   const filteredData = data1.filter((user) => user.emailId === emailId)
  //   setUsersLearning(filteredData)
  // }, [])
  useEffect(() => {
    // Check if data and emailId are available
    if (data.length > 0 && emailId) {
      const filteredData = data.filter((user) => user.emailId === emailId)
      setFilteredusers1(filteredData)
    }
  }, [data, emailId])

  useEffect(() => {
    const currentDate = new Date()
    const startDate = new Date(currentDate.getFullYear() -1 , 3 , 1)
    const endDate = new Date(currentDate.getFullYear(), 2, 31)
    if (currentDate.getMonth > 2) {
      startDate = new Date(currentDate.getFullYear(), 3, 1)
      endDate = new Date(currentDate.getFullYear() + 1,2, 30)
    }
    const currentDateYear = currentDate.getFullYear()
    const currentDateMonth = currentDate.getMonth()
    // alert(currentDateMonth)
    let learningHours = 0
    let assignedHours = 0
    let userconsumedhours = 0

    console.log(currentDateYear)

    //console.log(currentDate)

    // console.log('__________________' + users.length)

    filteredUsers1 &&
      filteredUsers1.map((emp) => {
        if ((emp.licenseType !== 'No license' && emp.licenseType !== null) || ( emp.udemyJoinDate != null) ) {
          let hours = 0
          let ahours = 0
          let chours = 0
          emp.paths &&
            emp.paths.map((path) => {
              // if (path.isAssigned !== false && path.assignedOn !== null) {

              const pathAssignedDate = new Date(path.assignedOn)

              const pathAssignedYear = pathAssignedDate.getFullYear()
              const pathAssignedMonth = pathAssignedDate.getMonth()

              path.courses &&
                path.courses.map((course) => {
                  if (path.isAssigned !== false && path.assignedOn !== null) {
                    ahours = ahours + course.courseDuration
                  }

                  if (course.enrolledOn) {
                    const courseEnrolledDate = new Date(course.enrolledOn)
                    const isInRange =
                      courseEnrolledDate >= startDate && courseEnrolledDate <= endDate
                    if (isInRange) {
                      chours += course.consumedMinutes
                    }
                  }

                  if (course.enrolledOn && course.completionRatio === 100) {
                    const courseEnrolledDate = new Date(course.enrolledOn)
                    const courseEnrolledMonth = courseEnrolledDate.getMonth()
                    // alert(courseEnrolledMonth > 3)

                    const courseEnrolledYear = courseEnrolledDate.getFullYear()

                    // hours += course.courseDuration
                    //Jan - 0 ..... Dec - 11
                    const isInRange =
                      courseEnrolledDate >= startDate && courseEnrolledDate <= endDate
                    if (isInRange) {
                      hours += course.courseDuration
                    }

                    // if (
                    //   (pathAssignedYear === currentDateYear && pathAssignedMonth <= 2) ||
                    //   (pathAssignedYear === currentDateYear - 1 && pathAssignedMonth > 2) ||
                    //   (currentDateYear - 1 == 2023 &&
                    //     pathAssignedYear == 2023 &&
                    //     currentDateMonth <= 2)
                    // ) {
                    //   hours += course.courseDuration
                    // }
                    // else if (courseEnrolledYear <= pathAssignedYear) {
                    //   hours += course.courseDuration
                    // }

                    // if (courseEnrolledYear === currentDateYear) {
                    //   hours += course.courseDuration
                    // } else if (
                    //   courseEnrolledYear <= pathAssignedYear &&
                    //   pathAssignedYear === currentDateYear
                    // ) {
                    //   hours += course.courseDuration
                    // }
                  }
                })
              // }
            })

          learningHours = hours / 60
          assignedHours = ahours / 60
          userconsumedhours = chours / 60
          //user(learningHours.toFixed(2))
          // console.log('******************' + learningHours.toFixed(2))
        }
      })
    console.log('||||||||||||||||||||||||||||||' + learningHours)
    userLearnt(learningHours.toFixed(2))
    consumed(userconsumedhours.toFixed(2))
    UserAssignedHours(assignedHours.toFixed(2))
    //setIsLoading(false)
  }, [filteredUsers1])

  // Iterate through the filteredUsers data to count enrolled courses
  filteredUsers.forEach((user) => {
    if (user.paths) {
      user.paths.forEach((path) => {
        if (path.courses) {
          path.courses.forEach((course) => {
            enrolledCount++
          })
        }
      })
    }
  })

  filteredUsers.forEach((user) => {
    if (user.paths) {
      user.paths.forEach((path) => {
        if (path.courses) {
          path.courses.forEach((course) => {
            if (course.completionRatio === 100) {
              completedCourses++
              if (path.isAssigned !== false && path.assignedOn !== null) {
                completed_assigned = completed_assigned + course.courseDuration
              }
            }
          })
        }
      })
      completed_assigned = completed_assigned / 60
      completed_assigned = completed_assigned.toFixed(2)
    }
  })

  const togglePathDetails = (pathTitle) => {
    setExpandedPaths((prevState) => ({
      ...prevState,

      [pathTitle]: !prevState[pathTitle],
    }))
    setPathsContainerVisible(true)
  }

  const toggleCoursesList = (pathTitle, courseTitle) => {
    setExpandedCourses((prevState) => ({
      ...prevState,

      [pathTitle]: {
        ...prevState[pathTitle],

        [courseTitle]: !prevState[pathTitle]?.[courseTitle],
      },
    }))
  }

  useEffect(() => {
    if (filteredUsers1) {
      const users = filteredUsers1.find((user) => user.emailId === emailId)
      console.log(users)

      const filteredUsers = []

      if (users) {
        const users2 = { ...users }
        users2.hoursLearnt = userLearning
        users2.assignedHours = assignedHours
        console.log('++++++++++++++++++++++++', users2.hoursLearnt)

        if (users2.hoursLearnt >= users2.hoursToComplete) {
          users2.LearningHoursCompletionStatus = 'Yes'
        } else {
          users2.LearningHoursCompletionStatus = 'No'
        }

        const index = filteredUsers1.findIndex((user) => user.emailId === emailId)
        filteredUsers[index] = users2

        // Now, setFilteredusers with the updated data
        HoursToComplete(users2.hoursToComplete)
        setFilteredusers(filteredUsers)
      }
    }
  }, [userLearning, emailId, filteredUsers1])

  if (filteredUsers !== null) {
    console.log(filteredUsers.hoursToComplete + '?????????????????????')
    console.log(filteredUsers.assigndHours + '///////////////')
    console.log(filteredUsers.hoursLearnt + '!!!!!!!!!!!!!!')
  }

  const pathTitleStyle = {
    cursor: 'pointer',
    color: 'blue',
  }

  const defaultStyle = {
    backgroundColor: 'white',

    color: 'black', // Text color when not expanded
  }

  const expandedStyle = {
    backgroundColor: '#B6D0E2',
  }

  const progressContainerStyles = {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0de',
    borderRadius: 50,
  }

  const labelStyles = {
    padding: 5,
    color: 'white',
    fontWeight: 'bold',
  }

  return (
    <>
      {isLoading ? (
        <div className="text-center" style={{ minHeight: '200px' }}>
          <ClipLoader color="#9C27B0" loading={isLoading} size={35} />
        </div>
      ) : (
        <div>
          <h2
            style={{
              textAlign: 'left',

              marginLeft: '10vw',
              marginTop: '1vh',
              color: 'purple',
            }}
          >
            User Data
          </h2>

          {filteredUsers.map((user, index) => (
            <div>
              <div key={''} style={{ display: 'flex', width: '100%' }}>
                <div
                  className="tableContainer"
                  style={{
                    flex: 1,
                    marginTop: '2vh',
                    boxShadow: '5px 5px 10px',
                    position: 'absolute',
                    maxHeight: '70vh',
                    maxWidth: '50vw',
                    marginLeft: '1vw',
                    marginRight: '2vw',
                    borderRadius: '20px',
                    maxWidth: '35%',
                    backgroundColor: 'white',
                    height: 'auto',
                    padding: '5px',
                  }}
                >
                  <table style={{ width: '100%' }}>
                    <div key={index} className="tableCellStyle">
                      <tr>
                        <td colSpan="2" style={{ textAlign: 'center' }}>
                          <img src={process.env.PUBLIC_URL + pic} alt="User Icon" height="100px" />
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>Name</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}> :</strong>

                          <strong>{user.name}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>Email Id</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.emailId}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>BU</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.bu}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>Region</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.region}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>Assigned Paths Count</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.assignedPathsCount}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>Band</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.band}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>Doj</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.doj}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td style={{ color: '	#5D3FD3' }}>
                          <strong>License Type</strong>
                        </td>

                        <td>
                          <strong style={{ color: 'blue', marginRight: '1vw' }}>:</strong>

                          <strong>{user.licenseType}</strong>
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            color: '#5D3FD3',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                          }}
                        >
                          <strong
                            onClick={() => setPathsContainerVisible(!isPathsContainerVisible)}
                          >
                            Paths
                          </strong>
                        </td>
                      </tr>
                    </div>
                  </table>
                </div>

                <div
                  className="secondContainer"
                  style={{ flex: 2, marginLeft: '39vw', maxWidth: '37vw', marginTop: '3vh' }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <table
                      style={{
                        maxWidth: '30vw',
                        marginTop: '3vw',
                        marginTop: '0vw',
                        marginLeft: '3vw',
                      }}
                    >
                      <tr>
                        <td>
                          <img src={process.env.PUBLIC_URL + pic1} alt="User Icon" height="20px" />
                          <strong> Total Enrolled Courses: {enrolledCount}</strong>`
                        </td>
                        <td>
                          <img src={process.env.PUBLIC_URL + pic2} alt="User Icon" height="30px" />
                          <strong>Total Completed Courses: {completedCourses}</strong>
                        </td>
                        <td>
                          <img src={process.env.PUBLIC_URL + pic2} alt="User Icon" height="30px" />
                          <strong> Completed Assigned Hours: {completed_assigned}</strong>`
                        </td>
                      </tr>
                    </table>
                  </div>
                  <div
                    className="baraGraphContainer"
                    style={{
                      overflowY: 'auto',
                      boxShadow: '5px 5px 10px',

                      padding: '20px',
                      marginTop: '8vh',
                      backgroundColor: 'white',
                      borderRadius: '20px',
                    }}
                  >
                    <CChart
                      height={100}
                      type="bar"
                      data={{
                        labels: [
                          'Hours To Complete',
                          'Assigned Hours',
                          'User Learning',
                          'Consumed Hours',
                        ], // Extracting keys from the map
                        datasets: [
                          {
                            label: 'User Learning Status',
                            // backgroundColor: ['Green', 'Blue', 'Red'],

                            backgroundColor: (context) => {
                              const values = context.dataset.data
                              return values.map((value) =>
                                value >= hoursToComplete
                                  ? 'rgba(0, 128, 0, 0.5)'
                                  : 'rgba(255, 99, 132, 0.5)',
                              )
                            },
                            data: [hoursToComplete, assignedHours, userLearning, consumedHours], // Extracting values from the map
                            barPercentage: 0.2,
                          },
                        ],
                      }}
                      labels="months"
                      options={{
                        plugins: {
                          legend: {
                            labels: {
                              color: '#556b2f ',
                            },
                          },

                          scales: {
                            x: {
                              grid: {
                                color: 'lightblue',
                              },
                              ticks: {
                                color: 'Black',
                              },
                            },
                            y: {
                              grid: {
                                color: 'lightblue',
                              },
                              ticks: {
                                color: 'Black',
                              },
                            },
                          },
                          barThickness: 20,
                          datalabels: {
                            display: true,
                            color: 'black', // Label color
                            align: 'end', // Position the labels at the end of the bars
                            anchor: 'start',
                            font: {
                              weight: 'bold',
                              size: 10,
                            },
                          },
                        },
                      }}
                      plugins={[ChartDataLabels]}
                    />
                  </div>
                </div>
              </div>
              {isPathsContainerVisible && (
                <div
                  className="pathlistContainer"
                  style={{
                    flex: 2,
                    overflowY: 'auto',
                    boxShadow: '5px 5px 10px',

                    marginBottom: '2vw',
                    padding: '20px',
                    marginTop: '8vh',
                    backgroundColor: 'white',
                    borderRadius: '20px',
                  }}
                >
                  <ul>
                    {user.paths ? (
                      user.paths.map((path, pathTitle) => (
                        <li key={pathTitle}>
                          <div className="accordion" id={`accordion-${pathTitle}`}>
                            <div className="accordion-item">
                              <h2 className="accordion-header" id={`heading-${pathTitle}`}>
                                <span
                                  className="pathcolor"
                                  onClick={() => togglePathDetails(pathTitle)}
                                >
                                  <div
                                    className="accordion-button"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse-${pathTitle}`}
                                    aria-expanded={expandedPaths[pathTitle] ? 'true' : 'false'}
                                    aria-controls={`collapse-${pathTitle}`}
                                    style={expandedPaths[pathTitle] ? expandedStyle : defaultStyle}
                                  >
                                    {path.pathTitle ? path.pathTitle : 'No Path'}
                                    <div
                                      style={{
                                        padding: path.isAssigned ? '4px' : '0px',
                                        fontSize: '10px',
                                        backgroundColor: 'lavender',
                                        display: 'inline-block',
                                        color: 'Indigo',
                                      }}
                                    >
                                      <b>{path.isAssigned ? 'Assigned' : null}</b>
                                    </div>
                                  </div>
                                </span>
                              </h2>

                              <div
                                id={`collapse-${pathTitle}`}
                                className={`accordion-collapse collapse ${
                                  expandedPaths[pathTitle] ? 'show' : ''
                                }`}
                                aria-labelledby={`heading-${pathTitle}`}
                                data-bs-parent={`#accordion-${pathTitle}`}
                              >
                                <div className="accordion-body">
                                  <div className="pathbodyContainer" style={{ display: 'flex' }}>
                                    <div style={{ flex: 1 }}>
                                      <strong>Path Id:</strong> {path.pathId ? path.pathId : 'NA'}
                                      <br />
                                      <strong>Is Assigned:</strong>
                                      {path.isAssigned
                                        ? path.isAssigned.toString()
                                        : 'Not Assigned'}
                                      {console.log('------------------' + path.isAssigned)}
                                      <br />
                                      <strong>Path Assigned By:</strong>
                                      {path.pathAssignedBy ? path.pathAssignedBy : 'NA'}
                                      <br />
                                      <strong>Assigned On:</strong>
                                      {path.assignedOn ? path.assignedOn : ''}
                                      <br />
                                      <strong>Completion Ratio:</strong>
                                      {path.completionRatio ? path.completionRatio : '0'}
                                      <br />
                                    </div>
                                    <div
                                      className="progressBarContainer"
                                      style={{
                                        flex: 2,
                                        maxWidth: '20vw',
                                        maxHeight: '6vw',
                                        marginTop: '0vw',
                                        marginLeft: '15vw',
                                        marginRight: '5vw',

                                        textAlign: 'center',
                                      }}
                                    >
                                      <div
                                        className="progressContainer"
                                        style={progressContainerStyles}
                                      >
                                        <div
                                          style={{
                                            height: '100%',
                                            width: `${path.completionRatio}%`,
                                            backgroundColor: '#7761ce',
                                            borderRadius: 'inherit',
                                            textAlign: 'right',
                                          }}
                                        >
                                          <span
                                            style={labelStyles}
                                          >{`${path.completionRatio}%`}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {path.courses ? (
                                    <div
                                      className="accordion"
                                      id={`accordion-courses-${pathTitle}`}
                                    >
                                      <div className="accordion-item">
                                        <h2
                                          className="accordion-header"
                                          id={`heading-courses-${pathTitle}`}
                                        >
                                          <span
                                            style={pathTitleStyle}
                                            onClick={() => toggleCoursesList(pathTitle, 'courses')}
                                          >
                                            <button
                                              className="accordion-button"
                                              type="button"
                                              data-bs-toggle="collapse"
                                              data-bs-target={`#collapse-courses-${pathTitle}`}
                                              aria-expanded={
                                                expandedCourses[pathTitle]?.courses
                                                  ? 'true'
                                                  : 'false'
                                              }
                                              aria-controls={`collapse-courses-${pathTitle}`}
                                              style={
                                                expandedPaths[pathTitle]
                                                  ? expandedStyle
                                                  : defaultStyle
                                              }
                                            >
                                              Courses
                                            </button>
                                          </span>
                                        </h2>

                                        <div
                                          id={`collapse-courses-${pathTitle}`}
                                          className={`accordion-collapse collapse ${
                                            expandedCourses[pathTitle]?.courses ? 'show' : ''
                                          }`}
                                          aria-labelledby={`heading-courses-${pathTitle}`}
                                          data-bs-parent={`#accordion-courses-${pathTitle}`}
                                        >
                                          <ul>
                                            {path.courses.map((course, courseTitle) => (
                                              <li key={courseTitle}>
                                                <span
                                                  className="coursecolor"
                                                  style={pathTitleStyle}
                                                  onClick={() =>
                                                    toggleCoursesList(pathTitle, courseTitle)
                                                  }
                                                >
                                                  {course.courseTitle}
                                                </span>

                                                {expandedCourses[pathTitle]?.[courseTitle] && (
                                                  <div>
                                                    <div
                                                      key={''}
                                                      style={{ display: 'flex', width: '100%' }}
                                                    >
                                                      <div
                                                        className="accordion-body"
                                                        style={{ flex: 1 }}
                                                      >
                                                        <strong>Course Id: </strong>

                                                        {course.courseId ? course.courseId : 'NA'}

                                                        <br />

                                                        <strong>Completion Ratio: </strong>

                                                        {course.completionRatio
                                                          ? course.completionRatio
                                                          : '0'}

                                                        <br />

                                                        <strong>Consumed Minutes: </strong>

                                                        {course.consumedMinutes
                                                          ? course.consumedMinutes
                                                          : '0'}

                                                        <br />

                                                        <strong>Course Duration: </strong>

                                                        {course.courseDuration}

                                                        <br />

                                                        <strong>Enrolled On: </strong>

                                                        {course.enrolledOn
                                                          ? course.enrolledOn
                                                          : 'null'}

                                                        <br />

                                                        <strong>Course Category: </strong>

                                                        {course.course_category
                                                          ? course.course_category
                                                          : 'null'}

                                                        <br />
                                                      </div>
                                                      <div
                                                        className="progessgraphContainer"
                                                        style={{
                                                          flex: 2,
                                                          maxWidth: '10vw',
                                                          marginTop: '0vw',
                                                          padding: '10px',
                                                          marginRight: '15vw',
                                                        }}
                                                      >
                                                        <CircularProgressbar
                                                          value={course.completionRatio}
                                                          text={`${course.completionRatio}%`}
                                                        />
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <p>No courses available</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p>No paths available</p>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default DataTable
