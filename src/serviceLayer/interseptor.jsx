import axios from "axios";
 const versityApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TEKSSKILL_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});


export { versityApi };




