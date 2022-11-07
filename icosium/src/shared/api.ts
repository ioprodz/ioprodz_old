import axios from "axios";
import { baseUrl } from "./config";

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    throw error.response;
  }
);
