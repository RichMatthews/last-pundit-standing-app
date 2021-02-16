import React, { useCallback, useEffect, useState, useRef } from 'react'
import { StyleSheet, Platform, Text, View } from 'react-native'
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
import { PreviousGames } from 'src/components/league/previous'

interface LeagueData {
    games: {}
}

export const League = ({ leagueId, theme }: string) => {
    const [loaded, setLoaded] = useState<string>('')
    const [gameweekFixtures, setGameweekFixtures] = useState([])
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
            <View style={styles(theme).container}>
                <Text style={styles(theme).mainheading}>{league.name}</Text>
                <View style={styles(theme).buttonsWrapper}>
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
                    <Modalize ref={previousGamesRef} adjustToContentHeight childrenStyle={{ marginBottom: 30 }}>
                        {league && league.games && (
                            <PreviousGames
                                games={Object.values(league.games).filter((game: any) => game.complete)}
                                theme={theme}
                            />
                        )}
                    </Modalize>
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
            backgroundColor: theme.background.primary,
            flex: 1,
        },
        buttonsWrapper: { flexDirection: 'row', marginBottom: 10, marginLeft: 10 },
        mainheading: {
            color: theme.text.primary,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontSize: 30,
            fontWeight: '700',
            marginTop: Platform.OS === 'ios' ? 50 : 0,
            padding: 10,
            paddingHorizontal: 20,
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
