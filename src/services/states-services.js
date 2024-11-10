import http from "./http-common.js";

const createState = (data) => http.post(`/AddState`, data);
const createCity = (data) => http.post(`/AddCity`, data);

const getStates = () => http.get(`/GetStateListCity`);

const updateState = (data) => http.post(`/UpdateState`, data);
const updateCity = (data) => http.post(`/UpdateCity`, data);
const deleteState = (stateId) => http.post(`/DeleteState?Id=`+stateId,{});
const deleteCity = (cityId) => http.post(`/DeleteCity?Id=`+cityId,{});

const StateServices = {
    createState,getStates,createCity,updateState,deleteState,deleteCity,updateCity
};

export default StateServices;
