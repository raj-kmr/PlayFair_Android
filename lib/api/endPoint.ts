export const endPoints = {
    auth: {
        signup: "/auth/signup",
        signin: "/auth/signin"
    },
    games: {
        getGames: "/games",
        createGame: "/games",
        update: (id: number) => `/games/${id}`,
        delete: (id: number | string) => `/games/${id}`,
        addIgdb: "/games/igdb"
    },
    igdb: {
        search: "/igdb/search"
    }
}