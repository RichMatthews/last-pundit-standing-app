import React from 'react'
import { Dimensions, Text, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { ChooseTeam } from 'src/components/league/choose-team'

const width = Dimensions.get('window').width

export const TeamSelection = ({ pullLatestLeagueData, theme, setCurrentScreenView }) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame.currentGameRound
        const currentRound = currentPlayer.rounds[currentGameRound]
        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.choice.result === 'lost')
        const playerOutOfTime = false

        if (playerOutOfGame.length) {
            return (
                <View>
                    <Text>You are no longer in this game</Text>
                </View>
            )
        } else if (playerOutOfTime) {
            return (
                <View>
                    <Text style={{ alignSelf: 'center', color: theme.text.primary, fontSize: 18 }}>
                        The deadline has passed and you are out of this game
                    </Text>
                </View>
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice === true) {
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
                    <Text style={{ alignSelf: 'center', color: theme.text.primary, fontSize: 18 }}>
                        You have made your choice for this week
                    </Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text style={{ alignSelf: 'center', color: theme.text.primary, fontSize: 18 }}>
                        You are no longer in this game
                    </Text>
                </View>
            )
        }
    }

    return <View style={styles.section}>{showTeamSelectionPage()}</View>
}

const styles = StyleSheet.create({
    section: {
        alignSelf: 'center',
        height: '100%',
        marginTop: 30,
        width: width * 0.8,
    },
})
