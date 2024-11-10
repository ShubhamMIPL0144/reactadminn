import React from 'react'
import * as Yup from "yup";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import SMSServices from '../../services/sms-services';
import useApi from '../../hooks/useApi';
import { useState } from 'react';

const smsSchema = Yup.object().shape({
    app: Yup.object().shape({
        appId: Yup.string().required('Select App'),
        }),
  userName: Yup.string().required("Enter username").trim(),
  password: Yup.string().required("Please Enter Password").trim(),
  url: Yup.string().required("Please Enter URL").trim(),
  countryCode: Yup.string().trim(),
});
const initialValues = {
    app:{appId:undefined,appName:""},
    userName: "",
    password: "",
    url: "",
    countryCode:"+46"
  };
const CreateSMS = () => {
  const {data:appsList} = useApi("/SettingSuperAdmin/GetAllApplicationList")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
    const formik = useFormik({
        initialValues,
        validationSchema: smsSchema,
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
          setLoading(true)
          const appDetails = JSON.parse(values.app.appId)
          let payload = {
            appId: appDetails.appId,
            username: values.userName,
            password: values.password,
            url: values.url,
            countrycode: values.countryCode,
          
          }
          
          try {
            let res = await SMSServices.createSMS(payload);
             if (res.data.status) {
              toast.success(res.data.message);
              resetForm();
              navigate(-1)
            } else {
              toast.error(res.data.message);
            }
            // resetForm();
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
        <div className="container-fluid">
                    <div className="row">
                        <div className="app-head">
                            <h2>SMS Setting</h2>
                        </div>
                        <hr/>
                    </div>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row">
    
    
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label htmlFor="simpleinput" className="form-label">Apps</label>
                                    <select  id="example-select" 
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
                                     )}>
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
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="mb-3">
                                    <label htmlFor="example-textarea" className="form-label">Username</label>
                                    <input type="text" id="example-email" name="example-email"
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
                                    )}/>
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
                                    <label htmlFor="example-textarea" className="form-label">Password</label>
                                    <input  id="example-number" type="password" name="password"
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
                                      )}/>
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
                                    <label htmlFor="simpleinput" className="form-label">Url</label>
                                    <input type="text" id="simpleinput"
                                     {...formik.getFieldProps("url")}
                                     className={clsx(
                                       "form-control form-control-solid",
                                       {
                                         "is-invalid":
                                           formik.touched.url && formik.errors.url,
                                       },
                                       {
                                         "is-valid":
                                           formik.touched.url && !formik.errors.url,
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
                                    <label htmlFor="simpleinput" className="form-label">Country Code</label>
                                    <select className="form-select" id="example-select"
                                       {...formik.getFieldProps("countryCode")}
                                       >
                                        <option defaultValue='+46' selected>+46</option>
                                        
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
    
                    <button className="crete-btn" type="submit"disabled={loading}>Save</button>
                    </form>
    
    
    
    
    
    
    
                </div>

  )
}

export default CreateSMS