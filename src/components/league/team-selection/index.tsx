import React, { useEffect, useState } from 'react'
import { Text, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { ChooseTeam } from 'src/components/league/choose-team'
import { gameweekSelectionTimeEnded } from 'src/utils/gameweekSelectionTimeEnded'

const NoLongerInGame = ({ theme }) => (
    <View>
        <Text style={[styles(theme).noLongerInGameText]}>You are no longer in this game</Text>
    </View>
)

export const TeamSelection = ({ closeTeamSelectionModal, pullLatestLeagueData, theme, fixtures }) => {
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

        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.selection.result === 'lost')
        const playerHasMadeChoice = currentRound && currentRound.selection.selection
        const playerHasNotMadeChoice = currentRound && !currentRound.selection.selection

        if (playerOutOfGame.length) {
            return <NoLongerInGame theme={theme} />
        } else if (gameSelectionTimeEnded && playerHasNotMadeChoice) {
            return (
                <View>
                    <Text style={styles(theme).text}>The deadline has passed and you are out of this game</Text>
                </View>
            )
        } else if (playerHasNotMadeChoice) {
            return (
                <ChooseTeam
                    closeTeamSelectionModal={closeTeamSelectionModal}
                    currentRound={currentGameRound}
                    fixtures={fixtures}
                    pullLatestLeagueData={pullLatestLeagueData}
                    theme={theme}
                />
            )
        } else if (playerHasMadeChoice) {
            return (
                <View>
                    <Text style={styles(theme).text}>You have made your choice for this week</Text>
                </View>
            )
        } else {
            return <NoLongerInGame theme={theme} />
        }
    }

    return <View>{showTeamSelectionPage()}</View>
}

const styles = (theme) =>
    StyleSheet.create({
        text: {
            alignSelf: 'center',
            color: theme.text.primary,
            fontSize: theme.text.large,
        },
        noLongerInGameText: {
            alignSelf: 'center',
            fontSize: theme.text.large,
        },
    })
