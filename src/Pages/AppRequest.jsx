import React, { useEffect, useState }  from "react";
import useApi from "../hooks/useApi";
import Loader from "../common/Loader";
import Kanban from "../common/StatusDnd/Kanban";

const AppRequest = () => {
  const {data:appsList,loading} = useApi("/GetApplistForAdmin")
  const { data: appStatusData } = useApi("/GetAppStatus");
  const [filterText, setFilterText] = useState('');
  const [ticketListsDnd,setTicketListsDnd] = useState([])
 

  const filteredData = ticketListsDnd?.filter((item) =>
    item.organisation.toLowerCase().includes(filterText.toLowerCase()) ||
    item.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
    item.ticketNo.toString().toLowerCase().includes(filterText.toLowerCase()) 
  );
 
  const handleFilterChange = (event) => {
    setFilterText(event.target.value);
  };
useEffect(() => {

  setTicketListsDnd(appsList?.data)
}, [appsList])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head col-6">
          <h2>App Requests</h2>
        </div>
        <div className="col-3 my-1">
{
  filteredData?.length===0 &&
          <h5 className="text-end">Records Not Found!</h5>
}
        </div>
          <div className="col-3 my-1">
          <input type="text" name="" id="" className="form form-control"
            value={filterText}
            placeholder="Filter by Name, Ticket no."
            onChange={handleFilterChange}
          />
        </div>
        {/* <hr /> */}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
       {/* <div className="row">
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
          </div> */}
         
            {/* <AppRequestsTable tableData={ticketLists} /> */}
            <Kanban columns={appStatusData?.data} tickets={ticketListsDnd} filterText={filterText} />
        </>
      )}
    </div>
  );
};

export default AppRequest;
