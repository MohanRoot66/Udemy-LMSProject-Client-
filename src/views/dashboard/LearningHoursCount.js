import React, { useEffect, useState } from 'react'
import 'chart.js/auto' // Import Chart.js using 'auto' mode
import { CChart } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import data from './AllUser5.json'

function LearningHoursCount() {
  //const [data, setUsers] = useState([])
  const [months, setMonths] = useState(new Map())

  // useEffect(() => {
  //   fetch('http://localhost:5010/getDataWithNoExcel')
  //     .then((response) => response.json())
  //     .then((jsonData) => {
  //       // Filter the user data based on licenceType not equal to 'No licence' and not null
  //       const filteredUserData = jsonData.user.filter(
  //         (user) => user.licenceType !== 'No licence' && user.licenceType !== null,
  //       )
  //       setUsers(filteredUserData)
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error)
  //     })
  // }, [])
  useEffect(() => {
    const currentDate = new Date()
    const currentDateYear = currentDate.getFullYear()
    const learning = new Map()
    learning.set('January', 0)
    learning.set('February', 0)
    learning.set('March', 0)
    learning.set('April', 0)
    learning.set('May', 0)
    learning.set('June', 0)
    learning.set('July', 0)
    learning.set('August', 0)
    learning.set('September', 0)
    learning.set('October', 0)
    learning.set('November', 0)
    learning.set('December', 0)
    const mails = []

    data &&
      data.map((emp) => {
        console.log(data.length + '------------------------------')
        let flag = true
        let hours = 0
        let learningHours = emp.hoursToComplete
        //console.log(learningHours)
        emp.paths &&
          emp.paths.map((path) => {
            //console.log('in paths...')
            if (path.isAssigned && path.assignedOn !== null) {
              const pathAssignedDate = new Date(path.assignedOn)
              const pathAssignedYear = pathAssignedDate.getFullYear()
              path.courses &&
                path.courses.map((course) => {
                  console.log(
                    course.enrolledOn !== null &&
                      course.completionRatio === 100 &&
                      flag &&
                      learningHours > 0,
                  )

                  if (
                    course.enrolledOn !== null &&
                    course.completionRatio === 100 &&
                    flag &&
                    learningHours > 0
                  ) {
                    const courseEnrolledDate = new Date(course.enrolledOn)
                    const courseEnrolledYear = courseEnrolledDate.getFullYear()
                    const date = new Date(course.course_last_accessed_date) // Parse the date string
                    const options = { month: 'long' }
                    const monthName = date.toLocaleString('en-US', options)

                    if (courseEnrolledYear === currentDateYear) {
                      hours = hours + course.courseDuration
                      // hours = hours / 60
                    } else if (
                      courseEnrolledYear <= pathAssignedYear &&
                      pathAssignedYear === currentDateYear
                    ) {
                      hours = hours + course.courseDuration
                      //hours = hours / 60
                    }
                    console.log(hours, learningHours * 60, 'hours')

                    if (hours >= learningHours * 60) {
                      console.log(monthName)
                      learning.set(monthName, learning.get(monthName) + 1)
                      console.log(learning, 'leraning')
                      //console.log(learning.get(monthName), '____')
                      flag = false
                      mails.push(emp.emailId + hours + ' ' + learningHours)
                    }
                  }
                })
            }
          })
      })
    setMonths(learning)
    console.log(learning)
  }, [data])

  return (
    <div style={{ backgroundColor: '#f8f8ff', height: '20%' }}>
      <CChart
        width={10}
        height={3}
        type="bar"
        data={{
          labels: Array.from(months.keys()), // Extracting keys from the map
          datasets: [
            {
              label: 'Users Count',
              backgroundColor: '#3C4B64',
              data: Array.from(months.values()), // Extracting values from the map
              barThickness: 50, // Adjust the bar thickness here
            },
          ],
        }}
        labels="months"
        options={{
          plugins: {
            legend: {
              labels: {
                color: 'blue',
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: 'transparent',
              },
              ticks: {
                color: '#4169e1',
              },
            },
            y: {
              grid: {
                color: 'transparent',
              },
              ticks: {
                color: 'blue',
              },
            },
          },
        }}
      />
    </div>
  )
}
export default LearningHoursCount
