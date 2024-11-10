import http from "./http-common.js";
const createDiscountPolicy = (data) => http.post(`/AddDiscountPolicy`, data);
const getDiscountPolicy = () => http.get(`/DiscountPolicyList`);
const updateDiscountPolicy = (data) => http.post(`/UpdateDiscountPolicy`, data);
const deleteDiscountPolicy = (discountPolicyId) =>
  http.post(`/DeletePolicy?Id=` + discountPolicyId, {});

const DiscountPolicyServices = {
  createDiscountPolicy,
  getDiscountPolicy,
  updateDiscountPolicy,
  deleteDiscountPolicy,
};

export default DiscountPolicyServices;
