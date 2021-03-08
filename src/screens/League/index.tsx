import React, { useCallback, useEffect, useState, useRef } from 'react'
import { ActivityIndicator, StyleSheet, Platform, Linking, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CurrentGame } from './CurrentGame'
import { ChooseTeam } from 'src/screens/League/ChooseTeam'
import { pullLeagueData, getCurrentGameweekFixtures } from 'src/firebase-helpers'
import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { setViewedLeague } from 'src/redux/reducer/league'
import { Modalize } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import { CachedPreviousGames } from 'src/screens/PreviousGames'

interface LeagueData {
    games: {}
}

export const League = ({ leagueId, theme }: string) => {
    const [loaded, setLoaded] = useState<string>('')
    const [gameweekFixtures, setGameweekFixtures] = useState([])
    const [showCurrent, setShowCurrent] = useState(true)
    const [loadingModalOpen, setLoadingModalOpen] = useState(false)
    const dispatch = useDispatch()
    const currentUser = useSelector((store: { user: any }) => store.user)
    const league = useSelector((store: { league: any }) => store.league)
    const teamSelectionRef = useRef<Modalize>(null)
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

    useEffect(() => {
        // Toast.show({
        //     type: 'success',
        //     text1: 'Prediction successfully submitted!',
        //     text2: "Click here if you'd like to be notified when others make their prediction",
        //     autoHide: false,
        //     topOffset: 50,
        //     // props: { onPress: toastPressed, onHide: hideToast },
        //     // position: 'top',
        // })
    }, [])

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

    const showTeamSelection = () => {
        teamSelectionRef.current?.open()
    }

    const closeTeamSelectionModal = () => {
        teamSelectionRef.current?.close()
    }

    return (
        <>
            <SafeAreaView style={{ flex: 0, backgroundColor: theme.background.secondary }} />

            <View
                style={{
                    backgroundColor: theme.background.secondary,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    alignItems: 'center',
                }}
            >
                <Text style={styles(theme).mainheading}>{league.name}</Text>
                <TouchableOpacity onPress={showTeamSelection} style={{ padding: 10 }} activeOpacity={0.7}>
                    <Text style={{ color: theme.text.primary }}>View fixtures</Text>
                </TouchableOpacity>
            </View>

            <View style={styles(theme).container}>
                <View
                    style={{
                        backgroundColor: theme.background.primary,
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
                        shadowColor: theme.background.secondary,
                        shadowOffset: { height: 2, width: 0 },
                    }}
                >
                    <TouchableOpacity onPress={() => setShowCurrent(true)} activeOpacity={0.7}>
                        <View
                            style={{
                                backgroundColor: showCurrent ? theme.purple : theme.background.primary,
                                borderRadius: 20,
                                padding: 10,
                                width: 150,
                            }}
                        >
                            <Text
                                style={[
                                    styles(theme).currentRoundHeading,
                                    {
                                        color: showCurrent ? theme.text.inverse : theme.text.primary,
                                        fontSize: 15,
                                        textAlign: 'center',
                                    },
                                ]}
                            >
                                Current Round
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowCurrent(false)} activeOpacity={0.7}>
                        <View
                            style={{
                                backgroundColor: !showCurrent ? theme.purple : theme.background.primary,
                                borderRadius: 20,
                                padding: 10,
                                width: 150,
                            }}
                        >
                            <Text
                                style={[
                                    styles(theme).currentRoundHeading,
                                    {
                                        color: !showCurrent ? theme.text.inverse : theme.text.primary,
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

                <View style={{ flex: 1 }}>
                    {showCurrent ? (
                        <CurrentGame
                            loaded={loaded}
                            theme={theme}
                            showCurrent={showCurrent}
                            setShowCurrent={setShowCurrent}
                            showTeamSelection={showTeamSelection}
                        />
                    ) : (
                        <CachedPreviousGames
                            games={Object.values(league.games).filter((game: any) => game.complete)}
                            theme={theme}
                        />
                    )}
                </View>

                <Portal>
                    <Modalize
                        adjustToContentHeight
                        disableScrollIfPossible
                        ref={teamSelectionRef}
                        scrollViewProps={{
                            contentContainerStyle: { backgroundColor: theme.background.primary, minHeight: '100%' },
                        }}
                        handlePosition={'inside'}
                        modalStyle={{ backgroundColor: theme.background.primary }}
                        onClosed={() => setLoadingModalOpen(false)}
                        // openAnimationConfig={{
                        //     timing: { duration: 1 },
                        //     spring: { bounciness: 10, speed: 1 },
                        // }}
                    >
                        {loadingModalOpen ? (
                            <View style={{ alignSelf: 'center', marginTop: 100 }}>
                                <ActivityIndicator size={'large'} color={theme.spinner.inverse} />
                                <Text
                                    style={{ fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold', fontSize: 20 }}
                                >
                                    Submitting choice, please wait...
                                </Text>
                            </View>
                        ) : (
                            <View style={styles(theme).fixturesWrapper}>
                                <ChooseTeam
                                    closeTeamSelectionModal={closeTeamSelectionModal}
                                    setLoadingModalOpen={setLoadingModalOpen}
                                    pullLatestLeagueData={pullLatestLeagueData}
                                    theme={theme}
                                    fixtures={gameweekFixtures}
                                />
                            </View>
                        )}
                    </Modalize>
                </Portal>
            </View>
        </>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background.secondary,
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
        fixturesWrapper: { flex: 1, justifyContent: 'space-between', margin: 30 },
    })
