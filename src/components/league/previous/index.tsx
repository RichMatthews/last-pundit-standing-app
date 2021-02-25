import React, { useCallback, useState } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { CachedResults } from './results'

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
            <ScrollView>
                {games
                    .sort((a, b) => a.leagueRound - b.leagueRound)
                    .map((game: Game) => {
                        const player: Player | undefined = Object.values(game.players).find(
                            (player: Player) => !player.hasBeenEliminated,
                        )

                        return (
                            <View style={styles(theme).previousGamesContainer}>
                                <View style={styles(theme).topRow}>
                                    <TouchableOpacity
                                        onPress={() => setGameIdViewingHelper(game.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View>
                                            <Text style={styles(theme).playerNameText}>{player.information.name}</Text>
                                            <Text style={styles(theme).winnerText}>Winner</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <View>
                                        <Text style={styles(theme).amountCorrectText}>{player.rounds.length}</Text>
                                        <Text style={styles(theme).correctText}>Correct</Text>
                                    </View>
                                </View>
                                <View>
                                    <View style={{ display: game.id === gameIdViewing ? 'flex' : 'none' }}>
                                        {Object.values(game.players).map((player: Player) => {
                                            return (
                                                <>
                                                    <View style={styles(theme).individualPlayerRounds}>
                                                        <Text
                                                            style={{
                                                                backgroundColor: theme.purple,
                                                                color: theme.text.inverse,
                                                                fontFamily: 'Hind',
                                                                fontWeight: '700',
                                                                paddingLeft: 5,
                                                                marginBottom: 5,
                                                            }}
                                                        >
                                                            {player.information.name}
                                                        </Text>
                                                        <CachedResults player={player} theme={theme} />
                                                    </View>
                                                </>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        )
                    })}
            </ScrollView>
        </View>
    ) : (
        <View style={styles(theme).container}>
            <Text>Previous games will show here after they are complete</Text>
        </View>
    )
}

export const CachedPreviousGames = React.memo(PreviousGames)

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            backgroundColor: theme.background.primary,
            borderRadius: 5,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 10,
            width: '100%',
            flexGrow: 1,
        },
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
            color: theme.text.primary,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontWeight: '500',
            fontSize: theme.text.large,
        },
        previousGamesContainer: {
            borderBottomWidth: 0.5,
            borderBottomColor: theme.borders.ƒrimary,
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
            backgroundColor: theme.background.secondary,
            flexDirection: 'column',
            marginBottom: 20,
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
