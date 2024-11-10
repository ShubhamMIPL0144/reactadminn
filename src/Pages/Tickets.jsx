import React, { useEffect } from "react";
import useApi from "../hooks/useApi";
import Loader from "../common/Loader";
import TicketTable from "../components/Tables/TicketTable";
import { useState } from "react";

const Tickets = () => {
  const {data:appsList,loading} = useApi("/GetApplistForAdmin")
  const { data: appStatusData } = useApi("/GetAppStatus");
 const [ticketLists,setTicketLists] = useState([])
 const handleChange=(e)=>
  {
    const statusDetails = JSON.parse(e.target.value)
    const filteredList = appsList?.data?.filter(ticket=>ticket.statusId===statusDetails.statusId&&ticket)
    setTicketLists(filteredList)
  //  setStatus(statusDetails)
  }
 
useEffect(() => {
  const filteredList = appsList?.data?.filter(ticket=>ticket.statusId===1&&ticket)
  setTicketLists(filteredList)
}, [appsList])

 
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Tickets</h2>
        </div>
        <hr />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                  Status
                </label>
                <select className="form-control form-control-solid form-select" onChange={
                  (e)=>handleChange(e)
                  }
                  >
                  {appStatusData?.data?.map((appStatus,index) => (
                    <option
                      key={appStatus.id}
                      value={JSON.stringify({
                        statusId: appStatus.id,
                        status: appStatus.statusName,
                      })}
                    >
                      {appStatus.statusName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <TicketTable tableData={ticketLists} />
          </div>
        </>
      )}
    </div>
  );
};

export default Tickets;
