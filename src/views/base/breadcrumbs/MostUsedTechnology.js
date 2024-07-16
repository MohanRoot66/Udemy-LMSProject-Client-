import { useEffect, useState } from 'react'
import React from 'react'
import { CChartPie } from '@coreui/react-chartjs'
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
// import data from './AllUser5.json'

function MostUsedTechnology() {
  const [data, setData] = useState([])
  const [selectedRegion, setSelectedRegion] = useState('All Regions') // Initialize to 'All'

  useEffect(() => {
    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData.user)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])
  const users = data.user || []

  const [gdcEmployees, setGdc] = useState([])
  const [gdcEmployeesSize, setgdcSize] = useState()
  const [gdcCourses, setGdcCourses] = useState([])
  const [mostUsedGdcCourse, setMostUsedGdcCourse] = useState([])
  const [region_name, setRegionName] = useState(selectedRegion) // Initialize to 'All'
  const [mostConsumedCourse, SetMostConsumedCourse] = useState([])

  useEffect(() => {
    if (region_name === 'All Regions') {
      // Handle loading data for "All"
      setGdc(data)
    } else {
      // Handle loading data for other regions
      const gdcEmployees = data.filter((emp) => emp.region === region_name)
      setGdc(gdcEmployees)
      setgdcSize(gdcEmployees.length)
    }
  }, [region_name, data])

  useEffect(() => {
    const ccc = []
    const courses = []
    const currentDate = new Date() // Get the current date

    // Calculate the date of 12 months ago from the current date
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 12)
    gdcEmployees.forEach((emp) => {
      emp.paths &&
        emp.paths.forEach((path) => {
          path.courses &&
            path.courses.forEach((course) => {
              const enrollmentDate = new Date(course.enrolledOn)
              if (enrollmentDate >= twelveMonthsAgo && enrollmentDate <= currentDate) {
                const existingCourse = courses.find(
                  (item) => item.course_category === course.course_category,
                )
                if (course.course_category !== '') {
                  if (existingCourse) {
                    existingCourse.count += 1
                    existingCourse.course_category_completion_ratio += course.completionRatio
                    existingCourse.course_category_avg_completion_ratio =
                      existingCourse.course_category_completion_ratio / existingCourse.count
                    existingCourse.course_category_consumed_minutes += course.consumedMinutes
                  } else {
                    courses.push({
                      count: 1,
                      course_category: course.course_category,
                      course_category_completion_ratio: course.completionRatio,
                      course_category_avg_completion_ratio: course.completionRatio,
                      course_category_consumed_minutes: course.consumedMinutes,
                    })
                  }
                }
              }
            })
        })
    })
    setGdcCourses(courses)
  }, [gdcEmployees])

  useEffect(() => {
    const gdcSortedData = gdcCourses.sort((a, b) => b.count - a.count)
    const gdcMost = gdcSortedData.slice(0, 5)
    const mostConsumedData = gdcCourses.sort(
      (a, b) => b.course_category_consumed_minutes - a.course_category_consumed_minutes,
    )
    const consumedMost = mostConsumedData.slice(0, 5)
    setMostUsedGdcCourse(gdcMost)
    SetMostConsumedCourse(consumedMost)
  }, [gdcCourses])

  const handleDropdownChange = (value) => {
    console.log('*************' + value)
    setRegionName(value)
  }

  return (
    <div>
      <div
        style={{
          alignContent: 'center',
          marginLeft: '45%',
          marginTop: '3%',
        }}
      >
        <CDropdown dark>
          <CDropdownToggle color="secondary" style={{ textDecorationColor: 'white' }}>
            {selectedRegion || 'All Regions'}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('All Regions')
                setSelectedRegion('All Regions')
              }}
            >
              All Regions
            </CDropdownItem>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('Eu West')
                setSelectedRegion('Eu West')
              }}
            >
              Eu West
            </CDropdownItem>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('ANZ')
                setSelectedRegion('ANZ')
              }}
            >
              ANZ
            </CDropdownItem>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('Eu East')
                setSelectedRegion('Eu East')
              }}
            >
              Eu East
            </CDropdownItem>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('GDC')
                setSelectedRegion('GDC')
              }}
            >
              GDC
            </CDropdownItem>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('Ind')
                setSelectedRegion('Ind')
              }}
            >
              Ind
            </CDropdownItem>
            <CDropdownItem
              onClick={() => {
                handleDropdownChange('NA')
                setSelectedRegion('NA')
              }}
            >
              NA
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
          height: '70vh',
        }}
      >
        <div style={{ flex: 1, marginLeft: '15px' }}>
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '3vh',
              whiteSpace: 'pre-line',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Region Wise Top 5 Most Enrolled Course Categories <br /> (Past 12 Months)
          </p>
          <CChartPie
            data={{
              labels: mostUsedGdcCourse.map((item) => item.course_category),
              datasets: [
                {
                  data: mostUsedGdcCourse.map((item) => item.count),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', 'Blue', 'Green'],
                  hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', 'Blue', 'Green'],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false, // Disable the aspect ratio
              responsive: true, // Allow the chart to be responsive
              plugins: {
                legend: {
                  display: true,
                  position: 'right',
                  labels: {
                    font: {
                      size: 12,
                    },
                    boxWidth: 500,
                    usePointStyle: true,
                  },
                },
              },
            }}
            width={280} // Set the desired width
            height={280}
          />
        </div>

        <div style={{ flex: 1 }}>
          <p
            style={{
              fontWeight: 'bold',
              fontSize: '3vh',
              whiteSpace: 'pre-line',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            Region Wise Top 5 Most Consumed Course Categories <br /> (Past 12 Months)
          </p>
          <CChartPie
            data={{
              labels: mostConsumedCourse.map((item) => item.course_category),
              datasets: [
                {
                  data: mostConsumedCourse.map((item) => item.course_category_consumed_minutes),
                  backgroundColor: ['#006994', '#36A2EB', '#ffae42  ', '#c154c1   ', '#009698 '],
                  hoverBackgroundColor: [
                    '#006994',
                    '#36A2EB',
                    '#ffae42  ',
                    '#c154c1   ',
                    '#009698 ',
                  ],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false, // Disable the aspect ratio
              responsive: true, // Allow the chart to be responsive
              plugins: {
                legend: {
                  display: true,
                  position: 'right',
                  labels: {
                    font: {
                      size: 12,
                    },
                    boxWidth: 500,
                    usePointStyle: true,
                  },
                },
              },
            }}
            width={280} // Set the desired width
            height={280}
          />
        </div>
      </div>
    </div>
  )
}
export default MostUsedTechnology
