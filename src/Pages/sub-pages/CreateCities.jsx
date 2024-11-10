import React, { useEffect, useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";
import StateServices from "../../services/states-services";
import CitiesTable from "../../components/Tables/CitiesTable";

const schema = Yup.object().shape({
  stateId: Yup.string().required("Select State"),
  city: Yup.string().required("City is required").trim(),
});

const CreateCities = () => {
  const [loading, setLoading] = useState(false);
  const [apiLoad, setApiLoad] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const getStates = async () => {
    setApiLoad(true);
    try {
      let res = await StateServices.getStates();
      setData(res.data.data);
    } catch (error) {
      return error;
    } finally {
      setApiLoad(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      states: { stateId: undefined, stateName: "" },
      city: "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let payload = {
        cityName: values.city,
        stateId: values.stateId,
      };

      try {
        let res = await StateServices.createCity(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          getStates();
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

  const handleChange = (e) => {
    const stateId = e.target.value;
    const filteredList = data?.find(
      (item) => item.stateId === Number(stateId) && item
    );
    if(filteredList){

      setFilteredData(filteredList);
    }
  };

  useEffect(() => {
    const filteredList = data?.find(
      (item) => item.stateId === 1 && item
    );
    if(filteredList){
      setFilteredData(filteredList);
    }
  }, [data]);

  useEffect(() => {
    getStates();
  }, []);

  return (
    <>
      {apiLoad ? (
        <Loader />
      ) : (
        <>
          <div className="row mb-3">
            <form onSubmit={formik.handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="simpleinput" className="form-label">
                      States
                    </label>
                    <select
                      {...formik.getFieldProps("stateId")}
                      className={clsx(
                        "form-control form-control-solid form-select",
                        {
                          "is-invalid":
                            formik.touched.stateId && formik.errors.stateId,
                        },
                        {
                          "is-valid":
                            formik.touched.stateId && !formik.errors.stateId,
                        }
                      )}
                    >
                      <option value="">Select State</option>
                      {data?.map((item) => (
                        <option key={item.stateId} value={item.stateId}>
                          {item.stateName}
                        </option>
                      ))}
                    </select>
                    {formik.touched.stateId && formik.errors.stateId && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert" className="text-danger">
                            {formik.errors.stateId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="example-textarea" className="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      {...formik.getFieldProps("city")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.city && formik.errors.city,
                        },
                        {
                          "is-valid":
                            formik.touched.city && !formik.errors.city,
                        }
                      )}
                    />
                    {formik.touched.city && formik.errors.city && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert" className="text-danger">
                            {formik.errors.city}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button className="crete-btn" type="submit" disabled={loading}>
                Add
              </button>
            </form>
          </div>
          <hr />

          <div className="row my-2">
            <div className="col-md-4">
              <select
                className="form-control form-control-solid form-select"
                onChange={(e) => handleChange(e)}
              >
                {data?.map((item) => (
                  <option key={item.stateId} value={item.stateId}>
                    {item.stateName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row">
            <CitiesTable tableData={filteredData} />
          </div>
        </>
      )}
    </>
  );
};

export default CreateCities;
