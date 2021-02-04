import React, { useEffect, useState } from 'react'
import { Dimensions, Image, Text, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { ChooseTeam } from 'src/components/league/choose-team'
import { gameweekSelectionTimeEnded } from 'src/utils/gameweekSelectionTimeEnded'

const width = Dimensions.get('window').width

const NoLongerInGame = ({ theme }) => (
    <View>
        <Text style={{ alignSelf: 'center', color: theme.text.primary, fontSize: 18 }}>
            You are no longer in this game
        </Text>
    </View>
)

export const TeamSelection = ({ flip, setFlip, pullLatestLeagueData, theme, setCurrentScreenView }) => {
    const [gameSelectionTimeEnded, setGameSelectionTimeEnded] = useState(false)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
    const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)

    useEffect(() => {
        checkIfTimeEnded()
    }, [])

    const checkIfTimeEnded = async () => {
        const timeHasEnded = await gameweekSelectionTimeEnded(currentGameweek.ends)

        if (timeHasEnded) {
            setGameSelectionTimeEnded(true)
        }
    }

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame.currentGameRound
        const currentRound = currentPlayer.rounds[currentGameRound]
        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.choice.result === 'lost')
        const playerHasMadeChoice = currentRound && currentRound.choice.hasMadeChoice
        const playerHasNotMadeChoice = currentRound && !currentRound.choice.hasMadeChoice

        if (playerOutOfGame.length) {
            return <NoLongerInGame theme={theme} />
        } else if (gameSelectionTimeEnded && playerHasNotMadeChoice) {
            return (
                <View>
                    <Text style={{ alignSelf: 'center', color: theme.text.primary, fontSize: 18 }}>
                        The deadline has passed and you are out of this game
                    </Text>
                </View>
            )
        } else if (playerHasNotMadeChoice) {
            return (
                <ChooseTeam
                    setFlip={setFlip}
                    flip={flip}
                    currentRound={currentGameRound}
                    pullLatestLeagueData={pullLatestLeagueData}
                    setCurrentScreenView={setCurrentScreenView}
                />
            )
        } else if (playerHasMadeChoice) {
            return (
                <View>
                    <Text style={{ alignSelf: 'center', color: theme.text.primary, fontSize: 18 }}>
                        You have made your choice for this week
                    </Text>
                </View>
            )
        } else {
            return <NoLongerInGame theme={theme} />
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
