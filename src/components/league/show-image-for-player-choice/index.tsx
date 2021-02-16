import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'

import * as Images from '../../../images'

import { gameweekSelectionTimeEnded } from 'src/utils/gameweekSelectionTimeEnded'

const isIos = Platform.OS === 'ios'

// I do not like this
const GameStatusIndicatorComponent = (status: string) => {
    const playerStatus = {
        eliminated: {
            bgColor: '#F8D7DA',
            color: '#721C25',
            text: 'Eliminated',
        },
        pending: {
            bgColor: '#FFF3CD',
            color: '#856404',
            text: 'Pending',
        },
        submitted: {
            bgColor: '#D4EDDA',
            color: '#155725',
            text: ' Submitted',
        },
        currentPending: {
            bgColor: '#FFF3CD',
            color: '#856404',
            text: 'Awaiting your prediction',
        },
        champion: {
            bgColor: '#FFF3CD',
            color: '#856404',
            text: 'Champion',
        },
    }

    return (
        <View style={gameStatusIndicatorStyles().gameStatusIndicator}>
            <View style={gameStatusIndicatorStyles(playerStatus[status].bgColor).labelWrapper}>
                <Text style={gameStatusIndicatorStyles(undefined, playerStatus[status].textColor).labelText}>
                    {playerStatus[status].text}
                </Text>
            </View>
        </View>
    )
}

export const MemoizedShowImageForPlayerChoice = ({ currentGame, isCurrentLoggedInPlayer, player }: any) => {
    const [gameSelectionTimeEnded, setGameSelectionTimeEnded] = useState(false)
    const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)
    console.log('is it:', isCurrentLoggedInPlayer)
    useEffect(() => {
        checkIfTimeEnded()
    }, [])

    const checkIfTimeEnded = async () => {
        const timeHasEnded = await gameweekSelectionTimeEnded(currentGameweek.ends)

        if (timeHasEnded) {
            setGameSelectionTimeEnded(true)
        }
    }
    const PLAYER_OUT_OF_CURRENT_GAME = player.rounds.filter((round: any) => round.selection.result === 'lost')
    const ALL_PLAYERS_IN_CURRENT_GAME = Object.values(currentGame.players)
    const CURRENT_ROUND_WITHIN_CURRENT_GAME = currentGame.currentGameRound

    const OTHER_PLAYERS_EXCEPT_CURRENT_LOGGED_IN_PLAYER = ALL_PLAYERS_IN_CURRENT_GAME.filter(
        (play: any) => play.id !== player.information.id,
    )
    const ALL_OTHER_PLAYERS_ELIMINATED = OTHER_PLAYERS_EXCEPT_CURRENT_LOGGED_IN_PLAYER.every(
        (playa: any) => playa.hasBeenEliminated,
    )
    const PLAYER_CURRENT_ROUND = player.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME]
    const REMAINING_PLAYERS_IN_CURRENT_GAME: any = ALL_PLAYERS_IN_CURRENT_GAME.filter(
        (playa: any) => playa.rounds.length === CURRENT_ROUND_WITHIN_CURRENT_GAME + 1,
    )
    const ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE = REMAINING_PLAYERS_IN_CURRENT_GAME.every(
        (playa: any) => playa.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME].selection.selection,
    )

    if (ALL_OTHER_PLAYERS_ELIMINATED && ALL_PLAYERS_IN_CURRENT_GAME.length > 1) {
        return GameStatusIndicatorComponent('champion')
    }

    if (
        PLAYER_CURRENT_ROUND === undefined ||
        (gameSelectionTimeEnded && !PLAYER_CURRENT_ROUND.selection.selection) ||
        (!gameSelectionTimeEnded && PLAYER_OUT_OF_CURRENT_GAME.length)
    ) {
        return GameStatusIndicatorComponent('eliminated')
    }

    if (isCurrentLoggedInPlayer) {
        if (PLAYER_CURRENT_ROUND.selection.complete) {
            return (
                <FastImage
                    style={styles.clubBadge}
                    source={Images[PLAYER_CURRENT_ROUND.selection.code.toUpperCase()]}
                />
            )
        } else {
            return GameStatusIndicatorComponent('currentPending')
        }
    }

    if (PLAYER_CURRENT_ROUND.selection.complete) {
        if (ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE) {
            return (
                <FastImage
                    style={styles.clubBadge}
                    source={Images[PLAYER_CURRENT_ROUND.selection.code.toUpperCase()]}
                />
            )
        } else {
            return GameStatusIndicatorComponent('submitted')
        }
    } else {
        return GameStatusIndicatorComponent('pending')
    }
}

const styles = StyleSheet.create({
    clubBadge: { width: 25, height: 25, marginRight: 10 },
})

const gameStatusIndicatorStyles = (bgColor?: string, textColor?: string) =>
    StyleSheet.create({
        gameStatusIndicator: {
            marginRight: 10,
        },
        labelWrapper: {
            borderRadius: 5,
            backgroundColor: bgColor,
        },
        labelText: {
            fontSize: 10,
            padding: 5,
            color: textColor,
            fontFamily: isIos ? 'Hind' : 'Hind-Bold',
        },
    })
