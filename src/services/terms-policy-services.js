

import http from "./http-common.js";

 const updateTerms  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdatePrivacyPolicy`,data
  ); 

   const updateDataPolicy  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdateDataPolicy`,data
  ); 

  const updateBlockWords  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdateBlockWords`,data
  ); 

 const addBlockWords  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/AddBlockWords`,data
  ); 


  const updateAdTerms  = (data) =>
    http.post(
      `/ApplicationSuperAdmin/UpdateTermsCondition`,data
    ); 
  



  const TermsPolicyServices = {
    updateTerms,updateDataPolicy,updateBlockWords,addBlockWords,updateAdTerms
  };
  
  export default TermsPolicyServices;
  
