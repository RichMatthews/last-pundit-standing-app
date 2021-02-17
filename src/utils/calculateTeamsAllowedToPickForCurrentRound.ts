export const calculateTeamsAllowedToPickForCurrentRound = ({ currentGame, currentPlayer, leagueTeams }) => {
    if (currentGame.currentRound === 0) {
        return leagueTeams
    } else {
        const allTeamsForThisLeague = leagueTeams
        let teamsAlreadyChosen: any = []
        currentPlayer.rounds.forEach((round: any) => {
            if (round.selection.code) {
                teamsAlreadyChosen.push(round.selection.code)
            }
        })
        console.log(teamsAlreadyChosen, 'tactacsa')
        return allTeamsForThisLeague.map((team: any) => {
            if (teamsAlreadyChosen.includes(team.code)) {
                return { ...team, chosen: true }
            } else {
                return { ...team, chosen: false }
            }
        })
    }
}
