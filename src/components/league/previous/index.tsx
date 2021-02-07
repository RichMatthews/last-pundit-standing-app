import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from 'src/images'

type Player = {
    hasBeenEliminated: boolean
    name: string
    id: string
    rounds: []
}

type Game = {
    complete: boolean
    currentGameRound: number
    id: string
    players: any
}

interface Props {
    games: []
    theme: {}
}

export const PreviousGames = ({ games, theme }: Props) => {
    const [gameIdViewing, setGameIdViewing] = useState<string | null>(null)

    const setGameIdViewingHelper = useCallback(
        (gameId) => {
            if (gameId === gameIdViewing) {
                setGameIdViewing(null)
                return
            }
            setGameIdViewing(gameId)
        },
        [gameIdViewing],
    )

    return games.length ? (
        <View style={styles(theme).container}>
            {games.map((game: Game) => {
                const player: Player | undefined = Object.values(game.players).find(
                    (player: Player) => !player.hasBeenEliminated,
                )

                return (
                    <TouchableOpacity onPress={() => setGameIdViewingHelper(game.id)} activeOpacity={0.7}>
                        <View style={styles(theme).previousGamesContainer}>
                            <View style={styles(theme).topRow}>
                                <View>
                                    <Text style={styles(theme).playerNameText}>{player.name}</Text>
                                    <Text style={styles(theme).winnerText}>Winner</Text>
                                </View>

                                <View>
                                    <Text style={styles(theme).amountCorrectText}>{player.rounds.length}</Text>
                                    <Text style={styles(theme).correctText}>Correct</Text>
                                </View>
                            </View>
                            <View>
                                <View style={{ display: game.id === gameIdViewing ? 'flex' : 'none' }}>
                                    {Object.values(game.players).map((player: Player) => {
                                        return (
                                            <View style={styles(theme).individualPlayerRounds}>
                                                <Text>{player.name}</Text>
                                                <View style={styles(theme).playerContainer}>
                                                    {player.rounds.map((round) => {
                                                        return (
                                                            <View style={styles(theme).game}>
                                                                <FastImage
                                                                    source={
                                                                        Images[
                                                                            round.choice.value
                                                                                .replace(/\s/g, '')
                                                                                .toLowerCase()
                                                                        ]
                                                                    }
                                                                    style={styles(theme).userChoiceImage}
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
                                                                    style={styles(theme).userOpponentImage}
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
        container: {},
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
            justifyContent: 'space-between',
        },
        playerContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
        },
        individualPlayerRounds: {
            flexDirection: 'column',
            marginVertical: 10,
        },
        game: {
            flexDirection: 'row',
            marginVertical: 5,
            marginRight: 10,
        },
        winnerText: {
            color: '#aaa',
            marginVertical: 5,
        },
        userChoiceImage: {
            width: 20,
            height: 20,
            marginRight: 5,
        },
        userOpponentImage: {
            width: 20,
            height: 20,
            marginLeft: 5,
            opacity: 0.25,
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
    })
