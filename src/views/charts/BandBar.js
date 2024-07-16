
import React, { useEffect, useState } from 'react'
import { CChart } from '@coreui/react-chartjs'
 
function BandBar() {
  const [data, setUsersLearning] = useState([])
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('All Regions')
  const [bandDropdownValue, setBandDropdownValue] = useState('All')
  const [allBands, setAllBands] = useState(new Set())
  const [bands, setBands] = useState(new Set())
  const [bandCount, setBandCount] = useState(new Map())
  const [allBandsCount, setAllBandsCount] = useState(new Map())
 
  useEffect(() => {
    // Make an API request to fetch the JSON data
    fetch('http://localhost:5002/getDataWithNoExcel')
      .then((response) => response.json())
      .then((jsonData) => {
        // Filter the user data based on licenceType not equal to 'No licence' and not null
        const filteredUserData = jsonData.user.filter(
          (user) => user.licenceType !== 'No licence' && user.licenceType !== null,
        )
        setUsersLearning(filteredUserData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])
 
  useEffect(() => {
    const map = new Map()
    const allBands = [
      'All',
      ...new Set(data.map((item) => (item.band ? item.band.trim() : 'No band'))),
    ]
    const bb = new Set()
 
    // Iterate through the original set and remove trailing numbers
    allBands.forEach((value) => {
      const characterValue = value.replace(/\d+$/, '') // Remove trailing numbers
      bb.add(characterValue)
    })
 
    console.log(data.length + '|||||||||||||||||||||')
    data.forEach((emp) => {
      const orginalBand = emp.band ? emp.band.trim() : 'No band'
      const characterValue = orginalBand.replace(/[0-9]+$/, '').trim()
      if (map.has(characterValue)) {
        map.set(characterValue, map.get(characterValue) + 1)
      } else {
        map.set(characterValue, 1)
      }
    })
    const maps = Array.from(map)
    maps.sort((a, b) => a[0].length - b[0].length)
    const sortedMap = new Map(maps)
    setBands(bb)
    setAllBands(bb)
    setBandCount(sortedMap)
    setAllBandsCount(sortedMap)
  }, [data])
 
  useEffect(() => {
    if (selectedDropdownValue !== 'All Regions' && bandDropdownValue === 'All') {
      const map = new Map()
      const dataa = data.filter((item) => item.region === selectedDropdownValue)
      const allBands = ['All', ...new Set(dataa.map((a) => (a.band ? a.band.trim() : 'No band')))]
      const bb = new Set()
 
      // Iterate through the original set and remove trailing numbers
      allBands.forEach((value) => {
        const characterValue = value.replace(/\d+$/, '') // Remove trailing numbers
        bb.add(characterValue)
      })
      dataa.forEach((emp) => {
        const orginalBand = emp.band ? emp.band.trim() : 'No band'
        const characterValue = orginalBand.replace(/[0-9]+$/, '').trim()
        if (map.has(characterValue)) {
          map.set(characterValue, map.get(characterValue) + 1)
        } else {
          map.set(characterValue, 1)
        }
      })
      const maps = Array.from(map)
      maps.sort((a, b) => a[0].length - b[0].length)
      const sortedMap = new Map(maps)
      setBands(bb)
      setBandCount(sortedMap)
      console.log(sortedMap)
      console.log(dataa.length)
    } else if (selectedDropdownValue === 'All Regions' && bandDropdownValue === 'All') {
      setBands(allBands)
      setBandCount(allBandsCount)
      console.log(allBandsCount)
    } else if (selectedDropdownValue === 'All Regions' && bandDropdownValue !== 'All') {
      const map = new Map()
      data &&
        data.forEach((emp) => {
          const band = emp.band ? emp.band.trim() : 'No band'
          const characterValue = band.replace(/[0-9]+$/, '').trim()
          if (characterValue === bandDropdownValue) {
            if (map.has(band)) {
              map.set(band, map.get(band) + 1)
            } else {
              map.set(band, 1)
            }
          }
        })
      setBandCount(map)
    } else if (selectedDropdownValue !== 'All Regions' && bandDropdownValue !== 'All') {
      const dataa = data.filter((emp) => emp.region === selectedDropdownValue)
      const map = new Map()
      dataa &&
        dataa.forEach((emp) => {
          const band = emp.band ? emp.band.trim() : 'No band'
          const characterValue = band.replace(/[0-9]+$/, '').trim()
          if (characterValue === bandDropdownValue) {
            if (map.has(band)) {
              map.set(band, map.get(band) + 1)
            } else {
              map.set(band, 1)
            }
          }
        })
      setBandCount(map)
    }
  }, [selectedDropdownValue, bandDropdownValue])
 
  // You have an empty useEffect for `bandDropdownValue`, you can add code here if needed.
 
  const dropdownStyle = {
    width: '200px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: 'white',
    fontSize: '16px',
  }
 
  const dropdownOptions = ['All Regions', 'GDC', 'Eu East', 'Eu West', 'Ind', 'ANZ', 'NA']
 
  return (
    <div>
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
          value={bandDropdownValue}
          onChange={(e) => setBandDropdownValue(e.target.value)}
        >
          {Array.from(bands).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
 
      <div>
        <CChart
          type="bar"
          data={{
            labels: Array.from(bandCount.keys()),
            datasets: [
              {
                label: 'No of Users',
                backgroundColor: '#f87979',
                data: Array.from(bandCount.values()),
                barThickness: 40, // Adjust this value to decrease the size of the bars
              },
            ],
          }}
          labels="months"
          options={{
            plugins: {
              legend: {
                labels: {
                  color: 'Red',
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: 'transparent',
                },
                ticks: {
                  color: 'Blue',
                },
              },
              y: {
                grid: {
                  color: 'transparent',
                },
                ticks: {
                  color: 'Blue',
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}
 
export default BandBar
 