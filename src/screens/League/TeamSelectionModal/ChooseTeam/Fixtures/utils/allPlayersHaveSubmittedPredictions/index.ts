export const allPlayersHaveSubmittedPredictions = ({ players, currentGameweek }) => {
  return players.every((player) => player.rounds.find((round) => round.round === currentGameweek).selection.complete)
}
