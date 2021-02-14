type LeagueAdmin = {
    id: string
}

type Opponent = {
    goals: number
    id: string
    name: string
}

type PlayerRound = {
    choice: {
        goals: number
        selection: boolean
        id: number
        opponent: Opponent
        result: string
        teamPlayingAtHome: boolean
        value: string
    }
}

type GamePlayer = {
    hasBeenEliminated: boolean
    id: string
    name: string
    rounds: PlayerRound[]
}

type LeagueGame = {
    id: string
    complete: boolean
    currentGameRound: number
    players: GamePlayer[]
}

export type League = {
    currentRound: number
    id: string
    isPrivate: boolean
    joinPin: string
    name: string
    admin: LeagueAdmin
    games: LeagueGame[]
}
