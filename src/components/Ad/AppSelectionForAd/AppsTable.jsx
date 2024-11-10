import React, { useEffect, useMemo } from "react";
import { useCallback } from "react";
import appIconLocal from "../../../assets/images/cell-phone.png"
const AppsTable = ({
  setDataForCalculation,
  dataForCalculation,
  loading,
  adData,
  setAdData,
  dispatch,state
}) => {
  const {dateRangeHeader,appList,statusArray} = state
  const calculatedData = useMemo(() => dataForCalculation, [dataForCalculation])
  const handleCheckboxChange = useCallback((status) => {
    const existingIndex = statusArray.findIndex(
      (item) =>
        item.applicationId === status.applicationId && item.date === status.date
    );
    if (existingIndex !== -1) {
      const updatedStatusArray = [...statusArray];
      updatedStatusArray.splice(existingIndex, 1);
      dispatch({type:"setStatusArray",payload:updatedStatusArray})
    } else {
      dispatch({type:"setStatusArray",payload:[...statusArray,status]})
    }
      //eslint-disabled-next-line
  },[statusArray]);

  useEffect(() => {
    if (statusArray.length > 0) {
      let sanitizedData = appList.filter((item1) =>
        statusArray.some((item2) => item1.applicationId === item2.applicationId)
      );

      let totalRegisterUsers = sanitizedData.reduce(
        (acc, value) => Number(acc) + Number(value.registredUsers),
        0
      );
      let totalUnregisterUsers = sanitizedData.reduce(
        (acc, value) => Number(acc) + Number(value.unRegistredUsers),
        0
      );
      setDataForCalculation({
        ...calculatedData,
        registeredUsers: totalRegisterUsers,
        unRegisteredUsers: totalUnregisterUsers,
        rateRegisteredUsers: sanitizedData[0].rateRegistredUsers,
        rateUnregisteredUsers: sanitizedData[0].rateUnRegistredUsers,
        totalDays: statusArray.length || 0,
      });

      setAdData({ ...adData, selectedAppsByDate: statusArray });
    } else if (statusArray.length === 0) {
      setDataForCalculation({
        registeredUsers: 0,
        unRegisteredUsers: 0,
        rateRegisteredUsers: 0,
        rateUnregisteredUsers: 0,
        totalDays: 0,
      });
      setAdData({ ...adData, selectedAppsByDate: [] });
    }
      //eslint-disabled-next-line
  }, [statusArray]);

  const regStr = "Registered Users";
  const unRegStr = "Unregistered Users";
  return (
    <div className="">
    
      {loading ? (
        <div className="loader-container my-3">
          <i className="fa fa-spinner fa-spin"></i>
        </div>
      ) : (
        <div className="">
          <div className="col-12 d-flex justify-content-end align-items-center pe-0">

<span className="d-inline-block fs-7 fw-bold mx-1">
Unavailable
</span>
<div
  className="bg-danger mt-1 d-inline-block me-3"
  style={{
    width: "1.1rem",
    height: "1.1rem",
    borderRadius: "2px",
  }}
></div>

<span className="d-inline-block fs-7 fw-bold mx-1 d-flex">
  Available
</span>
<div
  className="d-inline-block me-3 mt-1"
  style={{
    width: "1rem",
    height: "1.1rem",
    borderRadius: "2px",
    border: "1px solid #4F4F4F",
  }}
></div>

<span className="d-inline-block fs-7 fw-bold">Selected</span>
<input
  type="checkbox"
  className="mt-1 d-inline-block mx-1"
  style={{
    accentColor: "#58D68D",
  }}
  checked
/>
</div>
          <div className="border table-container">
            <table id="demo-foo-addrow" className="table custom-table " data-page-size="10">
              <thead>
                <tr>
                  <th className="px-1">S.No</th>
                  <th className="px-1">Icon</th>
                  <th className="px-1">App</th>
                  <th className="px-1"
                    title="Registered Users"
                    style={{ overflowWrap: "normal" }}
                  >
                    {dateRangeHeader?.length > 5
                      ? regStr.slice(0, 5) + "..."
                      : regStr}
                  </th>
                  <th className="px-1"
                    title="Unregistered Users"
                    style={{ overflowWrap: "normal" }}
                  >
                    {dateRangeHeader?.length > 5
                      ? unRegStr.slice(0, 5) + "..."
                      : unRegStr}
                  </th>
                  {dateRangeHeader?.map((item, index) => (
                    <th key={index} className="text-center px-1">
                      {item.dateRange}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="custom-scroll">
                {appList.map((app, index) => (
                  <tr key={app.applicationId}>
                    <td>{index + 1}</td>
                    <td>
                      <img
              src={app.appIcon||appIconLocal}
              alt="icon"
              className="rounded"
              style={{
                width:"2rem",height:"2rem"
              }}
            />
                    </td>
                    <td className="word-break">{app.applicationName}</td>
                    <td>{app.registredUsers}</td>
                    <td>{app.unRegistredUsers}</td>

                    {app.status?.map((status, index) => (
                      <td key={index} className="text-center">
                        {status.status !== "NA" ? (
                          <input
                            type="checkbox"
                            id={index}
                            // className="mt-2"
                            checked={statusArray.some(
                              (item) =>
                                item.date === status.date &&
                                item.applicationId === status.applicationId
                            )}
                            disabled={status.status === "NA"}
                            style={{
                              accentColor: "#58D68D",
                              cursor: status.status === "NA" && "not-allowed",
                            }}
                            onChange={() => handleCheckboxChange(status)}
                          />
                        ) : (
                          <div className="d-flex justify-content-center">
                            <div
                              title={"Inte tillämpbar"}
                              className="bg-danger"
                              style={{
                                width: "1.3rem",
                                height: "1.3rem",
                                borderRadius: "2px",
                              }}
                            ></div>
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AppsTable);
