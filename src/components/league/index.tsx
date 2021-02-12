import React, { useCallback, useEffect, useState, useRef } from 'react'
import { ScrollView, StyleSheet, RefreshControl, Platform, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { CurrentGame } from 'src/components/league/current'
import { TeamSelection } from 'src/components/league/team-selection'
import { pullLeagueData, getCurrentGameweekFixtures } from 'src/firebase-helpers'
import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { Fixtures } from 'src/components/fixtures'
import { PreviousGames } from 'src/components/league/previous'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface LeagueData {
    games: {}
}

export const League = ({ leagueId, theme }: string) => {
    const [loaded, setLoaded] = useState<string>('')
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const [gameweekFixtures, setGameweekFixtures] = useState([])
    const dispatch = useDispatch()
    const currentUser = useSelector((store: { user: any }) => store.user)
    const league = useSelector((store: { league: any }) => store.league)
    const fixturesRef = useRef<Modalize>(null)
    const previousGamesRef = useRef<Modalize>(null)
    const teamSelectionRef = useRef<Modalize>(null)

    const pullLatestLeagueData = useCallback(async () => {
        const leagueData: LeagueData = await pullLeagueData({ leagueId })
        const { games }: any = leagueData
        const gamesConvertedToArray = Object.values(games)
        const currentGame: any = gamesConvertedToArray.find((game: any) => !game.complete)
        const players: Array<{ id: string }> = Object.values(currentGame.players)
        const currentPlayer = players.find((player: { id: string }) => player.id === currentUser.id)

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

    const wait = (timeout: any) => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout)
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        pullLatestLeagueData()
        wait(500).then(() => {
            setRefreshing(false)
        })
    }, [pullLatestLeagueData])

    const onOpen = () => {
        fixturesRef.current?.open()
    }

    const showPreviousGames = () => {
        previousGamesRef.current?.open()
    }

    const showTeamSelection = () => {
        teamSelectionRef.current?.open()
    }

    const { bottom } = useSafeAreaInsets()

    return (
        <>
            <View style={styles(theme).container}>
                <Text style={styles(theme).mainheading}>{league.name}</Text>

                {/* <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            title="Pull to refresh"
                            tintColor={theme.text.primary}
                            titleColor={theme.text.primary}
                        />
                    }
                >
                </ScrollView> */}
                <View style={{ flexDirection: 'row', marginBottom: 10, marginLeft: 10 }}>
                    <TouchableOpacity onPress={showPreviousGames} activeOpacity={0.7}>
                        <View style={styles(theme).openModalButton}>
                            <Text style={styles(theme).openModalButtonText}>Previous Games</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showPreviousGames} activeOpacity={0.7}>
                        <View style={styles(theme).openModalButton}>
                            <Text style={styles(theme).openModalButtonText}>Leagues Rules</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={showTeamSelection} activeOpacity={0.7}>
                        <View style={styles(theme).openModalButton}>
                            <Text style={styles(theme).openModalButtonText}>Select team</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <CurrentGame loaded={loaded} theme={theme} />

                <Portal>
                    <Modalize ref={fixturesRef} modalHeight={300} closeOnOverlayTap></Modalize>
                    <Modalize ref={previousGamesRef} adjustToContentHeight childrenStyle={{ marginBottom: 30 }}>
                        {league && league.games && (
                            <PreviousGames
                                games={Object.values(league.games).filter((game: any) => game.complete)}
                                theme={theme}
                            />
                        )}
                    </Modalize>
                    <Modalize
                        ref={teamSelectionRef}
                        scrollViewProps={{
                            contentContainerStyle: { minHeight: '100%' },
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'space-between', margin: 30 }}>
                            <Fixtures fixtures={gameweekFixtures} />
                            <TeamSelection pullLatestLeagueData={pullLatestLeagueData} theme={theme} />
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
            backgroundColor: '#F2F4F8',

            flex: 1,
        },
        image: {
            resizeMode: 'contain',
            height: 30,
            width: 100,
            marginBottom: 20,
        },
        mainheading: {
            color: theme.text.primary,
            fontSize: 30,
            fontWeight: '700',
            marginTop: Platform.OS === 'ios' ? 50 : 0,
            padding: 10,
            paddingHorizontal: 20,
        },
        maintext: {
            fontSize: 17,
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
            width: 80,
            alignItems: 'center',
            shadowOpacity: 1,
            shadowRadius: 2,
            shadowColor: '#ddd',
            shadowOffset: { height: 3, width: 3 },
            backgroundColor: theme.background.primary,
            borderRadius: 5,
            elevation: 2,
            padding: 5,
            margin: 10,
        },
        openModalButtonText: {
            textAlign: 'center',
            color: theme.text.primary,
            fontFamily: 'Hind',
        },
    })
