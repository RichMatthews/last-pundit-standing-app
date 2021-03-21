import React, { useCallback, useMemo } from 'react'
import { Image, Text, View, Platform, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Player, SelectionComplete } from 'src/state/types'
import * as Images from 'src/images'

type Props = {
  selection: SelectionComplete
  currentPlayerView: any
  pendingGame: boolean
  roundLost: boolean
  theme: any
}

export const PreviousRound = ({ selection, currentPlayerView, pendingGame, roundLost, theme }: Props) => {
  const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)

  let { code: opponentTeamCode, name: opponentName } = selection.opponent
  let { code: userTeamCode, name: userTeamName } = selection

  const selectionGoals = pendingGame ? '-' : selection.goals
  const opponentGoals = pendingGame ? '-' : selection.opponent.goals
  let selectionImage = <Image source={Images[userTeamCode]} style={styles(theme).teamBadge} />
  let opponentImage = <Image source={Images[opponentTeamCode]} style={styles(theme).teamBadge} />

  const containerStyles = useMemo(
    () =>
      pendingGame
        ? [styles(theme).container, { opacity: pendingGame ? 0.5 : 1, marginTop: pendingGame ? 20 : 0 }]
        : styles(theme).container,
    [pendingGame, theme],
  )

  const userGoalsStyle = useMemo(
    () => (roundLost ? [styles(theme).goals, { color: 'red' }] : [styles(theme).goals, { color: '#00FF87' }]),
    [roundLost, theme],
  )

  const allRemainingPlayersHaveSelected = useCallback(() => {
    return currentGame.players
      .filter((p: Player) => !p.hasBeenEliminated)
      .every((p: Player) => p.rounds[p.rounds.length - 1].selection.complete)
  }, [currentGame.players])

  if (!allRemainingPlayersHaveSelected() && pendingGame && !currentPlayerView) {
    userTeamName = ''
    opponentName = ''
    selectionImage = <AntDesign name="questioncircleo" size={20} color={'grey'} />
    opponentImage = <AntDesign name="questioncircleo" size={20} color={'grey'} />
  }

  return selection.teamPlayingAtHome ? (
    <View style={containerStyles}>
      <View style={styles(theme).homeTeam}>
        <Text style={[styles(theme).homeTeamName]}>{userTeamName}</Text>
        {selectionImage}
      </View>
      <View style={styles(theme).centerGoals}>
        <Text style={userGoalsStyle}>{selectionGoals}</Text>
        <Text style={styles(theme).centerText}>|</Text>
        <Text style={styles(theme).goals}>{opponentGoals}</Text>
      </View>
      <View style={styles(theme).awayTeam}>
        {opponentImage}
        <Text style={[styles(theme).awayTeamName]}>{opponentName}</Text>
      </View>
    </View>
  ) : (
    <View style={containerStyles}>
      <View style={styles(theme).homeTeam}>
        <Text style={styles(theme).homeTeamName}>{opponentName}</Text>
        {opponentImage}
      </View>
      <View style={styles(theme).centerGoals}>
        <Text style={styles(theme).goals}>{opponentGoals}</Text>
        <Text style={styles(theme).centerText}>|</Text>
        <Text style={userGoalsStyle}>{selectionGoals}</Text>
      </View>
      <View style={styles(theme).awayTeam}>
        {selectionImage}
        <Text style={[styles(theme).awayTeamName]}>{userTeamName}</Text>
      </View>
    </View>
  )
}

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingVertical: 5,
      margin: 5,
      width: 300,
    },
    centerGoals: {
      backgroundColor: theme.purple,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'space-evenly',
      padding: 5,
      width: 50,
    },
    teamBadge: {
      height: 25,
      width: 25,
    },
    goals: {
      width: 15,
      color: theme.text.inverse,
      fontWeight: '700',
      textAlign: 'center',
      fontSize: 15,
    },
    centerText: {
      alignItems: 'center',
      color: theme.text.inverse,
      fontSize: 15,
    },
    homeTeam: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginRight: 10,
      width: 150,
    },
    awayTeam: {
      alignItems: 'center',
      flexDirection: 'row',
      width: 150,
      marginLeft: 10,
    },
    homeTeamName: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontWeight: '600',
      marginRight: 5,
      fontSize: 13,
    },
    awayTeamName: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontWeight: '600',
      marginLeft: 5,
      fontSize: 13,
    },
  })
