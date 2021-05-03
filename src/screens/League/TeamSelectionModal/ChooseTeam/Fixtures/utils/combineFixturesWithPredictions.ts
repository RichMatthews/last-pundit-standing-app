const splitNameIntoInitials = (name: string) => {
  return name.split(' ')[0][0] + name.split(' ')[1][0]
}

export const combineFixturesWithPredictions = ({ currentGame, currentGameweek, fixtures }) => {
  return fixtures.map((block) => {
    return {
      ...block,
      matches: block.matches.map((match) => {
        currentGame.players.map((player) => {
          const playersPredictions = player.rounds.find((p) => p.round === currentGameweek).selection.predictions
          console.log(playersPredictions, '121231')
          const individualMatch = playersPredictions.find((mch) => mch.id === match.id)

          if (individualMatch.selected === 'draw') {
            match = {
              ...match,
              draw: {
                predictors: match.draw
                  ? match.draw.predictors
                    ? match.draw.predictors.concat(splitNameIntoInitials(player.information.name))
                    : [splitNameIntoInitials(player.information.name)]
                  : [splitNameIntoInitials(player.information.name)],
              },
            }
          } else {
            match = {
              ...match,
              [individualMatch.selected]: {
                ...match[individualMatch.selected],
                predictors: match[individualMatch.selected]
                  ? match[individualMatch.selected].predictors
                    ? match[individualMatch.selected].predictors.concat(splitNameIntoInitials(player.information.name))
                    : [splitNameIntoInitials(player.information.name)]
                  : [splitNameIntoInitials(player.information.name)],
              },
            }
          }
        })

        return match
      }),
    }
  })
}
