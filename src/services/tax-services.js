import http from "./http-common.js";
const createTax = (data) => http.post(`/CreateTax`, data);
const getTax = () => http.get(`/GetTax`);
const getCountry = () => http.get(`/GetCountry`);
const deleteTax = (taxId) =>
http.post(`/DeleteTax?Id=` + taxId, {});

const createRate = (data) => http.post(`/RateCreation`, data);
const getRate = () => http.get(`/GetRate`);
const TaxServices = {
  createTax,
  getTax,
  deleteTax,getCountry,getRate,createRate
};

export default TaxServices;
