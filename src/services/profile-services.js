

import http from "./http-common.js";

  
 
  
  const updateProfile  = (data) =>
  http.post(
    `/ApplicationSuperAdmin/UpdateSuperAdminDetails`,data
  ); 



  const ProfileServices = {
    updateProfile
  };
  
  export default ProfileServices;
  
