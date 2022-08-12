import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://add-pins-to-map.herokuapp.com/api"
})