import React from "react";
import { useNavigate } from "react-router-dom";
import SMSTable from "../components/Tables/SMSTable";
import useApi from "../hooks/useApi";
import Loader from "../common/Loader";

const Sms = () => {
  const { data, loading } = useApi("/SettingSuperAdmin/GetAllSMSSetting");
  const navigate = useNavigate();
  const handelNavigate = () => {
    navigate("/sms/create", { state: data });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>SMS Setting</h2>
        </div>
        <hr />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="row">
            <div className="col-md-12">
              <button
                onClick={() => !loading && handelNavigate()}
                className="btn btn-app mb-2"
              >
                {!loading ? "+Create new" : "Loading..."}
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <SMSTable tableData={data} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sms;
