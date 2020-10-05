import React from 'react'
import { Text, View } from 'react-native'

import { CURRENT_GAMEWEEK } from '../current-week'
import { firebaseApp } from '../../config.js'

// add this in at some point
interface teamPlayingAwayFixtureConst {
    away: string
    home: string
    time: string
    result: string
}

export const AdminView = () => {
    const findFixture = (choice: any) => {
        const gameWeekFixtures = CURRENT_GAMEWEEK.fixtures
        const foundMatch = gameWeekFixtures.find(
            (fixture) => fixture.home === choice.value || fixture.away === choice.value,
        )
        console.log(choice)
        return foundMatch
    }

    const calculateIfTheChoiceWon = (
        playingAthome: boolean,
        fixture: any,
        currentPlayerGameRound: { choice: { value: string } },
    ) => {
        console.log(fixture)
        if (playingAthome) {
            if (fixture.result === currentPlayerGameRound.choice.value) {
                console.log('YOUR TEAM PLAYED AT HOME AND WON')
            } else {
                console.log('YOUR TEAM DID NOT WIN AT HOME')
            }
        } else {
            if (fixture.result === currentPlayerGameRound.choice.value || fixture.result === 'draw') {
                console.log('YOUR TEAM PLAYED AWAY AND WON')
            } else {
                console.log('YOUR TEAM DID NOT WIN AT AWAY')
            }
        }
    }

    const calculateGameweekResults = () => {
        firebaseApp
            .database()
            .ref(`leagues`)
            .once('value')
            .then((snapshot) => {
                // doing this so we don't accidentally edit production
                const allLeagues = Object.values(snapshot.val())
                allLeagues
                    .filter((league: any) => league.id === 'esyxmn6jqbi')
                    .forEach((league: any) => {
                        const allGames = Object.values(league.games).filter((game: any) => !game.complete)
                        allGames.forEach((game: any) => {
                            if (game.complete === false) {
                                const allGamePlayers: any = Object.values(game.players)
                                allGamePlayers.forEach((player: any) => {
                                    const currentPlayerGameRound = player.rounds[game.currentGameRound]
                                    // fix the line below to update firebase if someone has not made a choice
                                    if (
                                        currentPlayerGameRound &&
                                        currentPlayerGameRound.choice &&
                                        currentPlayerGameRound.choice.hasMadeChoice
                                    ) {
                                        console.log(currentPlayerGameRound)
                                        const fixture: any = findFixture(currentPlayerGameRound.choice)

                                        calculateIfTheChoiceWon(
                                            currentPlayerGameRound.choice.teamPlayingAtHome,
                                            fixture,
                                            currentPlayerGameRound,
                                        )
                                    }
                                })
                            }
                        })
                    })
            })
    }

    const updateFirebaseRecord = (
        choice: {},
        currentRound: string,
        gameId: string,
        leagueId: string,
        roundResult: string,
        userId: string,
    ) => {
        firebaseApp
            .database()
            .ref(`leagues/${leagueId}/games/${gameId}/players/${userId}/rounds/${currentRound}/choice`)
            .update({ result: roundResult }, (error) => {
                if (error) {
                    alert('Error: change this error message')
                } else {
                    alert('success ??')
                }
            })
    }

    return (
        <View>
            <View>
                <Text>Admin View</Text>
            </View>
            {/* <button onClick={calculateGameweekResults}>
                <Text>Calculate gameweek results</Text>
            </button> */}
        </View>
    )
}
