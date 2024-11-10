import React, { useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import StateServices from "../../services/states-services";

const stateSchema = Yup.object().shape({
  state: Yup.string().required("state is required").trim(),
});


const UpdateState = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const { id, state } = location?.state
  const formik = useFormik({
    initialValues: {
      id: id || "",
      state: state || "",
    },
    validationSchema: stateSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);


      try {
        let res = await StateServices.updateState(values);
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
          <h2>Update State</h2>
        </div>
        <hr />
      </div>

      <div className="row mb-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-6">
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
            <div className="col-md-6">
              <button
                className="crete-btn mt-3"
                type="submit"
                disabled={loading}
              >
                Update
              </button>
            </div>


          </div>


        </form>
      </div>


    </div>
  )
};

export default UpdateState;
