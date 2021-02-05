import React, { useCallback, useEffect, useState, useRef } from 'react'
import { ScrollView, StyleSheet, RefreshControl, Text, View } from 'react-native'
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

    const pullLatestLeagueData = async () => {
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
    }

    useEffect(() => {
        async function fetchFixtures() {
            const fixtures: any = await getCurrentGameweekFixtures()
            setGameweekFixtures(fixtures)
        }
        fetchFixtures()
    }, [])

    useEffect(() => {
        pullLatestLeagueData()
    }, [leagueId, pullLatestLeagueData])

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

    //<PreviousGames games={Object.values(league.games).filter((game: any) => game.complete)} theme={theme} />
    const onOpen = () => {
        fixturesRef.current?.open()
    }

    return (
        <>
            <LinearGradient
                colors={['#a103fc', '#0009bf']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={{ borderBottomLeftRadius: 25, borderBottomRightRadius: 25, height: 450 }}
            >
                <View style={styles(theme).leagueNameAndImage}>
                    <Text style={styles(theme).mainheading}>{league.name}</Text>
                </View>
            </LinearGradient>
            <View
                style={{
                    backgroundColor: theme.background.primary,
                    height: '35%',
                }}
            >
                <FlipCard
                    friction={6}
                    clickable={false}
                    flip={flip}
                    style={{
                        //theme.background.primary
                        backgroundColor: theme.background.primary,
                        shadowOffset: { width: 0, height: 1 },
                        shadowColor: '#ddd',
                        shadowOpacity: 1,
                        borderRadius: 20,
                        margin: 20,
                        marginTop: -270,
                    }}
                >
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

                    <View>
                        <View style={styles(theme).topContainer}>
                            <TouchableOpacity onPress={() => setFlip(!flip)}>
                                <View style={styles(theme).ctaContainer}>
                                    <Text>Back</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onOpen}>
                                <View style={styles(theme).ctaContainer}>
                                    <Text>Show fixtures</Text>
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
                <Portal>
                    <Modalize ref={fixturesRef} modalHeight={300}>
                        <Fixtures fixtures={gameweekFixtures} />
                    </Modalize>
                </Portal>
            </View>
        </>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        leagueNameAndImage: {
            // alignItems: 'center',
            marginLeft: 20,
            paddingBottom: 15,
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
            marginTop: 100,
            marginBottom: 5,
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
            borderRadius: 3,
            padding: 5,
        },
    })
