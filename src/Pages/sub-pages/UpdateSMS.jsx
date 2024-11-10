import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useApi from "../../hooks/useApi";
import clsx from "clsx";
import * as Yup from "yup";
import SMSServices from "../../services/sms-services";
import {useParams } from "react-router-dom";

const updateSmsSchema = Yup.object().shape({
 
  userName: Yup.string().required("Enter username").trim(),
  password: Yup.string().required("Please Enter Password").trim(),
  url: Yup.string().required("Please Enter URL").trim(),
  countryCode: Yup.string().trim(),
});

const UpdateSMS = () => {
 
  const [loading, setLoading] = useState(false)
  const [initialValues, setInitialValues] = useState({});
  const { id } = useParams();
  const { data } = useApi(`/SettingSuperAdmin/GetSmsDetailsById?Id=${id}`);
  const { data: appsList } = useApi("/SettingSuperAdmin/GetAllApplicationList");

  const formik = useFormik({
    initialValues,
    validationSchema: updateSmsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true)
      const appDetail = appsList?.find(
        (app) => Number(app.value) === Number(data.data.appId)
      );
      let payload = {
        Id: id,
        appId: appDetail?.value,
        username: values.userName,
        password: values.password,
        url: values.url,
        maintitle: "",
        maincontent: "",
        countrycode: values.countryCode,
      };

      try {
        let res = await SMSServices.updateSMS(payload);
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
  useEffect(() => {
    if (data) {
      const appDetail = appsList?.find(
        (app) => Number(app.value) === Number(data.data.appId)
      );
      setInitialValues({
        appId: appDetail?.value,
        id: data.id,
        userName: data.data.username,
        password: data.data.password,
        url: data.data.url,
        countryCode: "+46",
      });
    }
  }, [data, appsList]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="app-head">
          <h2>SMS Setting</h2>
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
                id="example-select"
                disabled
                style={{backgroundColor:'#d9d9d9'}}
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
                <option selected>
                  {
                    appsList?.find(
                      (app) => Number(app.value) === Number(data?.data.appId)
                    )?.text
                  }
                </option>
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="example-textarea" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="example-email"
                name="example-email"
                {...formik.getFieldProps("userName")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.userName && formik.errors.userName,
                  },
                  {
                    "is-valid":
                      formik.touched.userName && !formik.errors.userName,
                  }
                )}
              />
              {formik.touched.userName && formik.errors.userName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.userName}
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
                id="example-number"
                type="password"
                name="password"
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
                Url
              </label>
              <input
                type="text"
                id="simpleinput"
                {...formik.getFieldProps("url")}
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid": formik.touched.url && formik.errors.url,
                  },
                  {
                    "is-valid": formik.touched.url && !formik.errors.url,
                  }
                )}
              />
              {formik.touched.url && formik.errors.url && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert" className="text-danger">
                      {formik.errors.url}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="simpleinput" className="form-label">
                Country Code
              </label>
              <select
                className="form-select"
                id="example-select"
                {...formik.getFieldProps("countryCode")}
              >
                <option defaultValue="+46">+46</option>
              </select>
            </div>
            {formik.touched.countryCode && formik.errors.countryCode && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert" className="text-danger">
                    {formik.errors.countryCode}
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

export default UpdateSMS;
