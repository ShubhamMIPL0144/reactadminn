import React from "react";
import { Accordion } from "react-bootstrap";
// import Maps from "./Maps";

const Location = ({
  state,
  dispatch,
  handleCheckboxChange,
  handleCheckboxAll,
}) => {
  const { selectedStates, allStatesSelected,states } = state;


  return (
    <>
      <div className="row">
        <div className="col-md-12 col-sm-10">
          <h5>Select states and cities</h5>
        </div>
        <div className="col-md-2  col-sm-10">
          <>
            <label htmlFor="all" className="mb-0 mx-1">
              Select All
            </label>
            <input
              type="checkbox"
              id="all"
              onChange={(e) => {
                dispatch({type:"setIndividualChecked",payload:false})
                handleCheckboxAll(states, e.target.checked);
              }}
              checked={allStatesSelected}
            />
          </>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
        <Accordion defaultActiveKey="0">
                {states?.map((state, index) => (
                  <Accordion.Item eventKey={index} key={state.stateId}>
                    <Accordion.Header className="w-100" style={{ height: "2rem" }}>
                      {state.stateName}
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="d-flex align-items-center">
                        <input
                        className="mt-2"
                          type="checkbox"
                          id={state.stateId}
                          onChange={() => handleCheckboxChange(state.stateId)}
                          checked={selectedStates?.includes(state.stateId)} // Update based on selectedStates
                        />
                        <label htmlFor={state.stateId} className="mb-0 mt-2 mx-1">
                        Select State
                        </label>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
        </div>
      </div>
    </>
  );
};

export default React.memo(Location);
