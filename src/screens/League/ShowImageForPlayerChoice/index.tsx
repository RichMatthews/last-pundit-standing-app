import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Platform } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'

import * as Images from '../../../images'

import { gameweekSelectionTimeEnded } from 'src/utils/gameweekSelectionTimeEnded'
import { TouchableOpacity } from 'react-native-gesture-handler'

const isIos = Platform.OS === 'ios'

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
    text: 'Tap to make your prediction',
  },
  champion: {
    bgColor: '#FFF3CD',
    color: '#856404',
    text: 'Champion',
  },
}
const GameStatusIndicatorComponent = (status: string, showTeamSelection = null) => (
  <View style={gameStatusIndicatorStyles().gameStatusIndicator}>
    <View style={gameStatusIndicatorStyles(playerStatus[status].bgColor).labelWrapper}>
      <TouchableOpacity onPress={() => (showTeamSelection ? showTeamSelection() : null)} activeOpacity={1}>
        <Text style={gameStatusIndicatorStyles(undefined, playerStatus[status].textColor).labelText}>
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

  useEffect(() => {
    checkIfTimeEnded()
  }, [])

  const checkIfTimeEnded = async () => {
    const timeHasEnded = await gameweekSelectionTimeEnded(currentGameweek.ends)

    if (timeHasEnded) {
      setGameSelectionTimeEnded(true)
    }
  }

  const currentPlayerOutOfCurrentGame = currentPlayer.rounds.some((round: any) => round.selection.result === 'lost')
  const currentGamePlayers = Object.values(currentGame.players)
  const currentGameRound = currentPlayer.rounds.length - 1
  const currentPlayerCurrentRound = currentPlayer.rounds[currentGameRound]
  const currentGameRemainingPlayers: any = currentGamePlayers.filter((p: any) => !p.hasBeenEliminated)
  const allCurrentGameRemainingPlayersHaveMadeSelection = currentGameRemainingPlayers.every(
    (playa: any) => playa.rounds[currentGameRound].selection.complete,
  )

  if (
    currentPlayerCurrentRound === undefined ||
    (gameSelectionTimeEnded && !currentPlayerCurrentRound.selection.complete) ||
    currentPlayerOutOfCurrentGame
  ) {
    return GameStatusIndicatorComponent('eliminated')
  }

  if (isCurrentLoggedInPlayer) {
    if (currentPlayerCurrentRound.selection.complete) {
      return <FastImage style={styles.clubBadge} source={Images[currentPlayerCurrentRound.selection.code]} />
    } else {
      return GameStatusIndicatorComponent('currentPending', showTeamSelection)
    }
  }

  if (currentPlayerCurrentRound.selection.complete) {
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
