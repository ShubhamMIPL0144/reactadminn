import React, { useEffect, useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";

import StateServices from "../../services/states-services";
import StatesTable from "../../components/Tables/StatesTable";

const stateSchema = Yup.object().shape({
  state: Yup.string().required("State is required").trim(),
});


const CreateStates = () => {
  const [loading, setLoading] = useState(false);
  const [apiLoad, setApiLoad] = useState(false);
  const [data, setData] = useState([])
  
  const getStates=async()=>{
    setApiLoad(true)
    try {
      let res = await StateServices.getStates()
      setData(res.data.data);
    } catch (error) {
      return error
    }finally{
      setApiLoad(false)
    }
  }  


  const formik = useFormik({
    initialValues:{
      state: "",
    },
    validationSchema: stateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
  
      try {
        let res = await StateServices.createState(values);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          getStates()
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
    getStates()
  }, [])
  

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
                  <label
                    htmlFor="simpleinput"
                    className="form-label"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("state")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.state &&
                          formik.errors.state,
                      },
                      {
                        "is-valid":
                          formik.touched.state &&
                          !formik.errors.state,
                      }
                    )}
                  />
                  {formik.touched.state &&
                    formik.errors.state && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span
                            role="alert"
                            className="text-danger"
                          >
                            {formik.errors.state}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              {/* <div className="col-md-4">
                <div className="mb-3">
                  <label
                    htmlFor="example-textarea"
                    className="form-label"
                  >
                    Priority
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    {...formik.getFieldProps("priority")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.priority &&
                          formik.errors.priority,
                      },
                      {
                        "is-valid":
                          formik.touched.priority &&
                          !formik.errors.priority,
                      }
                    )}
                  />
                  {formik.touched.priority &&
                    formik.errors.priority && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span
                            role="alert"
                            className="text-danger"
                          >
                            {formik.errors.priority}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div> */}
            </div>

            <button
              className="crete-btn"
              type="submit"
              disabled={loading}
            >
              Add
            </button>
          </form>
        </div>
        <hr />

        <div className="row">
          <StatesTable tableData={data} />
        </div>
      </>
    )}
    </>
    
)};

export default CreateStates;
