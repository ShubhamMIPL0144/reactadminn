

import http from "./http-common.js";

  

   const createSMTP  = (data) =>
  http.post(
    `/SettingSuperAdmin/AddSMTPSetting`,data
  );    
  
  const updateSMTP  = (data) =>
  http.post(
    `/SettingSuperAdmin/UpdateSmtpSettings`,data
  ); 

  const sendTestEmail  = (testEmail,data) =>
  http.post(
    `/SendTestMail?Email=${testEmail}&AppCode=SOKU`,data
  ); 



  const SMTPServices = {
    createSMTP,updateSMTP,sendTestEmail
  };
  
  export default SMTPServices;
  
