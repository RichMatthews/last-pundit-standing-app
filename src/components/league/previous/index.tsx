import React, { useCallback, useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Results } from './results'

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
                                                <Results player={player} theme={theme} />
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
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontSize: theme.text.small,
            textAlign: 'center',
        },
        playerNameText: {
            color: '#9f85d4',
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontSize: theme.text.large,
        },
        previousGamesContainer: {
            borderBottomWidth: 0.5,
            borderBottomColor: '#9f85d4',
            borderRadius: 5,
            padding: 10,
            margin: 10,
            display: 'flex',
            justifyContent: 'space-between',
        },
        playerResultsContainer: {
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
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
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
        },
        topRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
        },
    })
