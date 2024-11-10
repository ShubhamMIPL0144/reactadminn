

import http from "./http-common.js";

  const getAllAdsDetails  = (data) =>
  http.post(
    `/SuperAdminApiSuperAdmin/GetAllAdDetails`,data
  );
  const getStatesAndCities = () => http.get(`/GetStateListCity`);
  const createAd = (data) => http.post("/SaveAdd", data);
  const deleteAd  = (adId) =>
  http.post(
    `/SuperAdminApiSuperAdmin/AddsDelete?id=`+adId
  ); 

  // const getApplicationDetails = (fromDate, toDate) =>
  //   http.get(`/GetApplicationDetails?fromdate=${fromDate}&todate=${toDate}`);

  const getApplicationDetails = (data) =>
    http.post(`/GetApplicationDetails`,data);
  const getAdList = (id) => http.get(`/GetAddDetails/${id}`);
  const getAdDetail = (adId) => http.get(`/GetAddDetailsById/${adId}`);
  const getAdCreatorList = () => http.get(`/AddCreatorList`);

  
  const approvedAds = (adId) =>
    http.post(`/UpdateAddStatus?id=`+adId,{});

  const AdServices = {
    getAllAdsDetails,deleteAd,approvedAds,createAd,getApplicationDetails,getAdList,getAdDetail,getAdCreatorList,getStatesAndCities
  };
  
  export default AdServices;
  
