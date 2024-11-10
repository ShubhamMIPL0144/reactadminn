import React, { useState } from "react";

import CreateStates from "./sub-pages/CreateStates";
import CreateCities from "./sub-pages/CreateCities";

const States = () => {
  const [toggleStatus, setToggleStatus] = useState(false);


 

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>States</h2>
        </div>
        <hr />
      </div>

      <div className="row mt-1 mb-3">
        <div className="col-12">
          <ul className="nav nav-pills navtab-bg nav-justified">
            <li className="nav-item" onClick={() => setToggleStatus(false)}>
              <span className={`nav-link  ${!toggleStatus ? "active" : ""}`}>
                States
              </span>
            </li>
            <li className="nav-item" onClick={() => setToggleStatus(true)}>
              <span
                className={`nav-link d-inline-block ${
                  toggleStatus ? "active" : ""
                }`}
                style={{ width: "10rem" }}
              >
                Cities
              </span>
            </li>
          </ul>

          <div className="tab-content">
            {!toggleStatus && (
              <div className="show active" >
              <CreateStates/>
              </div>
            )}

            {toggleStatus && (
              <div className="">
             <CreateCities/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default States;
