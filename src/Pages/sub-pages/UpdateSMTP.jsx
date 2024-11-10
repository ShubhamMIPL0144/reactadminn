import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import SMTPServices from "../../services/smtp-services";

const smtpSchema = Yup.object().shape({
  // app: Yup.object().shape({
  //     appId: Yup.string().required('Select App'),
  //   }),
  emailId: Yup.string().required("Enter e-mail").trim(),
  password: Yup.string().required("Please Enter Password").trim(),
  smtpServer: Yup.string().required("Please Enter Password").trim(),
});

const UpdateSMTP = () => {
  const [initialValues, setInitialValues] = useState({
    appId: "",
    emailId: "",
    password: "",
    smtpServer: "",
    smtpPort: 0,
    enableSSL: false,
  });

  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSendEmail, setLoadingSendEmail] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useApi(`/SettingSuperAdmin/GetSmtpDetailsById?Id=${id}`);
  const { data: appsList } = useApi("/SettingSuperAdmin/GetAllApplicationList");

  const formik = useFormik({
    initialValues,
    validationSchema: smtpSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const appDetail = appsList?.find(
        (app) => Number(app.value) === Number(data.data.appId)
      );
      let payload = {
        Id: id,
        appId: appDetail?.value,
        emailid: values.emailId,
        password: values.password,
        smtpserver: values.smtpServer,
        smtpport: values.smtpPort,
        enablessl: values.enableSSL,
      };

      try {
        let res = await SMTPServices.updateSMTP(payload);
        if (res.data.status) {
          toast.success(res.data.message);
          navigate(-1);
        } else {
          toast.error(res.data.message);
        }
        // resetForm();
      } catch (error) {
        return error;
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    },
  });
  const sendTestEmailHandler = async () => {
    if (testEmail.length === 0) {
      toast.warn("Enter Test Email!")
      return
    }
    setLoadingSendEmail(true)
    try {
      let res = await SMTPServices.sendTestEmail(testEmail, {});
      if (res.data.status) {
        toast.success(res.data.message);
        setTestEmail("")
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      return error;
    } finally {
      setTimeout(() => {

        setLoadingSendEmail(false)
      }, 3000);
    }
  };
  useEffect(() => {
    if (data) {
      const appDetail = appsList?.find(
        (app) => Number(app.value) === Number(data.data.appId)
      );
      setInitialValues({
        appId: appDetail?.value,
        emailId: data?.data.emailid,
        password: data?.data.password,
        smtpServer: data?.data.smtpserver,
        smtpPort: data?.data.smtpport,
        enableSSL: data?.data.enablessl,
      });
    }
  }, [data, appsList]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>SMTP Setting</h2>
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={formik.handleSubmit}>
                <input
                  type="hidden"
                  data-val="true"
                  data-val-required="The Id field is required."
                  id="Id"
                  name="Id"
                  value="6"
                />
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group mb-3">
                      <label> Apps </label>
                      <select
                        disabled
                        style={{ backgroundColor: '#d9d9d9' }}
                        {...formik.getFieldProps("app.appId")}
                        className={clsx(
                          "form-control form-control-solid form-select",
                          {
                            "is-invalid":
                              formik.touched.app?.appId &&
                              formik.errors.app?.appId,
                          },
                          {
                            "is-valid":
                              formik.touched.app?.appId &&
                              !formik.errors.app?.appId,
                          }
                        )}
                      >
                        <option selected>
                          {
                            appsList?.find(
                              (app) =>
                                Number(app.value) === Number(data?.data.appId)
                            )?.text
                          }
                        </option>
                      </select>

                      {formik.touched.app?.appId &&
                        formik.errors.app?.appId && (
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
                    <div className="form-group mb-3">
                      <label> Email ID </label>
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
                    <div className="form-group mb-3">
                      <label> Password </label>
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
                              formik.touched.password &&
                              !formik.errors.password,
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
                    <div className="form-group mb-3">
                      <label> Smtp-server </label>
                      <input
                        type="text"
                        {...formik.getFieldProps("smtpServer")}
                        className={clsx(
                          "form-control form-control-solid",
                          {
                            "is-invalid":
                              formik.touched.smtpServer &&
                              formik.errors.smtpServer,
                          },
                          {
                            "is-valid":
                              formik.touched.smtpServer &&
                              !formik.errors.smtpServer,
                          }
                        )}
                      />
                      {formik.touched.smtpServer &&
                        formik.errors.smtpServer && (
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
                    <div className="form-group mb-3">
                      <label>Smtp-port</label>
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
                              formik.touched.smtpPort &&
                              !formik.errors.smtpPort,
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
                    <div className="form-group mb-3">
                      <label>Enable SSL</label>
                      <br />
                      <input
                        type="checkbox"
                        {...formik.getFieldProps("enableSSL")}
                      />
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
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <button
                      type="submit"
                      className="crete-btn"
                      disabled={loading}
                    >
                      Save
                    </button>
                  </div>
                </div>
                {/* <input name="__RequestVerificationToken" type="hidden"/><input name="Enablessl" type="hidden" value="false"/> */}
              </form>
            </div>
            {/* <div className="col-md-3">
              <form method="post" action="/Setting/EmailTest/6">
                <div className="row">
                  <div className="col-md-12">
                    <div className="alert alert-info">
                      Test Email Will be sent on <strong> halef </strong> .
                    </div>
                    <input
                      type="submit"
                      value="Send Test Email"
                      className="btn btn-danger"
                    />
                  </div>
                </div>
                <input name="__RequestVerificationToken" type="hidden" />
              </form>
            </div> */}
          </div>
          <hr />

          <div className="row">
            <div className="col-md-3">
              <div className="form-group mb-3">
                <label> Test Email </label>
                <input
                  className="form-control form-control-solid"
                  type="email"
                  name="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2 d-flex align-items-center mb-1">
              <button
                type="button"
                className="btn btn-danger"
                onClick={sendTestEmailHandler}
                disabled={loadingSendEmail}
              >
                {
                  loadingSendEmail ? "Loading..." : "Send Test Email"
                }

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSMTP;
