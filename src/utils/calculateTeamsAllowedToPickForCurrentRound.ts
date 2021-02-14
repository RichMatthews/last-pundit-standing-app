export const calculateTeamsAllowedToPickForCurrentRound = ({ currentGame, currentPlayer, leagueTeams }) => {
    if (currentGame.currentRound === 0) {
        return leagueTeams
    } else {
        const allTeamsForThisLeague = leagueTeams
        let teamsAlreadyChosen: any = []
        currentPlayer.rounds.forEach((round: any) => {
            if (round.selection.name) {
                teamsAlreadyChosen.push(round.selection.name)
            }
        })
        return allTeamsForThisLeague.map((team: any) => {
            if (teamsAlreadyChosen.includes(team.name)) {
                return { ...team, chosen: true }
            } else {
                return { ...team, chosen: false }
            }
        })
    }
}
