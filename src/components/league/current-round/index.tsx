import React from 'react'
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'

import { PreviousRound } from '../../previous-round'
import { MemoizedShowImageForPlayerChoice } from '../show-image-for-player-choice'

interface PlayerProps {
    id: string
    name: string
}

export const CurrentRoundView = ({ listOfExpandedPrevious, setListOfExpandedPreviousHelper, theme }: any) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)

    return (
        <View style={styles(theme).container}>
            {Object.values(currentGame.players).map((player: any, index: number) => (
                <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                    <View key={player.id} style={styles(theme).playerContainer}>
                        <View style={styles(theme).playerRow}>
                            <Text style={styles(theme).playerName}>{player.name}</Text>
                            <View style={styles(theme).playerChosenImageAndDownArrow}>
                                <MemoizedShowImageForPlayerChoice
                                    currentGame={currentGame}
                                    isCurrentLoggedInPlayer={player.id === user.id}
                                    player={player}
                                />

                                {listOfExpandedPrevious.includes(index) ? (
                                    <FastImage
                                        source={require('src/images/other/down-arrow.png')}
                                        style={styles(theme).image}
                                    />
                                ) : (
                                    <FastImage
                                        source={require('src/images/other/down-arrow.png')}
                                        style={styles(theme).image}
                                    />
                                )}
                            </View>
                        </View>
                        <Collapsible collapsed={!listOfExpandedPrevious.includes(index)} duration={250}>
                            <View>
                                {player.rounds.length > 0 ? (
                                    <>
                                        {player.rounds
                                            .filter(
                                                (round: any) => round.choice.value && round.choice.result !== 'pending',
                                            )
                                            .map((round: any) => (
                                                <PreviousRound choice={round.choice} theme={theme} />
                                            ))}
                                    </>
                                ) : (
                                    <View>
                                        <Text>Previous results will show here after Round 1</Text>
                                    </View>
                                )}
                            </View>
                        </Collapsible>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            width: '100%',
        },
        image: {
            width: 10,
            height: 10,
        },
        playerContainer: {
            backgroundColor: theme.background.primary,
            borderRadius: theme.borders.radius,
            padding: 10,
            margin: 12,
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 4,
            shadowOpacity: 0.09,
            elevation: 4,
        },
        playerRow: {
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        playerName: {
            // color: player.id === user.id ? theme.tint.active : theme.text.primary,
            fontSize: theme.text.large,
        },
        playerChosenImageAndDownArrow: {
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
    })
