import React, { useState } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import clsx from "clsx";
import UserAuth from "../services/user-auth";

const Schema = Yup.object().shape({
  oldPassword: Yup.string().required("Please Enter Old Password").trim(),
  newPassword: Yup.string().required("Please Enter New Password").trim(),
  confirmPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Confirm password must match with new password").required("Please Enter Confirm Password").trim(),
});
const initialValues = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",

};

const ChangeconfirmPassword = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useSelector((state) => state.auth);
  const { email } = auth?.data
  const formik = useFormik({
    initialValues,
    validationSchema: Schema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      values.email = email
      setLoading(true);
      try {
        let res = await UserAuth.changePassword(values);
        if (res.data.status) {
          toast.success(res.data.message);
          resetForm();
        } else {
          toast.success(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    },
  });
  return (
    <div className="container-fluid">
      <div className="row mx-2">
        <div className="app-head">
          <h2>Change Password</h2>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-6 b_c_d">
            <form
              onSubmit={formik.handleSubmit}
            >
              <span>
                <strong >
                  E-mail : {email}
                </strong>
              </span>
              <div
                className="validation-summary-valid"
                data-valmsg-summary="true"
              >
                <ul>
                  <li style={{ display: "none" }}></li>
                </ul>
              </div>
              <div className="form-group mb-2">
                <label> Old Password</label>
                <input
                  id="example-number"
                  type="password"
                  name="oldPassword"
                  {...formik.getFieldProps("oldPassword")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.oldPassword && formik.errors.oldPassword,
                    },
                    {
                      "is-valid":
                        formik.touched.oldPassword &&
                        !formik.errors.oldPassword,
                    }
                  )}
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.oldPassword}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group mb-2">
                <label>New Password</label>
                <input
                  id="example-number"
                  type="password"
                  name="newPassword"
                  {...formik.getFieldProps("newPassword")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.newPassword && formik.errors.newPassword,
                    },
                    {
                      "is-valid":
                        formik.touched.newPassword &&
                        !formik.errors.newPassword,
                    }
                  )}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert" className="text-danger">
                        {formik.errors.newPassword}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group mb-3">
                <label> Confirm Password</label>
                <input
                  id="example-number"
                  type="password"
                  name="confirmPassword"
                  {...formik.getFieldProps("confirmPassword")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.confirmPassword &&
                        formik.errors.confirmPassword,
                    },
                    {
                      "is-valid":
                        formik.touched.confirmPassword &&
                        !formik.errors.confirmPassword,
                    }
                  )}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert" className="text-danger">
                          {formik.errors.confirmPassword}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              <button
                className="btn crete-btn btn-primary btn-lg chg-pass"
                type="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Save "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeconfirmPassword;
