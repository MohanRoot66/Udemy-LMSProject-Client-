import React, { useState , useEffect} from 'react'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
// import data from './Userdata.json'
 

const WidgetsDropdown = () => {
  const [data, setUsersLearning] = useState([])
  const [isLoading , setIsLoading]=useState(true)
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
    const Eds_EnterpriseCount = data.filter(
      (item) => item.bu === 'EDS' && item.licenseType === 'Enterprise',
    )
    const Eds_ProCount = data.filter(
      (item) => item.bu === 'EDS' && item.licenseType === 'Enterprise, Pro',
    )
    const Ebs_EnterpriseCount = data.filter(
      (item) => item.bu === 'EBS' && item.licenseType === 'Enterprise',
    )
    const Ebs_ProCount = data.filter(
      (item) => item.bu === 'EBS' && item.licenseType === 'Enterprise, Pro',
    )
    const Es_EnterpriseCount = data.filter(
      (item) => item.bu === 'ES' && item.licenseType === 'Enterprise',
    )
    const Es_ProCount = data.filter(
      (item) => item.bu === 'ES' && item.licenseType === 'Enterprise, Pro',
    )
    const Bss_EnterpriseCount = data.filter(
      (item) => item.bu === 'BSS' && item.licenseType === 'Enterprise',
    )
    const Bss_ProCount = data.filter(
      (item) => item.bu === 'BSS' && item.licenseType === 'Enterprise, Pro',
    )
  return (
    <CRow>
      <CCol sm={1} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="primary"
          value={<div>EDS</div>}
          title={
            <div>
              Enterprise Users - {Eds_EnterpriseCount.length}
              <br />
              Pro Users - {Eds_ProCount.length}
              <br />
              Total Users - {Eds_EnterpriseCount.length + Eds_ProCount.length}
            </div>
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="info"
          value={<div>EBS</div>}
          title={
            <div>
              Enterprise Users - {Ebs_EnterpriseCount.length}
              <br />
              Pro Users - {Ebs_ProCount.length}
              <br />
              Total Users - {Ebs_EnterpriseCount.length + Ebs_ProCount.length}
            </div>
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="warning"
          value={<div>ES</div>}
          title={
            <div>
              Enterprise Users - {Es_EnterpriseCount.length}
              <br />
              Pro Users - {Es_ProCount.length}
              <br />
              Total Users - {Es_EnterpriseCount.length + Es_ProCount.length}
            </div>
          }
        />
      </CCol>
      <CCol sm={6} lg={3}>
        <CWidgetStatsA
          className="mb-4"
          color="danger"
          value={<div>BSS</div>}
          title={
            <div>
              Enterprise Users - {Bss_EnterpriseCount.length}
              <br />
              Pro Users - {Bss_ProCount.length}
              <br />
              Total Users - {Bss_EnterpriseCount.length + Bss_ProCount.length}
            </div>
          }
        />
      </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
