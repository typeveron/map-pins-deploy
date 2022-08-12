import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://map-add-pins.herokuapp.com/api"
})