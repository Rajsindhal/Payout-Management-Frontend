import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
});

export default axiosInstance;
