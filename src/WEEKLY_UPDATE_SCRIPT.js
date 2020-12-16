// const CURRENT_GAMEWEEK = require('./admin/current-week/index.ts')
// const { firebaseApp } = require('./config.js')

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

// fixtures: [
//     { home: { team: 'Everton', goals: 2 }, away: { team: 'Liverpool', goals: 2 }, result: 'draw' },
//     { home: { team: 'Chelsea', goals: 3 }, away: { team: 'Southampton', goals: 3 }, result: 'draw' },
//     { home: { team: 'Man City', goals: 1 }, away: { team: 'Arsenal', goals: 0 }, result: 'Man City' },
//     { home: { team: 'Newcastle', goals: 1 }, away: { team: 'Man United', goals: 4 }, result: 'Man United' },
//     { home: { team: 'Sheffield United', goals: 1 }, away: { team: 'Fulham', goals: 1 }, result: 'draw' },
//     { home: { team: 'Crystal Palace', goals: 1 }, away: { team: 'Brighton', goals: 1 }, result: 'draw' },
//     { home: { team: 'Spurs', goals: 3 }, away: { team: 'West Ham', goals: 3 }, result: 'draw' },
//     { home: { team: 'Leicester', goals: 0 }, away: { team: 'Aston Villa', goals: 1 }, result: 'Aston Villa' },
//     { home: { team: 'West Brom', goals: 0 }, away: { team: 'Burnley', goals: 0 }, result: 'pending' },
//     { home: { team: 'Leeds', goals: 0 }, away: { team: 'Wolves', goals: 0 }, result: 'pending' },
// ],
// const CURRENT_GAMEWEEK = {
//     fixtures: [
//         { home: { team: 'Aston Villa', goals: 0 }, away: { team: 'Leeds', goals: 3 }, result: 'Leeds' },
//         { home: { team: 'West Ham', goals: 1 }, away: { team: 'Man City', goals: 1 }, result: 'draw' },
//         { home: { team: 'Fulham', goals: 1 }, away: { team: 'Crystal Palace', goals: 2 }, result: 'Crystal Palace' },
//         { home: { team: 'Man United', goals: 0 }, away: { team: 'Chelsea', goals: 0 }, result: 'draw' },
//         { home: { team: 'Liverpool', goals: 2 }, away: { team: 'Sheffield United', goals: 1 }, result: 'Liverpool' },
//         { home: { team: 'Southampton', goals: 2 }, away: { team: 'Everton', goals: 0 }, result: 'Southampton' },
//         { home: { team: 'Wolves', goals: 1 }, away: { team: 'Newcastle', goals: 1 }, result: 'draw' },
//         { home: { team: 'Arsenal', goals: 0 }, away: { team: 'Leicester', goals: 1 }, result: 'Leicester' },
//         { home: { team: 'Brighton', goals: 1 }, away: { team: 'West Brom', goals: 1 }, result: 'draw' },
//         { home: { team: 'Burnley', goals: 0 }, away: { team: 'Spurs', goals: 1 }, result: 'Spurs' },
//     ],
// }

// const CURRENT_GAMEWEEK = {
//     fixtures: [
//         { home: { team: 'Wolves', goals: 2 }, away: { team: 'Crystal Palace', goals: 3 }, result: 'Leeds' },
//         { home: { team: 'West Brom', goals: 0 }, away: { team: 'Spurs', goals: 1 }, result: 'Spurs' },
//     ],
// }

const CURRENT_GAMEWEEK = {
    fixtures: [
        { home: { team: 'Leeds', goals: 1 }, away: { team: 'West Ham', goals: 2 }, result: 'West Ham' },
        {
            home: { team: 'Southampton', goals: 3 },
            away: { team: 'Sheffield United', goals: 0 },
            result: 'Southampton',
        },
    ],
}

const findFixture = (choice) => {
    console.log(choice, 'cho')
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
            updateFirebaseRecord({
                game,
                league,
                player,
                eliminated: false,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: true }),
            })
        } else {
            updateFirebaseRecord({
                game,
                league,
                player,
                eliminated: true,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: false }),
            })
        }
    } else {
        if (fixture.result === currentPlayerGameRound.choice.value || fixture.result === 'draw') {
            updateFirebaseRecord({
                game,
                league,
                player,
                eliminated: false,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: true }),
            })
        } else {
            updateFirebaseRecord({
                game,
                league,
                player,
                eliminated: true,
                roundResult: roundResultDetails({ currentPlayerGameRound, fixture, playingAthome, won: false }),
            })
        }
    }
}

const calculateGameweekResults = () => {
    return firebaseApp
        .database()
        .ref(`leagues`)
        .once('value')
        .then((snapshot) => {
            const allLeagues = Object.values(snapshot.val())

            allLeagues
                .filter((league) => league.id !== 'vtayor7rb65')
                .forEach((league) => {
                    const allGames = Object.values(league.games).filter((game) => !game.complete)
                    allGames.forEach((game) => {
                        if (game.complete === false) {
                            const allGamePlayers = Object.values(game.players)
                            allGamePlayers.forEach((player) => {
                                const currentPlayerGameRound = player.rounds[game.currentGameRound]
                                // fix the line below to update firebase if someone has not made a choice
                                if (
                                    currentPlayerGameRound &&
                                    currentPlayerGameRound.choice &&
                                    currentPlayerGameRound.choice.hasMadeChoice
                                ) {
                                    const fixture = findFixture(currentPlayerGameRound.choice)
                                    console.log(currentPlayerGameRound, 'THIS')
                                    calculateIfTheChoiceWon({
                                        currentPlayerGameRound,
                                        fixture,
                                        game,
                                        league,
                                        player,
                                        playingAthome: currentPlayerGameRound.choice.teamPlayingAtHome,
                                    })
                                }
                            })
                        }
                    })
                })
            console.log('updating leagues finished')
        })
}

const updateWinOrLose = ({ game, league, roundResult, player }) => {
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

const updatePlayerStatus = ({ eliminated, game, league, player }) => {
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
            if (allPlayersEliminated) {
                updateGameWithNoWinner()
                return
            }
            if (gameHasWinner) {
                updateGameWithWinner()
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

const updateGameWithWinner = () => {}

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

const updateFirebaseRecord = ({ eliminated, game, league, roundResult, player }) => {
    updateWinOrLose({ game, league, player, roundResult })
    updatePlayerStatus({ eliminated, game, league, player })
    updateCurrentGameStatus({ game, league })
    // process.exit()
}

calculateGameweekResults()
