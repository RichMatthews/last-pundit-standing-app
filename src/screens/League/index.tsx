import React, { useCallback, useEffect, useState, useRef } from 'react'
import { ActivityIndicator, AppState, StyleSheet, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import LinearGradient from 'react-native-linear-gradient'

import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'
import { Game, Player } from 'src/state/types'

import { CachedPreviousGames } from './PreviousGames'
import { pullLeagueData, getCurrentGameweekFixtures, getFutureGameweekInformation } from './api'
import { CurrentGame } from './CurrentGame'
import { TeamSelectionModal } from './TeamSelectionModal'
import { PreviousRound } from './CurrentGame/PreviousRound'
import { LeagueStats } from './Stats'

interface Props {
  leagueId: string
  theme: any
}

export const League = ({ leagueId, theme }: Props) => {
  const [loaded, setLoaded] = useState<string>('')
  const [gameweekFixtures, setGameweekFixtures] = useState([])
  const [subScreen, setShowSubScreen] = useState('current')
  const [loadingModalOpen, setLoadingModalOpen] = useState(false)
  const [showConfirmationScreen, setShowConfirmationScreen] = useState(false)

  const dispatch = useDispatch()
  const currentUser = useSelector((store: { user: any }) => store.user)
  const league = useSelector((store: { league: any }) => store.league)
  const teamSelectionRef = useRef<Modalize>(null)
  const appState = useRef(AppState.currentState)

  const pullLatestLeagueData = useCallback(async () => {
    const leagueData = await pullLeagueData({ leagueId })
    const transformedData = {
      ...leagueData,
      games: Object.values(leagueData.games)
        .sort((a, b) => a.leagueRound - b.leagueRound)
        .map((game: Game) => {
          return {
            ...game,
            players: Object.values(game.players).map((player: Player) => {
              return { ...player, rounds: Object.values(player.rounds).sort((a, b) => a.round - b.round) }
            }),
          }
        }),
    }

    const currentGame: Game = transformedData.games.find((game: Game) => !game.complete)
    const players: Player[] = Object.values(currentGame.players)
    const currentPlayer: Player | undefined = players.find((player) => player.information.id === currentUser.id)

    dispatch(getCurrentGame({ currentGame }))
    dispatch(setViewedLeague(transformedData))
    dispatch(getCurrentGameWeekInfo())

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
      console.log(fixtures, 'fx')
      setGameweekFixtures(fixtures)
      // const future = await getFutureGameweekInformation()
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
      <View style={{ backgroundColor: theme.background.primary }} style={{ flex: 1 }}>
        <SafeAreaView />
        <View style={styles(theme).outerContainer}>
          <Text style={styles(theme).mainheading}>{league.name}</Text>
          <TouchableOpacity onPress={showTeamSelection} style={{ padding: 5 }} activeOpacity={0.7}>
            <Text style={{ color: theme.text.primary, fontSize: 12 }}>View fixtures</Text>
          </TouchableOpacity>
        </View>

        <View style={styles(theme).container}>
          <View style={styles(theme).gameContainer}>
            <TouchableOpacity
              onPress={() => setShowSubScreen('current')}
              activeOpacity={0.7}
              style={{
                borderBottomWidth: subScreen === 'current' ? 2 : 0,
                borderBottomColor: theme.purple,
                marginBottom: -2,
              }}
            >
              <Text
                style={[
                  styles(theme).currentRoundHeading,
                  {
                    color: subScreen === 'current' ? theme.purple : '#ccc',
                  },
                ]}
              >
                Current Game
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSubScreen('previous')}
              activeOpacity={0.7}
              style={{
                borderBottomWidth: subScreen === 'previous' ? 2 : 0,
                borderBottomColor: theme.purple,
                marginBottom: -2,
              }}
            >
              <Text
                style={[styles(theme).currentRoundHeading, { color: subScreen === 'previous' ? theme.purple : '#ccc' }]}
              >
                Previous Games
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowSubScreen('stats')}
              activeOpacity={0.7}
              style={{
                borderBottomWidth: subScreen === 'stats' ? 2 : 0,
                borderBottomColor: theme.purple,
                marginBottom: -2,
              }}
            >
              {/* <Text
                style={[styles(theme).currentRoundHeading, { color: subScreen === 'stats' ? theme.purple : '#ccc' }]}
              >
                League Stats
              </Text> */}
            </TouchableOpacity>
          </View>

          <CurrentGame
            display={subScreen === 'current' ? 'flex' : 'none'}
            loaded={loaded}
            theme={theme}
            showTeamSelection={showTeamSelection}
          />
          <CachedPreviousGames
            display={subScreen === 'previous' ? 'flex' : 'none'}
            games={Object.values(league.games).filter((game: Game) => game.complete)}
            theme={theme}
          />

          <LeagueStats display={subScreen === 'stats' ? 'flex' : 'none'} theme={theme} />

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
    outerContainer: {
      alignItems: 'center',
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 10,
    },
    container: {
      backgroundColor: '#fff',
      flex: 1,
    },
    gameContainer: {
      borderBottomWidth: 2,
      borderBottomColor: '#ccc',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginVertical: 10,
      alignSelf: 'center',
      width: '100%',
    },
    currentRoundHeading: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontSize: 15,
      marginHorizontal: 10,
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
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular',
      fontSize: 30,
      fontWeight: '600',
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
