import React from "react";
import { Link } from "react-router-dom";
import AppsTable from "../components/Tables/AppsTable";
import useApi from "../hooks/useApi";
import Loader from "../common/Loader";

const Apps = () => {

  const { data, loading } = useApi("/ApplicationSuperAdmin/GetAllApplicationList")

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Apps</h2>
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-md-12">
          <Link to="/apps/create" className="btn btn-app mb-2">
            +Create new
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {
            loading ? <Loader /> :
              <AppsTable tableData={data} />
          }
        </div>
      </div>
    </div>
  );
};

export default Apps;
