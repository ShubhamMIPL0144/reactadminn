import React, { useState } from 'react'
import useApi from "../hooks/useApi";
import ProfileForm from '../components/Forms/ProfileForm';
import LogsTable from '../components/Tables/LogsTable';

const Profile = () => {

    const [logsShow, setLogsShow] = useState(false)
    const { data, loading: logLoading } = useApi("/ApplicationSuperAdmin/GetLoginLogforSuperAdmin")


    const { data: profileDetails, loading: profileLoading } = useApi("/ApplicationSuperAdmin/GetSuperAdminDetails")
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="app-head">
                    <h2>My Profile & Log</h2>
                </div>
                <hr />
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-bodys">


                            <ul className="nav nav-pills navtab-bg nav-justified">
                                <li className="nav-item" onClick={() => setLogsShow(false)}>
                                    <span className={`nav-link  ${!logsShow ? 'active' : ''}`}>
                                        Profile
                                    </span>
                                </li>
                                <li className="nav-item" onClick={() => setLogsShow(true)}>
                                    <span className={`nav-link  ${logsShow ? 'active' : ''}`}>
                                        Log
                                    </span>
                                </li>

                            </ul>
                            <div className="tab-content">
                                {
                                    !logsShow &&
                                    (<div className="show active" id="home1">
                                        <ProfileForm profileDetails={profileDetails?.data} profileLoading={profileLoading} />

                                    </div>)
                                }

                                {
                                    logsShow &&
                                    (<div className="" id="profile1">
                                        <div className="row">
                                        <LogsTable tableData={data} logLoading={logLoading} />
                                            {/* <MyProfileLogsTable tableData={data} logLoading={logLoading} /> */}
                                        </div>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Profile