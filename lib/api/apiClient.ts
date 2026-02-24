import axios, { Axios, AxiosError, InternalAxiosRequestConfig } from "axios"
import { tokenStore } from "./tokenStore"


// Axios instance of baseUrl and Json defaults
export const api = axios.create({
    baseURL: "http://192.168.1.13:3000",
    timeout: 15000,
    headers: {"Content-Type": "application/json"}
})

// Request interceptor that auto attachs token to every request
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    console.log("➡️", config.method?.toUpperCase(), (config.baseURL || "") + (config.url || ""));
    const token = await tokenStore.get()
    console.log("Getting the token: ", token)
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
})

//error message extractor so won't deal with Axios internals
export function getApiErrorMessage(err: unknown) {
    const e = err as AxiosError<any>;
    return e?.response?.data?.message || e?.message || "Something went wrong" 
}