

import http from "./http-common.js";

  const login  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/Login`,data
  );

const changePassword  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/ProfileSettings`,data
  );

  
  const sendOtp = (data) =>
    http.post(`/ApplicationSuperAdmin/SendOtpOnMail`,data)
   

  
  const UserAuth = {
    login,changePassword,sendOtp
  };
  
  export default UserAuth;
  
