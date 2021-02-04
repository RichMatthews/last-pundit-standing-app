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
        { home: { team: 'Burnley', goals: 0 }, away: { team: 'Man City', goals: 2 }, result: 'Man City' },
        { home: { team: 'Liverpool', goals: 0 }, away: { team: 'Brighton', goals: 1 }, result: 'Brighton' },
        { home: { team: 'Fulham', goals: 0 }, away: { team: 'Leicester', goals: 2 }, result: 'Leicester' },
    ],
}

const findFixture = (choice) => {
    const gameWeekFixtures = CURRENT_GAMEWEEK.fixtures
    const foundMatch = gameWeekFixtures.find(
        (fixture) => fixture.home.team === choice.value || fixture.away.team === choice.value,
    )
    return foundMatch
}

const roundResultDetails = ({ currentPlayerGameRound, fixture, playingAthome, won }) => {
    const showHomeDetails = playingAthome ? 'home' : 'away'
    const showAwayDetails = playingAthome ? 'away' : 'home'
    let roundResult = {
        hasMadeChoice: true,
        teamPlayingAtHome: playingAthome,
        value: currentPlayerGameRound.choice.value,
        goals: fixture[showHomeDetails].goals,
        opponent: {
            name: fixture[showAwayDetails].team,
            goals: fixture[showAwayDetails].goals,
        },
    }
    if (won) {
        return {
            ...roundResult,
            result: 'won',
        }
    } else {
        return {
            ...roundResult,
            result: 'lost',
        }
    }
}

const calculateIfTheChoiceWon = ({ currentPlayerGameRound, fixture, game, league, player, playingAthome }) => {
    if (playingAthome) {
        if (fixture.result === currentPlayerGameRound.choice.value) {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: false,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: true }),
            })
        } else {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: true,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: false }),
            })
        }
    } else {
        if (fixture.result === currentPlayerGameRound.choice.value || fixture.result === 'draw') {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: false,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: true }),
            })
        } else {
            updateFirebaseWithResults({
                game,
                league,
                player,
                eliminated: true,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: false }),
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
                // .filter((league) => league.id === 'l72r12ezoku')
                .forEach((league) => {
                    const currentGame = Object.values(league.games).find((game) => !game.complete)
                    const currentGamePlayers = Object.values(currentGame.players)
                    currentGamePlayers.forEach((player) => {
                        const currentPlayerGameRound = player.rounds[currentGame.currentGameRound]
                        // fix the line below to update firebase if someone has not made a choice
                        if (
                            currentPlayerGameRound &&
                            currentPlayerGameRound.choice &&
                            currentPlayerGameRound.choice.hasMadeChoice
                        ) {
                            const fixture = findFixture(currentPlayerGameRound.choice)
                            calculateIfTheChoiceWon({
                                currentPlayerGameRound,
                                fixture,
                                game: currentGame,
                                league,
                                player,
                                playingAthome: currentPlayerGameRound.choice.teamPlayingAtHome,
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
        .ref(`leagues/${league.id}/games/${game.id}/players/${player.id}/rounds/${game.currentGameRound}`)
        .update({ choice: roundResult }, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                console.log('SUCCESSFULLY UPDATED ANOTHER LEAGUE')
            }
        })
}

const updatePlayerEliminationStatus = ({ eliminated, game, league, player }) => {
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}/players/${player.id}`)
        .update({ hasBeenEliminated: eliminated }, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                console.log('SUCCESSFULLY UPDATED ANOTHER LEAGUE')
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
                    rounds: [{ choice: { hasMadeChoice: false } }],
                }

                resetPlayers = { ...resetPlayers, [player.id]: newPlayer }
            })
            console.log(resetPlayers, 'reset')
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
        winner: false,
        players,
    }
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${newGameId}`)
        .update(newGameConfig, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                console.log('SUCCESSFULLY UPDATED PLAYER')
            }
        })
}

const completeCurrentGame = ({ league, game }) => {
    const gameConfig = {
        complete: true,
        winner: true,
    }
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${game.id}`)
        .update(gameConfig, (error) => {
            if (error) {
                console.log('ERROR!:', error)
            } else {
                console.log('SUCCESSFULLY UPDATED PLAYER')
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
                console.log('SUCCESSFULLY UPDATED PLAYER')
            }
        })
    return remainingPlayers.forEach((player) => {
        return firebaseApp
            .database()
            .ref(`leagues/${league.id}/games/${game.id}/players/${player.id}/rounds/${roundId}`)
            .update({ choice: { hasMadeChoice: false } }, (error) => {
                if (error) {
                    console.log('ERROR!:', error)
                } else {
                    console.log('SUCCESSFULLY UPDATED PLAYER')
                }
            })
    })
}

const updateFirebaseWithResults = ({ eliminated, game, league, roundResult, player }) => {
    updatePlayerChoiceObjectWithMatchResult({ game, league, player, roundResult })
    updatePlayerEliminationStatus({ eliminated, game, league, player })
}

updateAllLeagues()
