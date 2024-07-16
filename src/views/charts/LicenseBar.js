import React, { useEffect, useState } from 'react'
import { CChart } from '@coreui/react-chartjs'

function LicenseBar() {
  const [data1, setUsersLearning1] = useState([])
  const [allLicenseCount, setAllLicenseCount] = useState(new Map())
  const [licenseCount, setLicenseCount] = useState(new Map())
  const [selectedDropdownValue1, setSelectedDropdownValue1] = useState('All Regions')

  useEffect(() => {
    // Make an API request to fetch the JSON data
    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())
      .then((jsonData) => {
        console.log('before users')
        setUsersLearning1(jsonData.user)
        console.log(jsonData.length)
        console.log('after users')
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  useEffect(() => {
    const licenseCount = new Map()
    if (Array.isArray(data1) && data1.length > 0) {
      data1.forEach((emp) => {
        if (emp.licenseType !== 'No License' && emp.licenseType !== 'Deactivated') {
          if (licenseCount.has('Licensed Users')) {
            licenseCount.set('Licensed Users', licenseCount.get('Licensed Users') + 1)
          } else {
            licenseCount.set('Licensed Users', 1)
          }
        } else {
          if (licenseCount.has(emp.licenseType)) {
            licenseCount.set(emp.licenseType, licenseCount.get(emp.licenseType) + 1)
          } else {
            licenseCount.set(emp.licenseType, 1)
          }
        }
      })
    }
    console.log(licenseCount)
    setAllLicenseCount(licenseCount)
    setLicenseCount(licenseCount)
  }, [data1])

  useEffect(() => {
    if (selectedDropdownValue1 === 'All Regions') {
      setLicenseCount(allLicenseCount)
    } else {
      const data = data1.filter((emp) => emp.region === selectedDropdownValue1)
      const licenseCount = new Map()
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((emp) => {
          if (emp.licenseType !== 'No License' && emp.licenseType !== 'Deactivated') {
            if (licenseCount.has('Licensed Users')) {
              licenseCount.set('Licensed Users', licenseCount.get('Licensed Users') + 1)
            } else {
              licenseCount.set('Licensed Users', 1)
            }
          } else {
            if (licenseCount.has(emp.licenseType)) {
              licenseCount.set(emp.licenseType, licenseCount.get(emp.licenseType) + 1)
            } else {
              licenseCount.set(emp.licenseType, 1)
            }
          }
        })
      }
      setLicenseCount(licenseCount)
    }
  }, [selectedDropdownValue1])

  const dropdownOptions1 = ['All Regions', 'GDC', 'Eu East', 'Eu West', 'Ind', 'ANZ', 'NA']

  const dropdownStyle = {
    padding: '10px', // Add padding for spacing
    fontSize: '16px', // Adjust font size
    backgroundColor: '#f0f0f0', // Change background color
    color: 'darkblue', // Change text color
    border: '2px solid #ccc', // Add border
    borderRadius: '5px',
  }

  return (
    <div>
      <div>
        <select
          style={dropdownStyle}
          value={selectedDropdownValue1}
          onChange={(e) => setSelectedDropdownValue1(e.target.value)}
        >
          {dropdownOptions1.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div style={{ maxWidth: '400px' }}>
        <CChart
          type="bar"
          data={{
            labels: Array.from(licenseCount.keys()).slice(0, 3), // Reduce the number of labels to adjust the width
            datasets: [
              {
                label: 'No of Users',
                backgroundColor: [
                  'rgba(113, 248, 140, 0.6)',
                  'rgba(108, 122, 137, 0.6)',
                  'rgba(248, 113, 113, 0.6)', // Color for the first bar
                  // Color for the second bar
                  // Color for the third bar
                ],
                data: Array.from(licenseCount.values()).slice(0, 3), // Reduce the data points
                barThickness: 35,
              },
            ],
          }}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'top', // Position the legend at the top
                labels: {
                  color: 'gray', // Change legend label color
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: 'lightgray', // Change x-axis grid color
                },
                ticks: {
                  color: 'gray', // Change x-axis tick label color
                },
              },
              y: {
                grid: {
                  color: 'lightgray', // Change y-axis grid color
                },
                ticks: {
                  color: 'gray', // Change y-axis tick label color
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default LicenseBar
