import * as SecureStore from "expo-secure-store"

const TOKEN_KEY = "token";

export const tokenStore = {
    get: () => SecureStore.getItemAsync(TOKEN_KEY),
    set: (token: string) => SecureStore.setItemAsync(TOKEN_KEY, token),
    remove: () => SecureStore.deleteItemAsync(TOKEN_KEY)
}