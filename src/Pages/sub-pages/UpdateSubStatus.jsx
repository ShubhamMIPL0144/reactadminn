import React, { useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import StatusServices from "../../services/status-services";
import { useLocation, useNavigate } from "react-router-dom";

const schema = Yup.object().shape({

  checklist: Yup.string().required("Checklist is required").trim(),
});

const UpdateSubStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { id, subStatus,isActive,priority } = location?.state;
  const formik = useFormik({
    initialValues: {
     
      isActive: isActive || "",
      checklist: subStatus || "",
    },
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      let payload = {
        id,
        subStatusName: values.checklist,
        priority:`${priority}`,
      };

      try {
        let res = await StatusServices.updateAppSubStatus(payload);
        if (res.data.status) {
          // toast.success(res.data.message);
          toast.success("Successfully updated!");
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
          <h2>Update Checklist</h2>
        </div>
        <hr />
      </div>

      <div className="row mb-3">
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
           

            <div className="col-md-4">
              <div className="mb-3">
                <label htmlFor="example-textarea" className="form-label">
                  Checklist
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps("checklist")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.checklist && formik.errors.checklist,
                    },
                    {
                      "is-valid":
                        formik.touched.checklist && !formik.errors.checklist,
                    }
                  )}
                />
                {formik.touched.checklist && formik.errors.checklist && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.checklist}
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

export default UpdateSubStatus;
