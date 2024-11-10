import React from "react";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import clsx from "clsx";
import UserAuth from "../services/user-auth";
import { setCurrentUser } from "../store/authSlice";
import { useDispatch } from "react-redux";
import OTPVerification from "../components/Modals/OTPVerification";

const Schema = Yup.object().shape({
  username: Yup.string().required("Enter username").trim(),
  password: Yup.string().required("Please Enter Password").trim(),

});
const initialValues = {
    username: "",
    password: "",
  };
const LoginPage = () => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [otp, setOtp] = useState({loading:false,otpCode:""});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const openVerificationModal = () => setShowVerificationModal(true);
  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setOtp({...otp,otpCode:""});
  };
  

    const dispatch = useDispatch()
    const navigate = useNavigate()


    const verifyCodeHandler = async () => {

      if (otp.otpCode.length !== 4) {
        toast.warn("OTP fields must not be empty!");
        return;
      }
      setOtp({...otp,loading:true});
      const data = {
        otp:otp.otpCode,
        password: userData.password,
        userName: userData.username,
      };
      try {
        let res = await UserAuth.login(data);
        const status = res.data.status;
        if (status === true) {
           dispatch(setCurrentUser(res.data))
              toast.success("Login Success!");
              navigate("/apps")
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        return error;
      } finally {
        setOtp({...otp,loading:false});
      }
    };
  


    const formik = useFormik({
        initialValues,
        validationSchema: Schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
          setLoading(true)
          const data = {
            email: values.username,
            password: values.password,
            otptype: "Signin",
            usertype: "admin",
          };
    
          try {
            let res = await UserAuth.sendOtp(data);
             if (res.data.status) {
              toast.success(
                "Verification code has been sent to your email!"
              );
              openVerificationModal();
              setUserData({username:values.username,password:values.password});
                // dispatch(setCurrentUser(res.data))
              // toast.success("Login Success!");
              // navigate("/apps")
            } else {
              toast.error("Invalid Email / Password");
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
    <>
    <div className="account-pages my-5">
    <div className="container" style={{display:"inherit"}}>

        <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xl-4">
                <div className="text-center">   
                    <a href="index.html">
                        <img src="assets/images/logo-dark.png" alt="" height="22" className="mx-auto"/>
                    </a>
                    <h3 className="text-muted mt-2 mb-4">Lusgo media platform</h3>

                </div>
                <div className="card">
                    <div className="card-body p-4">
                        
                        <div className="text-center mb-4">
                            <h4 className="text-uppercase mt-0">Sign In</h4>
                        </div>

                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="emailaddress" className="form-label">Enter Username / Email address</label>
                                <input type="text" id="example-email" name="example-email"
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
                                    )}/>
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

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
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

                            {/* <div className="mb-3">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="checkbox-signin" checked />
                                    <label className="form-check-label" htmlFor="checkbox-signin">Remember me</label>
                                </div>
                            </div> */}

                            <div className="mb-3 d-grid text-center">
                                <button  className="btn btn-primary" type="submit" disabled={loading}>{loading?"Loading...":"Log In"}</button>
                            </div>
                        </form>

                    </div>
                </div>

                {/* <div className="row mt-3">
                    <div className="col-12 text-center">
                        <p> <a href="pages-recoverpw.html" className="text-muted ms-1"><i className="fa fa-lock me-1"></i>Forgot your password?</a></p>
                        <p className="text-muted">Don't have an account? <a href="pages-register.html" className="text-dark ms-1"><b>Sign Up</b></a></p>
                    </div>
                </div> */}

            </div> 
        </div>
      
    </div>
</div>

<OTPVerification
        title="Two-Factor Authentication (2FA)"
        description="Enter your verification code."
        otp={otp}
        setOtp={setOtp}
        showVerificationModal={showVerificationModal}
        closeVerificationModal={closeVerificationModal}
        verifyCodeHandler={verifyCodeHandler}
        loadingOtp={otp.loading}
      />
</>
  );
};

export default LoginPage;
