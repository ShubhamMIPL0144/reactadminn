import React, { useCallback, useEffect, useReducer, useState } from "react";
import AdServices from "../../services/ad-services";
import Location from "../../components/Ad/Location";
import StateServices from "../../services/states-services";
import AdForm from "../../components/Ad/AdForm";
import AppSelectionForAd from "../../components/Ad/AppSelectionForAd/AppSelectionForAd";

const initialState = {
  activeTab: "location",
  selectedStates: [],
  allStatesSelected: false,
  individualChecked: null,
  appList: [],
  dateRangeHeader: [],
  states: [],
  isLinkClicked: false,
  statusArray: [],
  videoUrl: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "setActiveTab":
      return { ...state, activeTab: action.payload };
    case "setSelectedStates":
      return { ...state, selectedStates: action.payload };
    case "setAllStatesSelected":
      return { ...state, allStatesSelected: action.payload };
    case "setIndividualChecked":
      return { ...state, individualChecked: action.payload };
    case "setAppList":
      return { ...state, appList: action.payload };
    case "setDateRangeHeader":
      return { ...state, dateRangeHeader: action.payload };
    case "setStates":
      return { ...state, states: action.payload };
    case "setIsLinkClicked":
      return { ...state, isLinkClicked: action.payload };
    case "setStatusArray":
      return { ...state, statusArray: action.payload };
    case "setVideoUrl":
      return { ...state, videoUrl: action.payload };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const CreateAd = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [adData, setAdData] = useState({
    states: [],
    adLink: "",
    videoToUpload: null,
    photoToUpload: null,
    selectedAppsByDate: [],
    Fromdate: "",
    Todate: "",
    registeredUsersTotalPrice: "",
    unRegisteredUsersTotalPrice: "",
    totalPrice: "",
    priceBeforeTax: "",
    discount: "",
    DiscountAmount: "",
    priceAfterDiscount: "",
    Tax: "",
    taxPriceAddition: "",
    priceAfterTaxTotal: "",
  });

  const getStatesHandler = async () => {
    try {
      let res = await StateServices.getStates();
      dispatch({ type: "setStates", payload: res.data.data });
    } catch (error) {
      return error;
    }
  };
  const handleCheckboxChange = useCallback((stateId) => {
    const updatedSelectedStates = state.selectedStates;
  
    if (updatedSelectedStates.includes(stateId)) {
      // If the stateId exists, filter it out
      dispatch({ 
        type: "setSelectedStates", 
        payload: updatedSelectedStates.filter((id) => id !== stateId) 
      });
    } else {
      // If the stateId doesn't exist, add it to the selectedStates
      dispatch({ 
        type: "setSelectedStates", 
        payload: [...updatedSelectedStates, stateId] 
      });
    }
  }, [state.selectedStates, dispatch]);
  const handleCheckboxAll = useCallback((states, isChecked) => {
    dispatch({ type: "setAllStatesSelected", payload: isChecked });
    if (isChecked) {
      const allStateIds = states.map((state) => state.stateId);
      dispatch({ type: "setSelectedStates", payload: allStateIds });

   
    } else {
      dispatch({ type: "setSelectedStates", payload: [] });
    }
  },[]);

  useEffect(() => {
    const formattedSelectedCities = state.selectedStates.map((stateId) => {
     
          return {
            stateId: parseInt(stateId),
            cityId: [],
          };
        
      })
     
    setAdData({ ...adData, states: formattedSelectedCities });
  }, [state.selectedStates]);



 
  function formatDate(inputDate) {
    const parts = inputDate.split("-");
    // return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return `${parts[1]}/${parts[2]}`;
  }

  function formatArrayOfObjects(arrayOfObjects) {
    const formattedArray = arrayOfObjects.map((obj) => {
      obj.dateRange = formatDate(obj.dateRange);
      return obj;
    });
    dispatch({ type: "setDateRangeHeader", payload: formattedArray });
  }

  const getAppDetailsList = async () => {
    let fromDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    let toDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const sanitizeStates = adData.states.map(item=>item.stateId)
    try {
      let res = await AdServices.getApplicationDetails({fromDate, toDate,stateList:sanitizeStates});
      if (res.data.status) {
        let data = res.data.data;
        dispatch({ type: "setAppList", payload: data });
        const dates = data.map((item) =>
          item.status.map((d) => ({ dateRange: d.date.split("T")[0] }))
        );
        formatArrayOfObjects(dates[0]);
      }
    } catch (error) {
      return error;
    }
  };

  const checkAdFormFilledHandler = () => {
    return adData.videoToUpload || adData.photoToUpload
        ? true
        : false
  };

  useEffect(() => {
    getStatesHandler();
  }, []);

  // useEffect(() => {
  //   getAppDetailsList();
  // }, []);

  useEffect(() => {
    if(adData.states.length>0){

        getAppDetailsList();
    }
  }, [adData.states])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Create Ad</h2>
        </div>
        <hr />
      </div>

      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <ul className="nav nav-pills navtab-bg nav-justified">
                <li style={{cursor:"pointer"}}
                  className="nav-item"
                  onClick={() =>
                    dispatch({ type: "setActiveTab", payload: "location" })
                  }
                >
                  <span
                    className={`nav-link  ${
                      state.activeTab === "location" ? "active" : ""
                    }`}
                  >
                    Location
                  </span>
                </li>
                <li style={{cursor: adData.states.length !== 0 ? "pointer":"not-allowed"}}
                  className="nav-item"
                  title={
                    adData.states.length === 0 ? "Select cities first." : ""
                  }
                  onClick={() =>
                    adData.states.length > 0 &&
                    dispatch({ type: "setActiveTab", payload: "ad-details" })
                  }
                >
                  <span
                    className={`nav-link  ${
                      state.activeTab === "ad-details" ? "active" : ""
                    }`}
                  >
                    Details
                  </span>
                </li>
                <li  style={{cursor: checkAdFormFilledHandler() ? "pointer":"not-allowed"}}
                  className="nav-item"
                  title={
                    checkAdFormFilledHandler() ? "" : "Provide ad details."
                  }
                  onClick={() =>
                    checkAdFormFilledHandler() &&
                    dispatch({ type: "setActiveTab", payload: "app-selection" })
                  }
                >
                  <span
                    className={`nav-link  ${
                      state.activeTab === "app-selection" ? "active" : ""
                    }`}
                  >
                    Applications
                  </span>
                </li>
              </ul>
              <div className="tab-content pt-0">
                {state.activeTab === "location" && (
                  <div className="show active" id="home1">
                    <Location
                      handleCheckboxChange={handleCheckboxChange}
                      handleCheckboxAll={handleCheckboxAll}
                      dispatch={dispatch}
                      state={state}
                    />
                  </div>
                )}

                {state.activeTab === "ad-details" && (
                  <div className="" id="profile1">
                    <div className="row">
                      <AdForm
                        setAdData={setAdData}
                        adData={adData}
                        dispatch={dispatch}
                        state={state}
                      />
                    </div>
                  </div>
                )}
                {state.activeTab === "app-selection" && (
                  <div className="" id="profile1">
                    <div className="row">
                      <AppSelectionForAd
                        setAdData={setAdData}
                        adData={adData}
                        state={state}
                        dispatch={dispatch}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAd;
