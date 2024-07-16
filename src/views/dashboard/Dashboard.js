import React from 'react'
import { useEffect, useState } from 'react'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'
// import data from './AllUser5.json'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import LearningHoursCount from './LearningHoursCount'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setUsersLearning] = useState([])
    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('client'))
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
  const [topUsers, setTopUSers] = useState([])

  const EnterpriseCount = data.filter((item) => item.licenseType === 'Enterprise')
  const Entcount = EnterpriseCount.length

  const ProCount = data.filter((item) => item.licenseType === 'Enterprise, Pro')
  const Pro = ProCount.length

  const NotassignedCount = data.filter((item) => item.licenseType === null)
  const unassignedcount = NotassignedCount.length

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
  const gdcCount = data.filter(
    (item) =>
      item.region === 'GDC' &&
      (item.licenseType === 'Enterprise' || item.licenseType === 'Enterprise, Pro'),
  )
  const gdcPercent = Math.round((gdcCount.length / data.length) * 100)
  const ANZCount = data.filter(
    (item) =>
      item.region === 'ANZ' &&
      (item.licenseType === 'Enterprise' || item.licenseType === 'Enterprise, Pro'),
  )
  const ANZPercent = Math.round((ANZCount.length / data.length) * 100)
  const Eu_EastCount = data.filter(
    (item) =>
      item.region === 'Eu East' &&
      (item.licenseType === 'Enterprise' || item.licenseType === 'Enterprise, Pro'),
  )
  const Eu_EastPercent = Math.round((Eu_EastCount.length / data.length) * 100)
  const Eu_WestCount = data.filter(
    (item) =>
      item.region === 'Eu West' &&
      (item.licenseType === 'Enterprise' || item.licenseType === 'Enterprise, Pro'),
  )
  const Eu_WestPercent = Math.round((Eu_WestCount.length / data.length) * 100)
  const IndCount = data.filter(
    (item) =>
      item.region === 'Ind' &&
      (item.licenseType === 'Enterprise' || item.licenseType === 'Enterprise, Pro'),
  )
  const IndPercent = Math.round((IndCount.length / data.length) * 100)
  const NACount = data.filter(
    (item) =>
      item.region === 'NA' &&
      (item.licenseType === 'Enterprise' || item.licenseType === 'Enterprise, Pro'),
  )
  const NAPercent = Math.round((NACount.length / data.length) * 100)
  const progressExample = [
    { title: 'GDC', value: gdcCount.length, percent: gdcPercent, color: 'success' },
    { title: 'ANZ', value: ANZCount.length, percent: ANZPercent, color: 'info' },
    { title: 'Eu East', value: Eu_EastCount.length, percent: Eu_EastPercent, color: 'warning' },
    { title: 'Eu West', value: Eu_WestCount.length, percent: Eu_WestPercent, color: 'danger' },
    { title: 'Ind', value: IndCount.length, percent: IndPercent, color: 'primary' },
    { title: 'NA', value: NACount.length, percent: NAPercent, color: 'primary' },
  ]
  useEffect(() => {
    const topusers = []
    data &&
      data.map((emp) => {
        let hours = 0
        emp.paths &&
          emp.paths.map((path) => {
            path.courses &&
              path.courses.map((course) => {
                hours += course.consumedMinutes
              })
          })

        topusers.push({
          name: emp.name,
          region: emp.region,
          bu: emp.bu,
          hours: hours / 60,
        })
      })

    const SortedData = topusers.sort((a, b) => b.hours - a.hours)
    const Most = SortedData.slice(0, 5)
    setTopUSers(Most)
  }, [data])

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                40 Hrs Completed Users Count
              </h4>
              <div className="small text-medium-emphasis">January - December</div>
            </CCol>
          </CRow>
          {/* <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'Auguest',
                'September',
                'Octobar',
                'November',
                'December',
              ],
              datasets: [
                {
                  label: 'EDS',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: 'EBS',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-success'),
                  pointHoverBackgroundColor: getStyle('--cui-success'),
                  borderWidth: 3,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: 'ES',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 2,
                  data: [
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                  ],
                },
                {
                  label: 'BSS',
                  backgroundColor: hexToRgba(getStyle('--cui-warning'), 10),
                  borderColor: getStyle('--cui-warning'),
                  pointHoverBackgroundColor: getStyle('--cui-warning'),
                  borderWidth: 2,
                  data: [
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                    random(50, 100),
                  ],
                  fill: true,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          /> */}
          <LearningHoursCount />
        </CCardBody>
      </CCard>
      <div style={{ backgroundColor: 'white' }}>
        <CRow xs={{ cols: 2 }} md={{ cols: 6 }} className="text-center">
          {progressExample.map((item, index) => (
            <CCol className="mb-sm-2 mb-0" key={index}>
              <div className="text-medium-emphasis">{item.title}</div>
              <strong>
                {item.value} ({item.percent}%)
              </strong>
              <CProgress thin className="mt-2" color={item.color} value={item.percent} />
            </CCol>
          ))}
        </CRow>
      </div>
      <br />
      <CRow>
        <CCol xs>
          <CCard className="mb-5">
            <CCardHeader>
              <b>Top Udemy Users</b>
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>Region</CTableHeaderCell>
                    <CTableHeaderCell>BU</CTableHeaderCell>
                    <CTableHeaderCell>Hours Spent</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {topUsers.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell>
                        {' '}
                        <CIcon icon={cilPeople} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.name}</div>
                        {/* <div className="small text-medium-emphasis">{item.name}</div> */}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.region}</div>
                        {/* <div className="small text-medium-emphasis">{item.region}</div> */}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.bu}</div>
                        {/* <div className="small text-medium-emphasis">{item.bu}</div> */}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.hours.toFixed(2)}</div>
                        {/* <div className="small text-medium-emphasis">{item.hours.toFixed(2)}</div> */}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
