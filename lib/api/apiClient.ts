import axios, { Axios, AxiosError, InternalAxiosRequestConfig } from "axios"
import { tokenStore } from "./tokenStore"


// Axios instance of baseUrl and Json defaults
export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 15000,
    headers: {"Content-Type": "application/json"}
})

// Request interceptor that auto attachs token to every request
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStore.get()
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            await tokenStore.remove()
        }
        return Promise.reject(error)
    }
)

//error message extractor so won't deal with Axios internals
export function getApiErrorMessage(err: unknown) {
    const e = err as AxiosError<any>;
    return e?.response?.data?.message || e?.message || "Something went wrong" 
}

export const savePushToken = async (token: string) => {
    await api.post("/auth/push-token", { pushToken: token })
}