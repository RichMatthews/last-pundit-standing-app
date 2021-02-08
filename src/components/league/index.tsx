import React, { useCallback, useEffect, useState, useRef } from 'react'
import { ScrollView, StyleSheet, RefreshControl, Platform, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'

import { CurrentGame } from 'src/components/league/current'
import { TeamSelection } from 'src/components/league/team-selection'
import { pullLeagueData, getCurrentGameweekFixtures } from 'src/firebase-helpers'
import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'
import FlipCard from 'react-native-flip-card'
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
    const [flip, setFlip] = useState(false)
    const fixturesRef = useRef<Modalize>(null)
    const previousGamesRef = useRef<Modalize>(null)

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

    const { bottom } = useSafeAreaInsets()

    return (
        <>
            <LinearGradient
                colors={['#fff', 'purple']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles(theme).linearGrad}
            >
                <View style={styles(theme).leagueNameAndImage}>
                    <Text style={styles(theme).mainheading}>{league.name}</Text>
                </View>
            </LinearGradient>
            <View style={styles(theme).flipContainer}>
                <FlipCard friction={6} clickable={false} flip={flip} style={styles(theme).flipCardContainer}>
                    <ScrollView
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
                        <CurrentGame loaded={loaded} theme={theme} flip={flip} setFlip={setFlip} />
                    </ScrollView>

                    <View style={{ minHeight: 250 }}>
                        <View style={styles(theme).topContainer}>
                            <TouchableOpacity onPress={onOpen}>
                                <View style={styles(theme).ctaContainer}>
                                    <Text style={styles(theme).buttonText}>Show fixtures</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFlip(!flip)}>
                                <View style={styles(theme).ctaContainer}>
                                    <Text style={styles(theme).buttonText}>Show game</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TeamSelection
                            setFlip={setFlip}
                            flip={flip}
                            pullLatestLeagueData={pullLatestLeagueData}
                            theme={theme}
                        />
                    </View>
                </FlipCard>
                <TouchableOpacity onPress={showPreviousGames} activeOpacity={0.7}>
                    <Text style={styles(theme).openModalButton}>View Previous Games</Text>
                </TouchableOpacity>

                <Text style={styles(theme).openModalButton}>View Leagues Rules</Text>
                <Portal>
                    <Modalize ref={fixturesRef} modalHeight={300} closeOnOverlayTap>
                        <Fixtures fixtures={gameweekFixtures} />
                    </Modalize>
                    <Modalize ref={previousGamesRef} adjustToContentHeight childrenStyle={{ marginBottom: 30 }}>
                        {league && league.games && (
                            <PreviousGames
                                games={Object.values(league.games).filter((game: any) => game.complete)}
                                theme={theme}
                            />
                        )}
                    </Modalize>
                </Portal>
            </View>
        </>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        leagueNameAndImage: {
            marginLeft: 20,
            paddingBottom: 15,
        },
        flipContainer: {
            backgroundColor: theme.background.primary,
            flex: Platform.OS === 'ios' ? 1 : 0.5,
            justifyContent: 'flex-end',
        },
        flipCardContainer: {
            backgroundColor: theme.background.primary,
            shadowOffset: { width: 0, height: 1 },
            shadowColor: '#ddd',
            shadowOpacity: 1,
            elevation: 5,
            borderRadius: 20,
            margin: 20,
            position: 'absolute',
            top: -180,
            width: '90%',
        },
        linearGrad: {
            borderBottomLeftRadius: 25,
            borderBottomRightRadius: 25,
            flex: Platform.OS === 'ios' ? 1 : 0.5,
        },
        image: {
            resizeMode: 'contain',
            height: 30,
            width: 100,
            marginBottom: 20,
        },
        mainheading: {
            color: theme.headings.inverse,
            fontSize: 30,
            marginTop: Platform.OS === 'ios' ? 100 : 20,
            padding: 10,
        },
        subheading: {
            borderColor: '#ccc',
            padding: 10,
            width: '100%',
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
        buttonText: {
            color: theme.text.primary,
            fontFamily: 'Nunito',
        },
        openModalButton: {
            borderRadius: 5,
            padding: 5,
            marginHorizontal: 50,
            marginBottom: 20,
            textAlign: 'center',
            backgroundColor: theme.background.primary,
            color: theme.text.primary,
            shadowOffset: { width: 0, height: 1 },
            shadowColor: '#ddd',
            shadowOpacity: 1,
            elevation: 5,
            fontFamily: 'Nunito',
        },
    })
