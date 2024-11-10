

import http from "./http-common.js";

  
  
const addTicketStatusNote = (data) =>
  http.post("/AddTicketStatusNote",data) 
  

const getTicketNotes = (statusId,ticketNo) =>
  http.get(`/GetTicketStatus?Id=${statusId}&TicketNo=${ticketNo}`) 
  

 const getAppList = (userId) =>
http.get("/GetApplistForUser?id="+userId) 

 const getAppDetails = (appId) =>
http.get("/AppDetails?Id="+appId) 

 const updateApp = (data) =>
http.post("/UpdateApp",data) 

 const deleteAppImages = (id) =>
http.post("/DeleteAppImage?Id="+id,{}) 


 const addTicketStatus = (data) =>
  http.post("/AddTicketStatus",data) 
   

 const updateTicketChecklist = (data) =>
http.post("/AddSubStatusTicketwise",data) 
 
const deleteTicket = (ticketId) =>
http.post("/DeleteApp?Id="+ticketId,{}) 

 const getAppChecklist = (userId,ticketNo) =>
http.get(`/GetSubStatusTicketwise?Id=${userId}&TicketNo=${ticketNo}`) 
 
 const getCustomerDetails = (id) =>
http.get(`/AddCreatorListById?userid=${id}`) 

 const downloadImage = (appId,imageType) =>
  http.get(`/GetAppImages?Id=${appId}&ImageType=${imageType}`) 
  

  const TicketServices = {
    getTicketNotes, addTicketStatusNote,  getAppList,getAppDetails,updateApp,getAppChecklist,updateTicketChecklist,deleteTicket,addTicketStatus,downloadImage,getCustomerDetails,deleteAppImages
  };
  
  export default TicketServices;
  
