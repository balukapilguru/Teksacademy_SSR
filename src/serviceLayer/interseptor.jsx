import axios from "axios";
 const versityApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TEKS_SSR_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});


export { versityApi };




