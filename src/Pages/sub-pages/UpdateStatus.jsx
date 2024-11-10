import React, { useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import StatusServices from "../../services/status-services";
import { useLocation, useNavigate } from "react-router-dom";

const statusSchema = Yup.object().shape({
  statusName: Yup.string().required("Status is required").trim(),
  priority: Yup.string().required("Priority is required").trim(),
});


const UpdateStatus = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const {id,status,priority} = location?.state
  const formik = useFormik({
    initialValues:{
      id:id||"",
      statusName: status||"",
      priority: priority||"",
    },
    validationSchema: statusSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
    

      try {
        let res = await StatusServices.updateAppStatus({...values,priority:Number(priority)});
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          navigate(-1)
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>Update Apps Status</h2>
        </div>
        <hr />
      </div>

        <div className="row mb-3">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-md-4">
                <div className="mb-3">
                  <label
                    htmlFor="simpleinput"
                    className="form-label"
                  >
                    Status
                  </label>
                  <input
                    type="text"
                    {...formik.getFieldProps("statusName")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.statusName &&
                          formik.errors.statusName,
                      },
                      {
                        "is-valid":
                          formik.touched.statusName &&
                          !formik.errors.statusName,
                      }
                    )}
                  />
                  {formik.touched.statusName &&
                    formik.errors.statusName && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span
                            role="alert"
                            className="text-danger"
                          >
                            {formik.errors.statusName}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="col-md-4">
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
              </div>
            </div>

            <button
              className="crete-btn"
              type="submit"
              disabled={loading}
            >
              Update
            </button>
          </form>
        </div>
        
    
       </div>
)};

export default UpdateStatus;
