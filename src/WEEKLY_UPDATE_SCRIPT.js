// const CURRENT_GAMEWEEK = require('./admin/current-week/index.ts')
// const { firebaseApp } = require('./config.js')
const uid = require('uid')

const firebase = require('firebase/app')
require('firebase/auth')
require('firebase/database')
require('firebase/storage')

const PROD_CONFIG = {
    apiKey: 'AIzaSyDGstYWa2DI7Y9V6LIEjZ14l3Tvb3PdA2M',
    authDomain: 'last-pundit-standing.firebaseapp.com',
    databaseURL: 'https://last-pundit-standing.firebaseio.com',
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
            home: { code: 'SOT', name: 'Southampton', goals: 1 },
            away: { code: 'CHE', name: 'Chelsea', goals: 1 },
            result: 'draw',
        },
        {
            home: { code: 'AST', name: 'Aston Villa', goals: 1 },
            away: { code: 'LEI', name: 'Leicester', goals: 2 },
            result: 'LEI',
        },
        {
            home: { code: 'ARS', name: 'Arsenal', goals: 0 },
            away: { code: 'MNC', name: 'Man City', goals: 1 },
            result: 'MNC',
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

const roundResultDetails = ({
    currentPlayerGameRound,
    fixture,
    playerTeamCode,
    playerTeamOpponentCode,
    playingAthome,
    won,
}) => {
    const showHomeDetails = playingAthome ? 'home' : 'away'
    const showAwayDetails = playingAthome ? 'away' : 'home'

    return {
        complete: true,
        teamPlayingAtHome: playingAthome,
        name: currentPlayerGameRound.selection.name,
        goals: fixture[showHomeDetails].goals,
        code: playerTeamCode,
        opponent: {
            code: playerTeamOpponentCode,
            name: fixture[showAwayDetails].name,
            goals: fixture[showAwayDetails].goals,
        },
        result: won ? 'won' : 'lost',
    }
}

const calculateIfTheChoiceWon = ({ currentPlayerGameRound, fixture, game, league, player, playingAthome }) => {
    const playerTeamCode = currentPlayerGameRound.selection.code
    const playerTeamOpponentCode = currentPlayerGameRound.selection.opponent.code
    if (playingAthome) {
        if (fixture.result === currentPlayerGameRound.selection.code) {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: false,
                roundResult: roundResultDetails({
                    currentPlayerGameRound,
                    playerTeamCode,
                    playerTeamOpponentCode,
                    fixture,
                    playingAthome,
                    won: true,
                }),
            })
        } else {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: true,
                roundResult: roundResultDetails({
                    currentPlayerGameRound,
                    playerTeamCode,
                    playerTeamOpponentCode,
                    fixture,
                    playingAthome,
                    won: false,
                }),
            })
        }
    } else {
        if (fixture.result === currentPlayerGameRound.selection.code || fixture.result === 'draw') {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: false,
                roundResult: roundResultDetails({
                    currentPlayerGameRound,
                    playerTeamCode,
                    playerTeamOpponentCode,
                    fixture,
                    playingAthome,
                    won: true,
                }),
            })
        } else {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: true,
                roundResult: roundResultDetails({
                    currentPlayerGameRound,
                    playerTeamCode,
                    playerTeamOpponentCode,
                    fixture,
                    playingAthome,
                    won: false,
                }),
            })
        }
    }
}

const updateAllLeagues = () => {
    return firebaseApp
        .database()
        .ref(`leagues`)
        .once('value')
        .then((snapshot) => {
            const everyLeague = Object.values(snapshot.val())
            everyLeague
                .filter((league) => league.id === '9hk0btr26u7')
                .forEach((league) => {
                    const currentGame = Object.values(league.games).find((game) => !game.complete)
                    const currentGamePlayers = Object.values(currentGame.players)
                    currentGamePlayers.forEach((player) => {
                        const currentPlayerGameRound = player.rounds[currentGame.currentGameRound]
                        // fix the line below to update firebase if someone has not made a choice
                        if (
                            currentPlayerGameRound &&
                            currentPlayerGameRound.selection &&
                            currentPlayerGameRound.selection.complete
                        ) {
                            const fixture = findFixture(currentPlayerGameRound.selection)
                            calculateIfTheChoiceWon({
                                currentPlayerGameRound,
                                fixture,
                                game: currentGame,
                                league,
                                player,
                                playingAthome: currentPlayerGameRound.selection.teamPlayingAtHome,
                            })
                        }
                    })
                    updateCurrentGameStatus({ game: currentGame, league })
                })
            console.log('updating leagues finished')
        })
}

const updatePlayerChoiceObjectWithMatchResult = ({ game, league, roundResult, player }) => {
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}/players/${player.information.id}/rounds/${game.currentGameRound}`)
        .update({ selection: roundResult }, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                console.log(`Updated: ${player.information.name} match result`)
            }
        })
}

const updatePlayerEliminationStatus = ({ eliminated, game, league, player }) => {
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}/players/${player.information.id}`)
        .update({ hasBeenEliminated: eliminated }, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                console.log(`Updated ${player.information.id} elimination status`)
            }
        })
}

const updateCurrentGameStatus = ({ game, league }) => {
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}`)
        .once('value')
        .then((snapshot) => {
            const allPlayers = Object.values(snapshot.val().players)
            const allPlayersEliminated = allPlayers.every((player) => player.hasBeenEliminated)
            const gameHasWinner = allPlayers.filter((player) => !player.hasBeenEliminated).length === 1
            const remainingPlayers = allPlayers.filter((player) => !player.hasBeenEliminated)
            const gameStillInProgress = !allPlayersEliminated && !gameHasWinner
            let resetPlayers = {}
            allPlayers.forEach((player) => {
                let newPlayer = {
                    ...player,
                    hasBeenEliminated: false,
                    rounds: [{ selection: { complete: false } }],
                }

                resetPlayers = { ...resetPlayers, [player.information.id]: newPlayer }
            })

            if (allPlayersEliminated) {
                updateGameWithNoWinner()
                return
            }
            if (gameHasWinner) {
                updateGameWithWinner({ league, players: resetPlayers, game })
                return
            }
            if (gameStillInProgress) {
                updateGameStillInProgress({
                    game,
                    league,
                    remainingPlayers,
                    roundId: snapshot.val().currentGameRound + 1,
                })
                return
            }
        })
}

const updateGameWithNoWinner = () => {}

const updateGameWithWinner = async ({ league, players, game }) => {
    await completeCurrentGame({ league, game })
    await createNewGame({ league, players })
}

const createNewGame = ({ league, players }) => {
    const newGameId = uid()
    const newGameConfig = {
        complete: false,
        id: newGameId,
        currentGameRound: 0,
        players,
    }
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${newGameId}`)
        .update(newGameConfig, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                //
            }
        })
}

const completeCurrentGame = ({ league, game }) => {
    const gameConfig = {
        complete: true,
    }
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}`)
        .update(gameConfig, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
            }
        })
}

const updateGameStillInProgress = ({ game, league, remainingPlayers, roundId }) => {
    firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}`)
        .update({ currentGameRound: roundId }, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
            }
        })
    return remainingPlayers.forEach((player) => {
        return firebaseApp
            .database()
            .ref(`leagues/${league.id}/games/${game.id}/players/${player.information.id}/rounds/${roundId}`)
            .update({ selection: { complete: false } }, (error) => {
                if (error) {
                    console.log('ERROR!:', error)
                } else {
                }
            })
    })
}

const updateFirebaseWithResults = ({ eliminated, game, league, roundResult, player }) => {
    updatePlayerChoiceObjectWithMatchResult({ game, league, player, roundResult })
    updatePlayerEliminationStatus({ eliminated, game, league, player })
}

updateAllLeagues()
