import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import TaxServices from "../services/tax-services";
import TaxTable from "../components/Tables/TaxTable";

const schema = Yup.object().shape({
  countryId: Yup.string().required("Select country"),
  desc: Yup.string().required("Tax type is required").trim(),
  value: Yup.string().matches(/^\d+%$/, 'Invalid percentage format').required("Value is required").trim(),
});

const TaxManagement = () => {
  const [loading, setLoading] = useState(false);
  const [apiLoad, setApiLoad] = useState(false);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);

  const getTaxHandler = async () => {
    setApiLoad(true);
    try {
      let res = await TaxServices.getTax();
      if(res.data.data){
        setData(res.data.data);
        
      }
    } catch (error) {
      return error;
    } finally {
      setApiLoad(false);
    }
  };

  const getCountryHandler = async () => {
    setApiLoad(true);
    try {
      let res = await TaxServices.getCountry();
      setCountries(res.data.data);
    } catch (error) {
      return error;
    } finally {
      setApiLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      countryId:"",
      desc: "",
      value: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const payload = {
        Id: 0,
        Desc: values.desc,
        Value: values.value,
        CountryId:values.countryId,
      };
      try {
        let res = await TaxServices.createTax(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          getTaxHandler();
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    getTaxHandler();
    getCountryHandler();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Tax Management for Ad Creation</h2>
        </div>
        <hr />
      </div>

      {/* <div className="row mb-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
        
          <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="simpleinput" className="form-label">
                      Country
                    </label>
                    <select
                      {...formik.getFieldProps("countryId")}
                      className={clsx(
                        "form-control form-control-solid form-select",
                        {
                          "is-invalid":
                            formik.touched.countryId && formik.errors.countryId,
                        },
                        {
                          "is-valid":
                            formik.touched.countryId && !formik.errors.countryId,
                        }
                      )}
                    >
                      <option value="">Select Country</option>
                      {countries?.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.countryName}
                        </option>
                      ))}
                    </select>
                    {formik.touched.countryId && formik.errors.countryId && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert" className="text-danger">
                            {formik.errors.countryId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                  Tax Type
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("desc")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.desc && formik.errors.desc,
                    },
                    {
                      "is-valid":
                        formik.touched.desc && !formik.errors.desc,
                    }
                  )}
                />
                {formik.touched.desc && formik.errors.desc && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.desc}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Value in Percentage {"%"}</label>
                <input
                  type="text"
                  {...formik.getFieldProps("value")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.value && formik.errors.value,
                    },
                    {
                      "is-valid":
                        formik.touched.value && !formik.errors.value,
                    }
                  )}
                />
                {formik.touched.value && formik.errors.value && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.value}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="crete-btn" type="submit" disabled={loading}>
           
          + Add
          </button>
        </form>
      </div>
      <hr /> */}

      {apiLoad ? (
      <Loader />
    ) : ( 
       <div className="row">
        <TaxTable tableData={data} />
      </div>
      )}
    </div>
  );
};

export default TaxManagement;
