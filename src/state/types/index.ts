type LeagueAdmin = {
  id: string
}

type Opponent = {
  goals?: number
  code: string
  name: string
}

export type SelectionPending = {
  complete: boolean
}

export type SelectionComplete = {
  code: number
  complete: boolean
  goals: number
  name: string
  opponent: Opponent
  result: string
  teamPlayingAtHome?: boolean
}

type PlayerRound = {
  id: string
  round: number
  selection: SelectionComplete | SelectionPending
}

type PlayerInformation = {
  id: string
  name: string
}

export type Player = {
  information: PlayerInformation
  hasBeenEliminated: boolean
  rounds: PlayerRound[]
}

export type Game = {
  complete: boolean
  id: string
  leagueRound: number
  players: Player[]
}

export type League = {
  currentRound: number
  id: string
  isPrivate: boolean
  joinPin: string
  name: string
  admin: LeagueAdmin
  games: Game[]
}

type Team = {
  name: string
  code: string
}

export type MatchBlock = {
  block: number
  date: string
  matches: Match[]
}

export type Match = {
  home: Team
  away: Team
  result: string
  time: string
}

export type SelectedTeam = {
  code: string
  name: string
  index: 0
  home: boolean
}
