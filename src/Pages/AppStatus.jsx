import React, { useState } from "react";

import CreateAppStatus from "./sub-pages/CreateAppStatus";
import CreateAppSubStatus from "./sub-pages/CreateAppSubStatus";

const AppStatus = () => {
  const [toggleStatus, setToggleStatus] = useState(false);


 

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Apps Status</h2>
        </div>
        <hr />
      </div>

      <div className="row mt-1 mb-3">
        <div className="col-12">
          <ul className="nav nav-pills navtab-bg nav-justified">
            <li className="nav-item" onClick={() => setToggleStatus(false)}>
              <span className={`nav-link  ${!toggleStatus ? "active" : ""}`}>
                Status
              </span>
            </li>
            <li className="nav-item" onClick={() => setToggleStatus(true)}>
              <span
                className={`nav-link d-inline-block ${
                  toggleStatus ? "active" : ""
                }`}
                style={{ width: "10rem" }}
              >
                Checklist
              </span>
            </li>
          </ul>

          <div className="tab-content">
            {!toggleStatus && (
              <div className="show active" >
              <CreateAppStatus/>
              </div>
            )}

            {toggleStatus && (
              <div className="">
             <CreateAppSubStatus/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStatus;
