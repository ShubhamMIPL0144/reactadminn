

import http from "./http-common.js";

  

   const getUserActivityData  = (data) =>
  http.post(
    `applicationsuperadmin/GetUserActivitydata`,data
  ); 



  const StatisticsServices = {
    getUserActivityData
  };
  
  export default StatisticsServices;
  
