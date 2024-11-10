

import http from "./http-common.js";


   const createSMS  = (data) =>
  http.post(
    `/SettingSuperAdmin/AddSMsSetting`,data
  ); 
   const updateSMS  = (data) =>
  http.post(
    `/SettingSuperAdmin/UpdateSmsSettings`,data
  ); 



  const SMSServices = {
    createSMS,updateSMS
  };
  
  export default SMSServices;
  
