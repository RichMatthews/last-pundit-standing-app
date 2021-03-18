import React, { useCallback, useEffect, useState, useRef } from 'react'
import { ActivityIndicator, AppState, StyleSheet, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Portal } from 'react-native-portalize'

import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'

import { CachedPreviousGames } from './PreviousGames'
import { pullLeagueData, getCurrentGameweekFixtures } from './api'
import { CurrentGame } from './CurrentGame'
import { TeamSelectionModal } from './TeamSelectionModal'

interface LeagueData {
  games: {}
}

export const League = ({ leagueId, theme }: string) => {
  const [loaded, setLoaded] = useState<string>('')
  const [gameweekFixtures, setGameweekFixtures] = useState([])
  const [showCurrent, setShowCurrent] = useState(true)
  const [loadingModalOpen, setLoadingModalOpen] = useState(false)
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false)

  const dispatch = useDispatch()
  const currentUser = useSelector((store: { user: any }) => store.user)
  const league = useSelector((store: { league: any }) => store.league)
  const teamSelectionRef = useRef<Modalize>(null)
  const appState = useRef(AppState.currentState)

  const pullLatestLeagueData = useCallback(async () => {
    const leagueData: LeagueData = await pullLeagueData({ leagueId })
    let transformedData = {
      ...leagueData,
      games: Object.values(leagueData.games).map((game) => {
        return {
          ...game,
          players: Object.values(game.players).map((player) => {
            return { ...player, rounds: Object.values(player.rounds).sort((a, b) => a.round - b.round) }
          }),
        }
      }),
    }

    const currentGame: any = transformedData.games.find((game: any) => !game.complete)
    const players: Array<{ id: string }> = Object.values(currentGame.players)
    const currentPlayer = players.find((player) => player.information.id === currentUser.id)

    dispatch(getCurrentGame({ currentGame }))
    dispatch(setViewedLeague(transformedData))
    await dispatch(getCurrentGameWeekInfo())
    if (currentPlayer) {
      dispatch(setCurrentPlayer({ currentPlayer }))
    }

    if (leagueData) {
      setLoaded('league-found')
    } else {
      setLoaded('no-league-found')
    }
  }, [currentUser.id, dispatch, leagueId])

  const appStateListener = useCallback(
    (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        pullLatestLeagueData()
      }

      appState.current = nextAppState
    },
    [pullLatestLeagueData],
  )

  useEffect(() => {
    AppState.addEventListener('change', appStateListener)

    return () => {
      AppState.removeEventListener('change', appStateListener)
    }
  }, [appStateListener])

  useEffect(() => {
    async function fetchFixtures() {
      const fixtures: any = await getCurrentGameweekFixtures()
      setGameweekFixtures(fixtures)
    }
    fetchFixtures()
  }, [])

  useEffect(() => {
    pullLatestLeagueData()
  }, [pullLatestLeagueData])

  const showTeamSelection = () => {
    teamSelectionRef.current?.open()
  }

  const closeTeamSelectionModal = () => {
    teamSelectionRef.current?.close()
  }

  return loaded ? (
    <>
      <SafeAreaView style={styles(theme).safeAreaView} />

      <View style={styles(theme).outerContainer}>
        <Text style={styles(theme).mainheading}>{league.name}</Text>
        <TouchableOpacity
          onPress={showTeamSelection}
          style={{ padding: 5, borderBottomWidth: 1, borderColor: theme.borders.primary, borderRadius: 5 }}
          activeOpacity={0.7}
        >
          <Text style={{ color: theme.text.primary, fontSize: 12 }}>View fixtures</Text>
        </TouchableOpacity>
      </View>

      <View style={styles(theme).container}>
        <View style={styles(theme).gameContainer}>
          <TouchableOpacity onPress={() => setShowCurrent(true)} activeOpacity={0.7}>
            <View
              style={[
                styles(theme).currentRoundHeadingBackgroundStyles,
                { backgroundColor: showCurrent ? theme.purple : theme.background.primary },
              ]}
            >
              <Text
                style={[
                  styles(theme).currentRoundHeading,
                  { color: showCurrent ? theme.text.inverse : theme.text.primary },
                ]}
              >
                Current Game
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCurrent(false)} activeOpacity={0.7}>
            <View
              style={[
                styles(theme).currentRoundHeadingBackgroundStyles,
                { backgroundColor: !showCurrent ? theme.purple : theme.background.primary },
              ]}
            >
              <Text
                style={[
                  styles(theme).currentRoundHeading,
                  { color: !showCurrent ? theme.text.inverse : theme.text.primary },
                ]}
              >
                Previous Games
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <CurrentGame
          display={showCurrent ? 'flex' : 'none'}
          loaded={loaded}
          theme={theme}
          showCurrent={showCurrent}
          setShowCurrent={setShowCurrent}
          showTeamSelection={showTeamSelection}
        />
        <CachedPreviousGames
          display={showCurrent ? 'none' : 'flex'}
          games={Object.values(league.games).filter((game: any) => game.complete)}
          theme={theme}
        />

        <Portal>
          <TeamSelectionModal
            closeTeamSelectionModal={closeTeamSelectionModal}
            showConfirmationScreen={showConfirmationScreen}
            setShowConfirmationScreen={setShowConfirmationScreen}
            loadingModalOpen={loadingModalOpen}
            gameweekFixtures={gameweekFixtures}
            setLoadingModalOpen={setLoadingModalOpen}
            pullLatestLeagueData={pullLatestLeagueData}
            theme={theme}
            ref={teamSelectionRef}
          />
        </Portal>
      </View>
    </>
  ) : (
    <View style={{ flex: 1, backgroundColor: theme.background.primary, alignItems: 'center', paddingTop: 100 }}>
      <ActivityIndicator size="small" color={theme.spinner.primary} />
      <Text style={styles(theme).loadingText}>Retrieving League information...</Text>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    safeAreaView: {
      flex: 0,
      backgroundColor: theme.background.secondary,
    },
    outerContainer: {
      backgroundColor: theme.background.secondary,
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: 10,
    },
    container: {
      backgroundColor: theme.background.secondary,
      flex: 1,
    },
    currentRoundHeadingBackgroundStyles: {
      borderRadius: 20,
      padding: 10,
      width: 150,
    },
    gameContainer: {
      backgroundColor: theme.background.primary,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 20,
      justifyContent: 'space-between',
      marginVertical: 10,
      marginBottom: 20,
      alignSelf: 'center',
      shadowOpacity: 1,
      shadowRadius: 3,
      shadowColor: theme.background.secondary,
      shadowOffset: { height: 2, width: 0 },
    },
    currentRoundHeading: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    loadingText: {
      color: theme.text.primary,
      fontSize: 15,
    },
    image: {
      resizeMode: 'contain',
      height: 30,
      width: 100,
      marginBottom: 20,
    },
    mainheading: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontSize: 30,
      fontWeight: '700',
    },
    maintext: {
      fontSize: theme.text.large,
      fontWeight: '700',
      textAlign: 'center',
    },
    subtext: {
      fontWeight: '400',
    },
    topContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 15,
      marginVertical: 15,
    },
    ctaContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      padding: 5,
    },
    openModalButton: {
      width: 110,
      alignItems: 'center',
      backgroundColor: theme.background.primary,
      borderRadius: 5,
      padding: 5,
      margin: 10,
    },
    openModalButtonText: {
      textAlign: 'center',
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontWeight: '700',
      fontSize: theme.text.small,
    },
    fixturesWrapper: {
      flex: 1,
      justifyContent: 'space-between',
      margin: 30,
    },
  })
