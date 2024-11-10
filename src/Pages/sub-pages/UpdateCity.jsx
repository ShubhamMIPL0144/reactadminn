import React, { useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import { useLocation, useNavigate } from "react-router-dom";
import StateServices from "../../services/states-services";

const schema = Yup.object().shape({
  stateId: Yup.string().required("Select Status"),
  city: Yup.string().required("City is required").trim(),
});

const UpdateCity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { data: stateData } = useApi("/GetStateListCity");
  const { id, stateId, cityName } = location?.state;
  const formik = useFormik({
    initialValues: {
      stateId: stateId || "",
      city: cityName || "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let payload = {
        Id: id.toString(),
        stateId: values.stateId,
        cityName: values.city,
      };

      try {
        let res = await StateServices.updateCity(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
          navigate(-1);
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
          <h2>Update City</h2>
        </div>
        <hr />
      </div>

      <div className="row mb-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="simpleinput" className="form-label">
                  State
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
                  {/* <option value={stateId}>Select State</option> */}
                  {stateData?.data?.map((item) => (
                    <option key={item.stateId} value={item.stateId}>
                      {item.stateName}
                    </option>
                  ))}
                </select>
                {formik.touched.status?.stateId &&
                  formik.errors.status?.stateId && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert" className="text-danger">
                          {formik.errors.status?.stateId}
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
                      "is-invalid": formik.touched.city && formik.errors.city,
                    },
                    {
                      "is-valid": formik.touched.city && !formik.errors.city,
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
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCity;
