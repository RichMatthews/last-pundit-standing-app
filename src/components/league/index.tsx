import React, { useCallback, useEffect, useState, useRef } from 'react'
import { Image, StyleSheet, Platform, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CurrentGame } from 'src/components/league/current'
import { TeamSelection } from 'src/components/league/team-selection'
import { pullLeagueData, getCurrentGameweekFixtures } from 'src/firebase-helpers'
import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { CachedPreviousGames } from 'src/components/league/previous'
import { ScreenComponent } from 'src/ui-components/containers/screenComponent'

interface LeagueData {
    games: {}
}

export const League = ({ leagueId, theme }: string) => {
    const [loaded, setLoaded] = useState<string>('')
    const [gameweekFixtures, setGameweekFixtures] = useState([])
    const [showCurrent, setShowCurrent] = useState(true)
    const dispatch = useDispatch()
    const currentUser = useSelector((store: { user: any }) => store.user)
    const league = useSelector((store: { league: any }) => store.league)
    const previousGamesRef = useRef<Modalize>(null)
    const teamSelectionRef = useRef<Modalize>(null)

    const pullLatestLeagueData = useCallback(async () => {
        const leagueData: LeagueData = await pullLeagueData({ leagueId })
        const { games }: any = leagueData
        const gamesConvertedToArray = Object.values(games)
        const currentGame: any = gamesConvertedToArray.find((game: any) => !game.complete)
        const players: Array<{ id: string }> = Object.values(currentGame.players)
        const currentPlayer = players.find((player) => player.information.id === currentUser.id)

        dispatch(getCurrentGame({ currentGame }))
        dispatch(setViewedLeague({ ...leagueData, games: gamesConvertedToArray }))
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

    useEffect(() => {
        async function fetchFixtures() {
            const fixtures: any = await getCurrentGameweekFixtures()
            setGameweekFixtures(fixtures)
        }
        fetchFixtures()
    }, [])

    useEffect(() => {
        pullLatestLeagueData()
    }, [])

    const showPreviousGames = () => {
        previousGamesRef.current?.open()
    }

    const showTeamSelection = () => {
        teamSelectionRef.current?.open()
    }

    const closeTeamSelectionModal = () => {
        teamSelectionRef.current?.close()
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: '#f2f2f2' }} />
            <View
                style={{
                    backgroundColor: '#f2f2f2',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    alignItems: 'center',
                }}
            >
                <Text style={styles(theme).mainheading}>{league.name}</Text>
                <TouchableOpacity onPress={showTeamSelection}>
                    <Image source={require('src/images/other/menu.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles(theme).container}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 20,
                        justifyContent: 'space-between',
                        marginVertical: 10,
                        marginBottom: 20,
                        width: 300,
                        alignSelf: 'center',
                        shadowOpacity: 1,
                        shadowRadius: 3,
                        shadowColor: '#ccc',
                        shadowOffset: { height: 2, width: 0 },
                    }}
                >
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                        <View
                            style={{
                                backgroundColor: showCurrent ? '#9f85d4' : 'transparent',
                                borderRadius: 20,
                                padding: 10,
                                width: 150,
                            }}
                        >
                            <Text
                                style={[
                                    styles(theme).currentRoundHeading,
                                    {
                                        color: showCurrent ? '#fff' : '#4c4a4f',
                                        fontSize: 15,
                                        textAlign: 'center',
                                    },
                                ]}
                            >
                                Current Round
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                        <View
                            style={{
                                backgroundColor: !showCurrent ? '#9f85d4' : 'transparent',
                                borderRadius: 20,
                                padding: 10,
                                width: 150,
                            }}
                        >
                            <Text
                                style={[
                                    styles(theme).currentRoundHeading,
                                    {
                                        color: !showCurrent ? '#fff' : '#4c4a4f',
                                        fontSize: 15,
                                        textAlign: 'center',
                                    },
                                ]}
                            >
                                Previous Rounds
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {showCurrent ? (
                    <CurrentGame
                        loaded={loaded}
                        theme={theme}
                        showCurrent={showCurrent}
                        setShowCurrent={setShowCurrent}
                    />
                ) : (
                    <CachedPreviousGames
                        games={Object.values(league.games).filter((game: any) => game.complete)}
                        theme={theme}
                    />
                )}

                <Portal>
                    <Modalize
                        adjustToContentHeight
                        ref={teamSelectionRef}
                        scrollViewProps={{
                            contentContainerStyle: { minHeight: '50%' },
                        }}
                    >
                        <View style={styles(theme).fixturesWrapper}>
                            <TeamSelection
                                closeTeamSelectionModal={closeTeamSelectionModal}
                                pullLatestLeagueData={pullLatestLeagueData}
                                theme={theme}
                                fixtures={gameweekFixtures}
                            />
                        </View>
                    </Modalize>
                </Portal>
            </View>
        </>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: '#f2f2f2',
            flex: 1,
        },
        currentRoundHeading: {
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontSize: 20,
            fontWeight: '600',
            color: theme.text.primary,
        },
        image: {
            resizeMode: 'contain',
            height: 30,
            width: 100,
            marginBottom: 20,
        },
        mainheading: {
            color: '#4c4a4f',
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
        fixturesWrapper: { flex: 1, justifyContent: 'space-between', margin: 30 },
    })
