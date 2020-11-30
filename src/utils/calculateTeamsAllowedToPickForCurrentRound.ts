export const calculateTeamsAllowedToPickForCurrentRound = ({ currentGame, currentPlayer, leagueTeams }) => {
    if (currentGame.currentRound === 0) {
        return leagueTeams
    } else {
        const allTeamsForThisLeague = leagueTeams
        let teamsAlreadyChosen: any = []
        currentPlayer.rounds.forEach((round: any) => {
            if (round.choice.value) {
                teamsAlreadyChosen.push(round.choice.value)
            }
        })
        return allTeamsForThisLeague.filter((team) => !teamsAlreadyChosen.includes(team.value))
    }
}
