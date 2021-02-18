import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from 'src/images'

export const Results = ({ player, theme }) => (
    <View style={styles(theme).playerResultsContainer}>
        {player.rounds.map((round) => {
            const { opponent: playerChoiceOpponent, code: playerChoice } = round.selection
            const playerChoicePlayingAtHome = round.selection.teamPlayingAtHome
            const playerChoiceOpponentImage = Images[playerChoiceOpponent.code]
            const playerChoiceImage = Images[playerChoice]
            let homeImage, awayImage

            if (playerChoicePlayingAtHome) {
                homeImage = playerChoiceImage
                awayImage = playerChoiceOpponentImage
            } else {
                homeImage = playerChoiceOpponentImage
                awayImage = playerChoiceImage
            }

            return (
                <View style={styles(theme).game}>
                    <FastImage
                        source={homeImage}
                        style={[styles(theme).homeImage, { opacity: playerChoicePlayingAtHome ? 1 : 0.25 }]}
                    />
                    <Text>{playerChoicePlayingAtHome ? round.selection.goals : round.selection.opponent.goals}</Text>
                    <Text>-</Text>
                    <Text>{!playerChoicePlayingAtHome ? round.selection.goals : round.selection.opponent.goals}</Text>
                    <FastImage
                        source={awayImage}
                        style={[styles(theme).awayImage, { opacity: playerChoicePlayingAtHome ? 0.25 : 1 }]}
                    />
                </View>
            )
        })}
    </View>
)

export const CachedResults = React.memo(Results)

const styles = (theme: any) =>
    StyleSheet.create({
        amountCorrectText: {
            color: theme.text.primary,
            fontSize: theme.text.xlarge,
            textAlign: 'center',
        },
        playerResultsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        game: {
            flexDirection: 'row',
            marginVertical: 5,
            marginRight: 10,
        },
        homeImage: {
            width: 20,
            height: 20,
            marginRight: 5,
        },
        awayImage: {
            width: 20,
            height: 20,
            marginLeft: 5,
        },
    })
