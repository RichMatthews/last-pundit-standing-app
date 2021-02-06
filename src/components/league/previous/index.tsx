import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from 'src/images'

interface Props {
    games: []
    theme: {}
}

export const PreviousGames = ({ games, theme }: Props) => {
    const [gameIdViewing, setGameIdViewing] = useState(null)

    return games.length ? (
        <View style={styles(theme).container}>
            {games.map((game) => {
                const player = Object.values(game.players).find((player) => !player.hasBeenEliminated)
                console.log(game.id, gameIdViewing, 'the game?')
                return (
                    <TouchableOpacity onPress={() => setGameIdViewing(game.id)} activeOpacity={0.7}>
                        <View style={styles(theme).previousGamesContainer}>
                            <View>
                                <View>
                                    <Text style={styles(theme).playerNameText}>{player.name}</Text>
                                    <Text style={styles(theme).winnerText}>Winner</Text>
                                    {game.id !== gameIdViewing && (
                                        <View style={{ flexDirection: 'row' }}>
                                            {player.rounds.map((playa) => (
                                                <>
                                                    <FastImage
                                                        source={
                                                            Images[playa.choice.value.replace(/\s/g, '').toLowerCase()]
                                                        }
                                                        style={{ width: 20, height: 20, marginRight: 5 }}
                                                    />
                                                </>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'column',
                                        display: game.id === gameIdViewing ? 'flex' : 'none',
                                    }}
                                >
                                    {Object.values(game.players).map((player) => {
                                        return (
                                            <View
                                                style={{
                                                    flexDirection: 'column',
                                                    marginVertical: 10,
                                                }}
                                            >
                                                <Text>{player.name}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    {player.rounds.map((round) => {
                                                        return (
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    marginVertical: 5,
                                                                    marginRight: 10,
                                                                }}
                                                            >
                                                                <FastImage
                                                                    source={
                                                                        Images[
                                                                            round.choice.value
                                                                                .replace(/\s/g, '')
                                                                                .toLowerCase()
                                                                        ]
                                                                    }
                                                                    style={{
                                                                        width: 20,
                                                                        height: 20,
                                                                        marginRight: 5,
                                                                    }}
                                                                />
                                                                <Text>{round.choice.goals}</Text>
                                                                <Text>-</Text>
                                                                <Text>{round.choice.opponent.goals}</Text>
                                                                <FastImage
                                                                    source={
                                                                        Images[
                                                                            round.choice.opponent.name
                                                                                .replace(/\s/g, '')
                                                                                .toLowerCase()
                                                                        ]
                                                                    }
                                                                    style={{ width: 20, height: 20, marginLeft: 5 }}
                                                                />
                                                            </View>
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                            {game.id !== gameIdViewing && (
                                <View>
                                    <Text style={styles(theme).amountCorrectText}>{player.rounds.length}</Text>
                                    <Text style={styles(theme).correctText}>Correct</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
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
            color: 'purple',
            fontSize: theme.text.large,
        },
        previousGamesContainer: {
            borderBottomWidth: 0.5,
            borderBottomColor: 'purple',
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
