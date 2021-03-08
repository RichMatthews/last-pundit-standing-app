import React, { useCallback, useState } from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    Platform,
    View,
} from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'
import { PreviousRound } from 'src/components/previous-round'
import { MemoizedShowImageForPlayerChoice } from '../ShowImageForPlayerChoice'
import Entypo from 'react-native-vector-icons/Entypo'

interface Props {
    id: string
    name: string
}

export const CurrentGame = ({ loaded, theme, showTeamSelection }: any) => {
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)

    const setListOfExpandedPreviousHelper = (index: number) => {
        if (listOfExpandedPrevious.includes(index)) {
            setListOfExpandedPrevious(listOfExpandedPrevious.filter((x: number) => x !== index))
        } else {
            setListOfExpandedPrevious(listOfExpandedPrevious.concat(index))
        }
    }

    const wait = (timeout: any) => {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout)
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        // pullLatestLeagueData()
        wait(500).then(() => {
            setRefreshing(false)
        })
    }, [])

    return loaded ? (
        <View style={styles(theme).container}>
            <Text style={styles(theme).infoBanner}>Round closes: {currentGameweek.endsReadable}</Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{ flexGrow: 1 }}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={onRefresh}
                //         title="Pull to refresh"
                //         tintColor={theme.text.primary}
                //         titleColor={theme.text.primary}
                //     />
                // }
            >
                {Object.values(currentGame.players).map((player: any, index: number) => (
                    <View key={player.information.id} style={styles(theme).playerContainer}>
                        <View style={styles(theme).playerRow}>
                            <Text
                                style={[
                                    styles(theme).playerName,
                                    {
                                        color: theme.text.primary,
                                        opacity: player.hasBeenEliminated ? 0.2 : 1,
                                    },
                                ]}
                            >
                                {player.information.name}
                            </Text>
                            <View style={styles(theme).playerChosenImageAndDownArrow}>
                                <MemoizedShowImageForPlayerChoice
                                    currentGame={currentGame}
                                    isCurrentLoggedInPlayer={player.information.id === user.id}
                                    player={player}
                                    showTeamSelection={showTeamSelection}
                                />
                                <TouchableOpacity
                                    onPress={() => setListOfExpandedPreviousHelper(index)}
                                    activeOpacity={1}
                                >
                                    {listOfExpandedPrevious.includes(index) ? (
                                        <Entypo name="chevron-small-up" size={30} color={theme.icons.primary} />
                                    ) : (
                                        <Entypo name="chevron-small-down" size={30} color={theme.icons.primary} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Collapsible collapsed={!listOfExpandedPrevious.includes(index)} duration={250}>
                            <View style={{ backgroundColor: theme.background.secondary }}>
                                {player.rounds.length > 0 ? (
                                    <>
                                        {player.rounds
                                            .filter((round: any) => round.selection.complete)
                                            .map((round: any, i: number) => {
                                                console.log('ROUND:', round)
                                                const pendingGame =
                                                    i === player.rounds.length - 1 &&
                                                    round.selection.result === 'pending'
                                                const roundLost = round.selection.result === 'lost'
                                                return (
                                                    <PreviousRound
                                                        choice={round.selection}
                                                        pendingGame={pendingGame}
                                                        roundLost={roundLost}
                                                        theme={theme}
                                                    />
                                                )
                                            })}
                                    </>
                                ) : (
                                    <View>
                                        <Text>Previous results will show here after Round 1</Text>
                                    </View>
                                )}
                            </View>
                        </Collapsible>
                    </View>
                ))}
            </ScrollView>
        </View>
    ) : (
        <View style={styles(theme).loading}>
            <ActivityIndicator size="large" color={theme.spinner.primary} />
            <Text style={styles(theme).loadingText}>Retrieving League information...</Text>
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            backgroundColor: theme.background.primary,
            borderRadius: 5,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 10,
            width: '100%',
            flex: 1,
        },
        loadingText: {
            color: theme.text.primary,
            fontSize: 20,
        },
        infoBanner: {
            textAlign: 'center',
            backgroundColor: theme.purple,
            color: '#fff',
            paddingVertical: 10,
            marginTop: 20,
            fontWeight: '700',
        },
        image: {
            width: 10,
            height: 10,
        },
        playerContainer: {
            paddingVertical: 20,
            marginHorizontal: 20,
        },
        playerRow: {
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        playerName: {
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontWeight: '600',
            fontSize: theme.text.medium,
        },
        playerChosenImageAndDownArrow: {
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        selectTeamContainer: {
            borderWidth: 1,
            borderRadius: 5,
            borderColor: '#ccc',
            padding: 5,
        },
        buttonText: {
            color: theme.text.primary,
            fontFamily: 'Hind',
        },

        maintext: {
            fontSize: theme.text.medium,
            fontWeight: '700',
            textAlign: 'center',
        },
        subtext: {
            color: theme.text.primary,
            fontWeight: '400',
        },
    })
