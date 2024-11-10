import React from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import ApplicationServices from "../../services/application-service";
import { toast } from "react-toastify";

const appSchema = Yup.object().shape({
  username: Yup.string().required("Please Enter Username").trim(),
  firstName: Yup.string().required("Please Enter First Name").trim(),
  lastName: Yup.string().required("Please Enter Last Name").trim(),
  // email: Yup.string()
  //   .email("Invalid email address")
  //   .required("Please Enter E-mail")
  //   .trim(),
  contact: Yup.string().required("Please Enter Phone Number").trim(),
  password: Yup.string().required("Please Enter Password").trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const AdminInfoForm = ({setLoading,loading, appDetails }) => {
  const { id } = useParams();
  const formik = useFormik({
    initialValues: {
      username: appDetails?.username || "",
      firstName: appDetails?.firstname || "",
      lastName: appDetails?.lastname || "",
      email: appDetails?.email || "",
      contact: appDetails?.telephone || "",
      password: appDetails?.password || "",
      confirmPassword: appDetails?.confirmPassword || "",
    },
    validationSchema: appSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true)
      let payload = {
        id,
        username: values.username,
        password: values.password,
        // confirmPassword: values.confirmPassword,
        firstname: values.firstName,
        // lastname: values.lastName,
        // email: values.email, 
        telephone: values.contact,
      };
      try {
        let res = await ApplicationServices.updateAdminDetails(payload);
        if (res.data.status) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      }finally{
        setTimeout(() => {
          setLoading(false)
        }, 3000);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              Username
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("username")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.username && formik.errors.username,
                },
                {
                  "is-valid":
                    formik.touched.username && !formik.errors.username,
                }
              )}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.username}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              First Name
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("firstName")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.firstName && formik.errors.firstName,
                },
                {
                  "is-valid":
                    formik.touched.firstName && !formik.errors.firstName,
                }
              )}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.firstName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="simpleinput" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("lastName")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.lastName && formik.errors.lastName,
                },
                {
                  "is-valid":
                    formik.touched.lastName && !formik.errors.lastName,
                }
              )}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.lastName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              E-mail
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid": formik.touched.email && formik.errors.email,
                },
                {
                  "is-valid": formik.touched.email && !formik.errors.email,
                }
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("contact")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid": formik.touched.contact && formik.errors.contact,
                },
                {
                  "is-valid": formik.touched.contact && !formik.errors.contact,
                }
              )}
            />
            {formik.touched.contact && formik.errors.contact && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.contact}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Password
            </label>
            <input
              type="password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                },
                {
                  "is-valid": formik.touched.title && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.password}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-4">
          <div className="mb-3">
            <label htmlFor="example-textarea" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              autoComplete="off"
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
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <button className="crete-btn rounded my-2" type="submit" disabled={loading}>Update</button>
      </div>
    </form>
  );
};

export default AdminInfoForm;
