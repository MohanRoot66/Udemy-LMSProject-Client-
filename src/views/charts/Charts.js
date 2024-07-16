
import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import BandBar from './BandBar'
import LicenseBar from './LicenseBar'
 
const Charts = () => {
  const [data, setData] = useState([])
 
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
 
  const EdsCount = data.filter((item) => item.bu === 'EDS')
  const EbsCount = data.filter((item) => item.bu === 'EBS')
  const EsCount = data.filter((item) => item.bu === 'ES')
  const BssCount = data.filter((item) => item.bu === 'BSS')
  const eds = EdsCount.length
  const ebs = EbsCount.length
  const es = EsCount.length
  const bss = BssCount.length
 
  const gdcCount = data.filter((item) => item.region === 'GDC')
  const ANZCount = data.filter((item) => item.region === 'ANZ')
  const Eu_EastCount = data.filter((item) => item.region === 'Eu East')
  const Eu_WestCount = data.filter((item) => item.region === 'Eu West')
  const IndCount = data.filter((item) => item.region === 'Ind')
  const NACount = data.filter((item) => item.region === 'NA')
  const gdc = gdcCount.length
  const eueast = Eu_EastCount.length
  const euwest = Eu_WestCount.length
  const ind = IndCount.length
  const anz = ANZCount.length
  const na = NACount.length
 
  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>BU wise User Chart</CCardHeader>
          <CCardBody style={{ height: '450px' }}>
            <CChartDoughnut
              data={{
                labels: ['EDS', 'EBS', 'ESS', 'BSS'],
                datasets: [
                  {
                    backgroundColor: ['#006994', '#b53389', '#08e8de', '#007474'],
                    data: [eds, ebs, es, bss],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false, // Disable the aspect ratio
                responsive: true, // Allow the chart to be responsive
              }}
              width={400} // Set the desired width
              height={400} // Set the desired height
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Region Wise User Chart</CCardHeader>
          <CCardBody style={{ height: '450px' }}>
            <CChartDoughnut
              data={{
                labels: ['GDC', 'Eu East', 'Eu West', 'ANZ', 'Ind', 'NA'],
                datasets: [
                  {
                    data: [gdc, eueast, euwest, anz, ind, na],
                    backgroundColor: [
                      '#cc5500',
                      '#FFCE56',
                      '#FFA500',
                      '#36A2EB',
                      '#87CEEB',
                      '#FF6384',
                    ],
                    hoverBackgroundColor: [
                      '#4BC0C0',
                      '#FFCE56',
                      '#FFA500',
                      '#36A2EB',
                      '#87CEEB',
                      '#FF6384',
                    ],
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false, // Disable the aspect ratio
                responsive: true, // Allow the chart to be responsive
              }}
              width={400} // Set the desired width
              height={400} // Set the desired height
            />
          </CCardBody>
        </CCard>
      </CCol>
 
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>License Type Wise Users</CCardHeader>
          <CCardBody>
            <LicenseBar />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Band Wise User Chart</CCardHeader>
          <CCardBody>
            <BandBar />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
 
export default Charts
 