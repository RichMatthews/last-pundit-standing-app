import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
    games: []
    theme: {}
}

export const PreviousGames = ({ games, theme }: Props) => {
    return games.length ? (
        <View style={styles(theme).container}>
            {games.map((game) => (
                <View style={styles(theme).previousGamesContainer}>
                    <View>
                        <Text style={styles(theme).playerNameText}>
                            {Object.values(game.players).find((player) => !player.hasBeenEliminated).name}
                        </Text>
                        <Text style={styles(theme).winnerText}>Winner</Text>
                    </View>
                    <View>
                        <Text style={styles(theme).amountCorrectText}>
                            {Object.values(game.players).find((player) => !player.hasBeenEliminated).rounds.length}
                        </Text>
                        <Text style={styles(theme).correctText}>Correct</Text>
                    </View>
                </View>
            ))}
        </View>
    ) : (
        <View style={styles(theme).container}>
            <Text>Previous games will show here after they are complete</Text>
        </View>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            width: '100%',
        },
        amountCorrectText: {
            color: theme.text.primary,
            fontSize: theme.text.xlarge,
            textAlign: 'center',
        },
        correctText: {
            color: theme.text.primary,
            fontSize: theme.text.xsmall,
            textAlign: 'center',
        },
        playerNameText: {
            color: theme.text.primary,
            fontSize: theme.text.large,
        },
        previousGamesContainer: {
            backgroundColor: theme.background.primary,
            borderRadius: 5,
            padding: 10,
            margin: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 4,
            shadowOpacity: 0.09,
            elevation: 4,
        },
        winnerText: {
            color: '#aaa',
        },
    })
