import React, { useEffect, useState } from 'react'
import useApi from "../hooks/useApi";
import LogsTable from '../components/Tables/LogsTable';

const LoginLogs = () => {

    const { data, loading: logLoading } = useApi("/ApplicationSuperAdmin/GetLoginLogforSuperAdmin")


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="app-head">
                    <h2>Admin Logs</h2>
                </div>
                <hr />
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-bodys">


                            {/* <ul className="nav nav-pills navtab-bg nav-justified">
                                <li className="nav-item" onClick={() => setLogsShow(false)}>
                                    <span className={`nav-link  ${!logsShow ? 'active' : ''}`}>
                                        App Creator
                                    </span>
                                </li>
                                <li className="nav-item" onClick={() => setLogsShow(true)}>
                                    <span className={`nav-link  ${logsShow ? 'active' : ''}`}>
                                        Ad Creator
                                    </span>
                                </li>

                            </ul> */}
                            {/* <div className="tab-content">
                                {
                                    !logsShow && */}
                                    <div className="show active" id="home1">

                                        <LogsTable tableData={data} logLoading={logLoading} />
                                    </div>
                                {/* }

                                {
                                    logsShow &&
                                    (<div className="" id="profile1">
                                        <div className="row">

                                            <LogsTable tableData={adCreatorArray} logLoading={logLoading} />
                                        </div>
                                    </div>)
                                } */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LoginLogs