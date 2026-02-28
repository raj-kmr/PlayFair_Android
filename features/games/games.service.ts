import { api } from "@/lib/api/apiClient";
import { endPoints } from "@/lib/api/endPoint";


// Created seperation of games UI logic and API calls
export type Game = {
    id: number, 
    name: string,
    image: string | null,
    description: string | null,
    igdb_id: number | null,
    initial_playtime_minutes: number,
    playtime_hours: number
}

export type CreateGame = {
    name: string,
    imageUrl?: string | null,
    initialPlaytimeMinutes?: number,
    description?: string | null,
    igdbId?: number | null
}

export type GameResponse = {
    games: Game[],
    totalPlaytime?: number,
    totalPlaytimeMinutes?: number
}

export type UpdateGame = {
    name?: string,
    imageUrl?: string | null
}

export const getGames =async () => {
    console.log("Calling get Games");
    const { data } = await api.get<GameResponse>(endPoints.games.getGames)
    return data
}

export const createGame = async (body: CreateGame) => {
    const {data} = await api.post(endPoints.games.createGame, body)
    return data
}

export const updateGame = async (id: number, body: UpdateGame) => {
    const { data } = await api.patch(endPoints.games.update(id), body)
    return data
}

export const  deleteGame = async(id: number | string) => {
    const {data} = await api.delete(endPoints.games.delete(id))
    return data
}

export type AddIgdbGame = {
    igdbId: number,
    name: string,
    imageUrl?: string | null,
    description?: string | null,
    playedBefore: boolean,
    initialPlaytimeMinutes: number
}

export const addIgdbGame = async (body: AddIgdbGame) => {
    const { data } = await api.post(endPoints.games.addIgdb, body)
    return data
}