import axios from "axios";
import {BASE_URL} from "../config";

//create BASE_URL- Backend app running

const axiosInstance = axios.create({baseURL: BASE_URL});
//after that we can add interceptors i.e. middlewares,functions which are going to be run before the req is send after the response is received

axios.interceptors.response.use((response) => response, (error) => Promise.reject((error.reponse && error.response.data) || "Something went wrong"
)
);

export default axiosInstance;