import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, Linking, TouchableOpacity, Platform, View, Alert } from 'react-native'
import { useSelector } from 'react-redux'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'
import { Fixtures } from 'src/components/fixtures'

import { updateUserGamweekChoice } from './api'
import { findOpponent } from './utils'
import { SelectionModal } from './selection-modal'
import { firebaseAuth, firebaseMessaging, firebaseDatabase } from '../../../../firebase'
import { current } from 'immer'

interface Props {
  currentRound: any
  pullLatestLeagueData: () => void
}

export const ChooseTeam = ({
  closeTeamSelectionModal,
  pullLatestLeagueData,
  fixtures,
  theme,
  setLoadingModalOpen,
}: any) => {
  const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
  const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
  const currentUser = useSelector((store: { user: any }) => store.user)
  const pushNotifications = useSelector((store: { pushNotifications: any }) => store.pushNotifications)
  const league = useSelector((store: { league: any }) => store.league)
  const user = useSelector((store: { user: any }) => store.user)
  const teams = calculateTeamsAllowedToPickForCurrentRound({
    currentGame,
    currentPlayer,
    leagueTeams: PREMIER_LEAGUE_TEAMS,
  })
  const playerHasMadeChoice = currentPlayer.rounds[currentPlayer.rounds.length - 1].selection.complete
  const [selectedTeam, setSelectedTeam] = useState<{ code: string; name: string; index: 0 }>()
  const [modalOpen, setModalOpen] = useState(false)
  const [opponent, setOpponent] = useState(null)

  const submitChoice = () => {
    if (!selectedTeam) {
      return
    }

    const { opponent: opponentData } = findOpponent(selectedTeam, fixtures)

    setOpponent(opponentData)
    setModalOpen(true)
  }

  const updateUserGamweekChoiceHelper = async () => {
    setLoadingModalOpen(true)
    const selection = {
      code: selectedTeam?.code,
      complete: true,
      name: selectedTeam?.name,
      opponent,
      result: 'pending',
    }

    closeTeamSelectionModal()

    await updateUserGamweekChoice({
      selection,
      gameId: currentGame.id,
      leagueId: league.id,
      playerId: user.id,
      roundId: currentPlayer.rounds[currentPlayer.rounds.length - 1].id,
    })
    await pullLatestLeagueData()
    setModalOpen(false)

    Toast.show({
      type: 'success',
      text1: 'Prediction successfully submitted!',
      text2:
        pushNotifications.status === 1
          ? "We'll notify you when others have selected"
          : "Click here if you'd like to be notified when others make their prediction",
      autoHide: false,
      topOffset: 50,
      props: { onPress: toastPressed, onHide: hideToast },
      // position: 'top',
    })
  }

  const hideToast = () => {
    Toast.hide()
  }

  const toastPressed = () => {
    Toast.hide()
    checkPermission()
  }

  const requestPermission = useCallback(async () => {
    const status = await firebaseMessaging().requestPermission()
    return (
      status === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
      status === firebaseMessaging.AuthorizationStatus.PROVISIONAL
    )
  }, [])

  const getToken = useCallback(async () => {
    let fcmToken = await firebaseMessaging().getToken()
    if (fcmToken) {
      if (currentUser) {
        await firebaseDatabase.ref(`users/${currentUser.id}`).update({ token: fcmToken })
      }
    } else {
      alert("We couldn't complete this action at this time. Please try again later")
    }
  }, [currentUser])

  const checkPermission = useCallback(async () => {
    const enabled = await firebaseMessaging().hasPermission()
    // 0 === denied
    if (enabled === 0) {
      Linking.openURL('app-settings:')
    }
    // 1 === AUTHORIZED, 2 === PROVISIONAL
    if (enabled === 1 || enabled === 2) {
      getToken()
    } else {
      const requestPermissionGranted = await requestPermission()
      if (requestPermissionGranted) {
        getToken()
      }
    }
  }, [getToken, requestPermission])

  return (
    <View style={styles(theme).innerContainer}>
      {modalOpen ? (
        <View style={styles(theme).button}>
          {selectedTeam && opponent && (
            <SelectionModal
              selectedTeam={selectedTeam}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              selectedTeamOpponent={opponent}
              theme={theme}
              updateUserGamweekChoiceHelper={updateUserGamweekChoiceHelper}
            />
          )}
        </View>
      ) : (
        <>
          <Fixtures
            playerHasMadeChoice={playerHasMadeChoice}
            fixtures={fixtures}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            chosenTeams={teams.filter((team) => team.chosen).map((team) => team['code'])}
            theme={theme}
          />
          <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice} activeOpacity={0.8}>
            <View style={styles(theme).buttonText}>
              <Text style={styles(theme).confirmSelectionText}>Confirm selection</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    alreadySelectedTeam: {
      opacity: 0.1,
    },
    button: {
      marginTop: 10,
    },
    buttonText: {
      backgroundColor: theme.purple,
      borderRadius: 5,
      padding: 10,
    },
    confirmSelectionText: {
      color: theme.text.inverse,
      fontWeight: '600',
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontSize: theme.text.large,
      textAlign: 'center',
    },
    image: {
      height: 50,
      width: 50,
    },
    selected: {
      opacity: 1,
    },
    unselected: {
      opacity: 0.2,
    },
    innerContainer: {
      flex: 1,
      alignSelf: 'center',
    },
  })
