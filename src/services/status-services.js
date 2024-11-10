import http from "./http-common.js";

const createAppStatus = (data) => http.post(`/AppStatus`, data);

const updateAppStatus = (data) => http.post(`/UpdateStatus`, data);
const getAppStatus = () => http.get(`/GetAppStatus`);

const createAppSubStatus = (data) => http.post(`/AddAppSubStatus`, data);

const updateAppSubStatus = (data) => http.post(`/UpdateSubStatus`, data);
const getAppSubStatus = () => http.get(`/GetAppCheckListSubStatus`);
const deleteAppSubStatus = (id) => http.post(`/DeleteAppSubStatus?Id=${id}`,{});
const updateChecklistPositions = (data) => http.post(`/updateSubStatuspriority`,data);

const StatusServices = {
  createAppStatus,
  updateAppStatus,
  createAppSubStatus,
  updateAppSubStatus,
  getAppSubStatus,
  getAppStatus,
  deleteAppSubStatus,updateChecklistPositions};

export default StatusServices;
