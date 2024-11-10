import React, { useEffect, useState } from 'react'
import useApi from "../hooks/useApi";
import CustomersTable from '../components/Tables/CustomersTable';

const Customers = () => {

    const [appCreatorScreen, setAppCreatorScreen] = useState(false)
    const [adCreatorArray, setAdCreatorArray] = useState([])
    const [appCreatorArray, setAppCreatorArray] = useState([])
    const { data, loading: logLoading } = useApi("/AddCreatorList")
    useEffect(() => {
        const appCreators =data?.data.filter(obj => obj.userType === "app-creator")
        const adCreators = data?.data.filter(obj => obj.userType === "ad-creator" || obj.userType === "add-creator")
        setAppCreatorArray(adCreators)
        setAdCreatorArray(appCreators)

    }, [data])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="app-head">
                    <h2>Customers</h2>
                </div>
                <hr />
            </div>
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-bodys">


                            <ul className="nav nav-pills navtab-bg nav-justified">
                                <li className="nav-item" onClick={() => setAppCreatorScreen(false)}>
                                    <span className={`nav-link  ${!appCreatorScreen ? 'active' : ''}`}>
                                        App Creator
                                    </span>
                                </li>
                                <li className="nav-item" onClick={() => setAppCreatorScreen(true)}>
                                    <span className={`nav-link  ${appCreatorScreen ? 'active' : ''}`}>
                                        Ad Creator
                                    </span>
                                </li>

                            </ul>
                            <div className="tab-content">
                                {
                                    !appCreatorScreen &&
                                    (<div className="show active" id="home1">

                                        <CustomersTable tableData={adCreatorArray} logLoading={logLoading} />
                                    </div>)
                                }

                                {
                                    appCreatorScreen &&
                                    (<div className="" id="profile1">
                                        <div className="row">

                                            <CustomersTable tableData={appCreatorArray} logLoading={logLoading} />
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

export default Customers