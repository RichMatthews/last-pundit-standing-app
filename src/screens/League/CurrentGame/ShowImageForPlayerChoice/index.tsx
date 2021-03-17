import React, { useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'

import * as Images from 'app/src/images'

import { gameweekSelectionTimeEnded } from 'src/utils/gameweekSelectionTimeEnded'

const isIos = Platform.OS === 'ios'

const playerStatus = {
  eliminated: {
    bgColor: '#F8D7DA',
    color: '#721C25',
    text: 'Eliminated',
  },
  pending: {
    bgColor: '#FFF3CD',
    color: '#ba7918',
    text: 'Pending',
  },
  submitted: {
    bgColor: '#D4EDDA',
    color: '#155725',
    text: 'Submitted',
  },
  currentPending: {
    bgColor: '#FFF3CD',
    color: '#ba7918',
    text: 'Tap to make your prediction',
  },
}
const GameStatusIndicatorComponent = (status: string, showTeamSelection = null) => (
  <View>
    <View style={gameStatusIndicatorStyles(playerStatus[status].bgColor).labelWrapper}>
      <TouchableOpacity onPress={() => (showTeamSelection ? showTeamSelection() : null)} activeOpacity={1}>
        <Text style={gameStatusIndicatorStyles(undefined, playerStatus[status].color).labelText}>
          {playerStatus[status].text}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)

export const MemoizedShowImageForPlayerChoice = ({
  currentGame,
  isCurrentLoggedInPlayer,
  player: currentPlayer,
  showTeamSelection,
}: any) => {
  const [gameSelectionTimeEnded, setGameSelectionTimeEnded] = useState(false)
  const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)

  const checkIfTimeEnded = useCallback(async () => {
    const timeHasEnded = await gameweekSelectionTimeEnded(currentGameweek.ends)

    if (timeHasEnded) {
      setGameSelectionTimeEnded(true)
    }
  }, [currentGameweek.ends])

  useEffect(() => {
    checkIfTimeEnded()
  }, [checkIfTimeEnded])

  const currentPlayerOutOfCurrentGame = currentPlayer.rounds.some((round: any) => round.selection.result === 'lost')
  const currentGameRound = currentPlayer.rounds.length - 1
  const currentPlayerCurrentRound = currentPlayer.rounds[currentGameRound]
  const currentGameRemainingPlayers: any = currentGame.players.filter((p: any) => !p.hasBeenEliminated)
  const allCurrentGameRemainingPlayersHaveMadeSelection = currentGameRemainingPlayers.every(
    (p: any) => p.rounds[currentGameRound].selection.complete,
  )

  if (
    currentPlayerCurrentRound === undefined ||
    (gameSelectionTimeEnded && !currentPlayerCurrentRound.selection.complete) ||
    currentPlayerOutOfCurrentGame
  ) {
    return GameStatusIndicatorComponent('eliminated')
  }

  if (isCurrentLoggedInPlayer) {
    if (currentPlayerCurrentRound.selection && currentPlayerCurrentRound.selection.complete) {
      return <FastImage style={styles.clubBadge} source={Images[currentPlayerCurrentRound.selection.code]} />
    } else {
      return GameStatusIndicatorComponent('currentPending', showTeamSelection)
    }
  }

  if (currentPlayerCurrentRound.selection && currentPlayerCurrentRound.selection.complete) {
    if (allCurrentGameRemainingPlayersHaveMadeSelection) {
      return <FastImage style={styles.clubBadge} source={Images[currentPlayerCurrentRound.selection.code]} />
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
    labelWrapper: {
      borderRadius: 5,
      backgroundColor: bgColor,
    },
    labelText: {
      fontSize: 10,
      padding: 5,
      color: textColor,
      fontFamily: isIos ? 'Hind' : 'Hind-Regular',
    },
  })
