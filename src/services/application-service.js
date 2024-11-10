

import http from "./http-common.js";

  
  const getApplicationList  = () =>
  http.get(
    `/ApplicationSuperAdmin/GetAllApplicationList`
  );

  const getAllApplicationList  = () =>
  http.get(
    `/SettingSuperAdmin/GetAllApplicationList`
  );

   const createApplication  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/CreateV2`,data
  ); 

   const updateApplicationDetails  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdateApplicationDetails`,data
  ); 
  
  const updateAdminDetails  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdateAdminDeatails`,data
  ); 
  const updateComments  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdateComments`,data
  ); 

     const getApplication  = (id) =>
  http.get(
    `/ApplicationSuperAdmin/Edit?id=${id}`
  );  
  


  const ApplicationServices = {
    getApplicationList,createApplication,updateComments,getApplication,getAllApplicationList,updateApplicationDetails,updateAdminDetails
  };
  
  export default ApplicationServices;
  
