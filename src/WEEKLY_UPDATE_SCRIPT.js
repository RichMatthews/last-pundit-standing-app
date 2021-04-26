const uid = require('uid')

const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
require('firebase/storage')

const PROD_CONFIG = {
  apiKey: 'AIzaSyDGstYWa2DI7Y9V6LIEjZ14l3Tvb3PdA2M',
  authDomain: 'last-pundit-standing.firebaseapp.com',
  databaseURL: 'https://last-pundit-standing.firebaseio.com/',
  projectId: 'last-pundit-standing',
  storageBucket: 'last-pundit-standing.appspot.com',
  messagingSenderId: '571433706213',
  appId: '1:571433706213:web:b1b3f66bbbaae27a3b2a0c',
  measurementId: 'G-6NMKP6QLFC',
}
const firebaseApp = firebase.initializeApp(PROD_CONFIG)

const CURRENT_GAMEWEEK = {
  fixtures: [
    {
      home: { code: 'TOT', name: 'Spurs', goals: 2 },
      away: { code: 'SOT', name: 'Southampton', goals: 1 },
      result: 'TOT',
    },
    {
      home: { code: 'WOL', name: 'Wolves', goals: 1 },
      away: { code: 'SHU', name: 'Sheffield United', goals: 0 },
      result: 'WOL',
    },
    {
      home: { code: 'NEW', name: 'Newcastle', goals: 3 },
      away: { code: 'WHU', name: 'West Ham', goals: 2 },
      result: 'NEW',
    },
  ],
}

const findFixture = (choice) => {
  const gameWeekFixtures = CURRENT_GAMEWEEK.fixtures
  const foundMatch = gameWeekFixtures.find(
    (fixture) => fixture.home.code === choice.code || fixture.away.code === choice.code,
  )
  return foundMatch
}

const updatePlayerMatchResultInFirebase = ({ data, roundResult, playerResult }) => {
  const { leagueId, gameId, playerId, roundId } = data
  return firebaseApp
    .database()
    .ref(`/leagues/${leagueId}/games/${gameId}/players/${playerId}/rounds/${roundId}/selection`)
    .update({ ...roundResult, result: playerResult }, (error) => {
      if (error) {
        console.log('error updating player: ', playerId, 'for round:', roundId)
      } else {
        console.log(`Updated: ${playerId} match result, for round: ${roundId}`)
      }
    })
}

const updatePlayerEliminationStatus = ({ data }) => {
  const { leagueId, gameId, playerId, roundId } = data
  return firebaseApp
    .database()
    .ref(`leagues/${leagueId}/games/${gameId}/players/${playerId}`)
    .update({ hasBeenEliminated: true }, (error) => {
      if (error) {
        console.log(`ERROR updating has been eliinated for: ${playerId} in round ${roundId}`)
      } else {
        console.log(`Updated ${playerId} elimination status in league: ${leagueId}`)
      }
    })
}

const updateAllLeagues = () => {
  return firebaseApp
    .database()
    .ref('leagues')
    .once('value')
    .then((snapshot) => {
      snapshot.forEach((childNodes) => {
        // if (childNodes.val().id === '9hk0btr26u7') {
        //   return
        // }
        let data = {}
        data['leagueId'] = childNodes.val().id
        const incompleteGame = Object.values(childNodes.val().games).find((game) => !game.complete)
        data['gameId'] = incompleteGame.id
        const remainingPlayers = Object.values(incompleteGame.players).filter((player) => !player.hasBeenEliminated)
        remainingPlayers.forEach((player) => {
          data['playerId'] = player.information.id
          const userMatch = Object.values(player.rounds).find((round) => round.selection.result === 'pending')
          data['roundId'] = userMatch.id
          const fixture = findFixture(userMatch.selection)
          const { goals: homeGoals } = fixture.home
          const { goals: awayGoals } = fixture.away

          const roundResult = {
            ...userMatch.selection,
            goals: userMatch.selection.teamPlayingAtHome ? homeGoals : awayGoals,
            opponent: {
              ...userMatch.selection.opponent,
              goals: userMatch.selection.teamPlayingAtHome ? awayGoals : homeGoals,
            },
          }

          if (userMatch.selection.teamPlayingAtHome && fixture.result === userMatch.selection.code) {
            updatePlayerMatchResultInFirebase({ data, roundResult, playerResult: 'won' })
          } else if (
            (!userMatch.selection.teamPlayingAtHome && fixture.result === 'draw') ||
            fixture.result === userMatch.selection.code
          ) {
            updatePlayerMatchResultInFirebase({ data, roundResult, playerResult: 'won' })
          } else {
            updatePlayerMatchResultInFirebase({ data, roundResult, playerResult: 'lost' })
            updatePlayerEliminationStatus({ data })
          }
        })
        // once done updating all the players, then update the game and the league
        updateCurrentGameStatus({ data })
      })
    })
}

const updateCurrentGameStatus = ({ data }) => {
  const { leagueId, gameId } = data
  return firebaseApp
    .database()
    .ref(`leagues/${leagueId}/games/${gameId}`)
    .once('value')
    .then((snapshot) => {
      const allPlayers = Object.values(snapshot.val().players)
      const allPlayersEliminated = allPlayers.every((player) => player.hasBeenEliminated)
      const gameHasWinner = allPlayers.filter((player) => !player.hasBeenEliminated).length === 1
      const remainingPlayers = allPlayers.filter((player) => !player.hasBeenEliminated)
      const gameStillInProgress = !allPlayersEliminated && !gameHasWinner
      let resetPlayers = {}
      allPlayers.forEach((player) => {
        const newRoundId = uid(32)
        let newPlayer = {
          ...player,
          hasBeenEliminated: false,
          rounds: {
            [newRoundId]: {
              id: newRoundId,
              round: 0,
              selection: {
                complete: false,
              },
            },
          },
        }

        resetPlayers = { ...resetPlayers, [player.information.id]: newPlayer }
      })

      if (allPlayersEliminated) {
        updateGameWithWinner({ data, players: resetPlayers })
        return
      }
      if (gameHasWinner) {
        updateGameWithWinner({ data, players: resetPlayers })
        return
      }
      if (gameStillInProgress) {
        updateGameStillInProgress({
          data,
          remainingPlayers,
          roundId: uid(32),
        })
        return
      }
    })
}

const updateGameWithNoWinner = () => {}

const updateGameWithWinner = async ({ data, players }) => {
  await completeCurrentGame({ data })
  await createNewGame({ data, players })
}

const createNewGame = ({ data, players }) => {
  const { leagueId } = data
  const newGameId = uid()
  const newGameConfig = {
    complete: false,
    id: newGameId,
    players,
  }
  return firebaseApp
    .database()
    .ref(`leagues/${leagueId}/games/${newGameId}`)
    .update(newGameConfig, (error) => {
      if (error) {
        console.log('ERROR creating new league', error)
      }
    })
}

const completeCurrentGame = ({ data }) => {
  const { leagueId, gameId } = data
  const gameConfig = {
    complete: true,
  }
  return firebaseApp
    .database()
    .ref(`leagues/${leagueId}/games/${gameId}`)
    .update(gameConfig, (error) => {
      if (error) {
        console.log(`ERROR: completing game in ${leagueId}, game: ${gameId}`, error)
      } else {
      }
    })
}

const updateGameStillInProgress = ({ data, remainingPlayers, roundId }) => {
  const { leagueId, gameId } = data
  return remainingPlayers.forEach((player) => {
    const round = Object.values(player.rounds).length
    return firebaseApp
      .database()
      .ref(`leagues/${leagueId}/games/${gameId}/players/${player.information.id}/rounds/${roundId}`)
      .update({ id: roundId, round, selection: { complete: false } }, (error) => {
        if (error) {
          console.log('ERROR updating game in progress', error)
        }
      })
  })
}

updateAllLeagues()
