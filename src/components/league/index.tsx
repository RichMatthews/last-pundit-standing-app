import React, { useCallback, useEffect, useState } from 'react'
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, RefreshControl, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { LinearTextGradient } from 'react-native-text-gradient'

import { LeagueInfo } from 'src/components/league/screen-views/info'
import { CurrentGame } from 'src/components/league/screen-views/current'
import { PreviousGames } from 'src/components/league/screen-views/previous'
import { TeamSelection } from 'src/components/league/screen-views/team-selection'
import { ScreenSelection } from 'src/components/league/screen-selection'
import { pullLeagueData } from 'src/firebase-helpers'
import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'
import { H2 } from 'src/ui-components/headings'

interface LeagueData {
    games: {}
}

export const League = ({ leagueId }: string) => {
    const [currentScreenView, setCurrentScreenView] = useState('game')
    const [loaded, setLoaded] = useState<string>('')
    const [refreshing, setRefreshing] = useState<boolean>(false)

    const dispatch = useDispatch()
    const currentUser = useSelector((store: { user: any }) => store.user)
    const league = useSelector((store: { league: any }) => store.league)
    const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)

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
    }, [])

    const determineScreenToRender = () => {
        if (currentScreenView === 'info') {
            return <LeagueInfo />
        } else if (currentScreenView === 'previous') {
            return <PreviousGames games={Object.values(league.games).filter((game: any) => game.complete)} />
        } else if (currentScreenView === 'selection') {
            return (
                <TeamSelection
                    pullLatestLeagueData={pullLatestLeagueData}
                    setCurrentScreenView={setCurrentScreenView}
                />
            )
        }
        return <CurrentGame loaded={loaded} pullLatestLeagueData={pullLatestLeagueData} refreshing={refreshing} />
    }

    return (
        <>
            <LinearGradient
                colors={['#a103fc', '#5055b3']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={{ height: Platform.OS === 'ios' ? 300 : 100, borderBottomRightRadius: 259 }}
            >
                <View style={styles.leagueNameAndImage}>
                    <H2 style={styles.mainheading}>{league.name}</H2>

                    <Image source={require('../../images/other/premier-league.png')} style={styles.image} />
                </View>
            </LinearGradient>
            <ScrollView
                contentContainerStyle={{ flex: 1 }}
                style={{ backgroundColor: '#fff' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View
                    style={{
                        backgroundColor: '#fff',
                        shadowOpacity: 1,
                        shadowRadius: 3.5,
                        shadowColor: '#ccc',
                        shadowOffset: { height: 2, width: 0 },
                    }}
                >
                    <View style={styles.subheading}>
                        <Text style={styles.maintext}>
                            <Text style={styles.subtext}>Round closes: </Text>
                            <Text>{currentGameweek.endsReadable}</Text>
                        </Text>
                    </View>
                    <ScreenSelection
                        currentScreenView={currentScreenView}
                        setCurrentScreenView={setCurrentScreenView}
                    />
                </View>
                <View style={{ backgroundColor: '#fff' }}>{determineScreenToRender()}</View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    leagueNameAndImage: {
        display: 'flex',
        alignItems: 'center',
        paddingBottom: 15,
        paddingTop: 15,
        width: '100%',
    },
    image: {
        resizeMode: 'contain',
        height: 30,
        width: 100,
        marginBottom: 20,
    },
    mainheading: {
        color: '#fff',
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
})
