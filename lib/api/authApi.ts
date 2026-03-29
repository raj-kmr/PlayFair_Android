import { api } from "./apiClient"
import { endPoints } from "./endPoint"
import { tokenStore } from "./tokenStore"


export type SigninBody = {
    email: string,
    password: string
}

export type SignupBody = {
    username: string,
    email: string,
    password: string
}

export type AuthResponse = {
    token: string
}

export const signin = async (body: SigninBody) => {
    const { data } = await api.post<AuthResponse>(endPoints.auth.signin, body)

    await tokenStore.set(data.token)
    return data
}

export const signup = async(body: SignupBody) => {
    const { data } = await api.post(endPoints.auth.signup, body)
    return data
}

export const logout = async () => {
    await tokenStore.remove()
}