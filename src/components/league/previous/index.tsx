import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import * as Images from 'src/images'

interface Props {
    games: []
    theme: {}
}

export const PreviousGames = ({ games, theme }: Props) => {
    return games.length ? (
        <View style={styles(theme).container}>
            {games.map((game) => {
                const player = Object.values(game.players).find((player) => !player.hasBeenEliminated)
                return (
                    <View style={styles(theme).previousGamesContainer}>
                        <View>
                            <Text style={styles(theme).playerNameText}>{player.name}</Text>
                            <Text style={styles(theme).winnerText}>Winner</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {player.rounds.map((playa) => (
                                    <>
                                        {console.log(playa, 'p')}
                                        <FastImage
                                            source={Images[playa.choice.value.replace(/\s/g, '').toLowerCase()]}
                                            style={{ width: 20, height: 20, marginRight: 5 }}
                                        />
                                    </>
                                ))}
                            </View>
                        </View>
                        <View>
                            <Text style={styles(theme).amountCorrectText}>{player.rounds.length}</Text>
                            <Text style={styles(theme).correctText}>Correct</Text>
                        </View>
                    </View>
                )
            })}
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
        },
        winnerText: {
            color: '#aaa',
            marginVertical: 5,
        },
    })
