import { Container } from "inversify";
import axios, { AxiosInstance } from "axios";
import { TYPES } from "./types";

const container = new Container();

// Configure Axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

container.bind<AxiosInstance>(TYPES.AxiosInstance).toConstantValue(axiosInstance);

export { container };
