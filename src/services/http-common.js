import axios from "axios";

 //Server api access
export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});


export const authHeader=()=> {
    const token = localStorage.getItem("auth");
  
    // if (!token) {
    //   return { Authorization: `Bearer ${token}` };
    // }
    return { Authorization: `Bearer ${token}` };
  }
  
