import React from 'react'
import { useNavigate } from 'react-router-dom'
import SMTPTable from '../components/Tables/SMTPTable'
import useApi from "../hooks/useApi";
import Loader from "../common/Loader";

const SMTP = () => {

  const { data, loading } = useApi("/SettingSuperAdmin/GetAllSMTPSettingList")

  const navigate = useNavigate()
  const handelNavigate = () => {
    navigate("/smtp/create", { state: data })
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>SMTP Setting</h2>
        </div>
        <hr />
      </div>
      {
        loading ? <Loader /> :
          <>
            <div className="row">
              <div className="col-md-12">
                <button onClick={() => !loading && handelNavigate()} className="btn btn-app mb-2">{!loading ? "+Create new" : "Loading..."}</button>
              </div>
            </div>

            <div className="row">

              <SMTPTable tableData={data} />
            </div>
          </>
      }


    </div>
  )
}

export default SMTP