import React, { useState } from "react";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import SMTPServices from "../../services/smtp-services";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const smtpSchema = Yup.object().shape({
  app: Yup.object().shape({
    appId: Yup.string().required("Select App"),
  }),
  emailId: Yup.string().required("Enter e-mail").trim(),
  password: Yup.string().required("Please Enter Password").trim(),
  smtpServer: Yup.string().required("Please Enter Password").trim(),
});

const initialValues = {
  app: { appId: undefined, appName: "" },
  emailId: "",
  password: "",
  smtpServer: "",
  smtpPort: 0,
  enableSSL: false,
};
const CreateSMTP = () => {
  const [loading, setLoading] = useState(false);
  const {data:appsList} = useApi("/SettingSuperAdmin/GetAllApplicationList")
  const navigate = useNavigate()
  const formik = useFormik({
    initialValues,
    validationSchema: smtpSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const appDetails = JSON.parse(values.app.appId);
      let payload = {
        appId: appDetails.appId,
        emailid: values.emailId,
        password: values.password,
        smtpserver: values.smtpServer,
        smtpport: values.smtpPort,
        enablessl: values.enableSSL,
      };

      try {
        let res = await SMTPServices.createSMTP(payload);
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
          <h2>SMTP Setting</h2>
        </div>
        <hr />
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="simpleinput" className="form-label">
                Apps
              </label>
              <select
                {...formik.getFieldProps("app.appId")}
                className={clsx(
                  "form-control form-control-solid form-select",
                  {
                    "is-invalid":
                      formik.touched.app?.appId && formik.errors.app?.appId,
                  },
                  {
                    "is-valid":
                      formik.touched.app?.appId && !formik.errors.app?.appId,
                  }
                )}
              >
                {appsList?.map((appData) => (
                  <option
                    key={appData.value}
                    value={JSON.stringify({
                      appId: appData.value,
                      appName: appData.text,
                    })}
                  >
                    {appData.text}
                  </option>
                ))}
              </select>

              {formik.touched.app?.appId && formik.errors.app?.appId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.app?.appId}
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
                {...formik.getFieldProps("emailId")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.emailId && formik.errors.emailId,
                  },
                  {
                    "is-valid":
                      formik.touched.emailId && !formik.errors.emailId,
                  }
                )}
              />
              {formik.touched.emailId && formik.errors.emailId && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.emailId}
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
                    "is-valid":
                      formik.touched.password && !formik.errors.password,
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
              <label htmlFor="simpleinput" className="form-label">
                Smtp-server
              </label>
              <input
                type="text"
                {...formik.getFieldProps("smtpServer")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.smtpServer && formik.errors.smtpServer,
                  },
                  {
                    "is-valid":
                      formik.touched.smtpServer && !formik.errors.smtpServer,
                  }
                )}
              />
              {formik.touched.smtpServer && formik.errors.smtpServer && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.smtpServer}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="example-textarea" className="form-label">
                Smtp-port
              </label>
              <input
                type="number"
                autoComplete="off"
                {...formik.getFieldProps("smtpPort")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.smtpPort && formik.errors.smtpPort,
                  },
                  {
                    "is-valid":
                      formik.touched.smtpPort && !formik.errors.smtpPort,
                  }
                )}
              />
              {formik.touched.smtpPort && formik.errors.smtpPort && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.smtpPort}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="">
              <label htmlFor="example-textarea" className="form-label">
                Enable SSL
              </label>
            </div>
            <input type="checkbox" {...formik.getFieldProps("enableSSL")} />
            {formik.touched.enableSSL && formik.errors.enableSSL && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.enableSSL}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <button className="crete-btn" type="submit" disabled={loading}>
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateSMTP;
