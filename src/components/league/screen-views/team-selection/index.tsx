import React from 'react'
import { Dimensions, Text, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { ChooseTeam } from 'src/components/league/choose-team'

const width = Dimensions.get('window').width

export const TeamSelection = ({ pullLatestLeagueData, setCurrentScreenView }) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame.currentGameRound
        const currentRound = currentPlayer.rounds[currentGameRound]
        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.choice.result === 'lost')

        if (playerOutOfGame.length) {
            return (
                <View>
                    <Text>You are no longer in this game</Text>
                </View>
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice === false) {
            return (
                <ChooseTeam
                    currentRound={currentGameRound}
                    pullLatestLeagueData={pullLatestLeagueData}
                    setCurrentScreenView={setCurrentScreenView}
                />
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice) {
            return (
                <View>
                    <Text style={{ alignSelf: 'center', fontSize: 18 }}>You have made your choice for this week</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>You didn't select a team in time and are unfortunately now out of this game.</Text>
                </View>
            )
        }
    }

    return (
        <View>
            <View style={styles.section}>
                <View style={{ marginTop: 20 }}>{showTeamSelectionPage()}</View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        alignSelf: 'center',
        width: width * 0.8,
    },
})
