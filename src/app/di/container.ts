import { Container } from "inversify";
import axios, { AxiosInstance } from "axios";
import { TYPES } from "./types";

const container = new Container();

import { getGlobalHeaders } from "@/utils/api";

// Configure Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const globalHeaders = getGlobalHeaders();
    Object.entries(globalHeaders).forEach(([key, value]) => {
        config.headers[key] = value;
    });
    return config;
});

container.bind<AxiosInstance>(TYPES.AxiosInstance).toConstantValue(axiosInstance);

export { container, axiosInstance };
