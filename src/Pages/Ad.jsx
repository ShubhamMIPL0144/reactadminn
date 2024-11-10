import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdTable from "../components/Tables/AdTable";
import ReactSelect from "../components/Select/ReactSelectWithGroup";
import AdServices from "../services/ad-services";

const Ad = () => {
  const [selectedOptions, setSelectedOptions] = useState({ value: "all_ads", label: "All Ads" });
  const [currentList, setCurrentList] = useState([])

  const getAdCreators = async () => {
    try {
      let res = await AdServices.getAdCreatorList()
      if (res.status) {
        setCurrentList(res.data.data)
      }
    } catch (error) {
      return error
    }
  }
  useEffect(() => {
    getAdCreators()
  }, [])

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Ad</h2>
        </div>
        <hr />
      </div>
      <div className="row">

      </div>
      <div className="row">
        <div className="col-12 row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="simpleinput" className="form-label">
                Select Ad List
              </label>
              <ReactSelect
                setSelectedOption={setSelectedOptions}
                options={currentList?.map((opt) => ({
                  label: opt.name,
                  value: opt.id,
                }))}
              />
            </div>
          </div>
          <div className="col-md-6  ">
          </div>
          <div className="col-md-2 mt-3 text-end ">
            <Link className="btn btn-app mb-3" to="create">
              +Create Ad
            </Link>
          </div>

          <AdTable selectedOptions={selectedOptions} />
        </div>
      </div>
    </div>
  );
};

export default Ad;
