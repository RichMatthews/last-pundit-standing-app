import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, ScrollView, RefreshControl, TouchableOpacity, Platform, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { PreviousRound } from 'src/components/previous-round/index.tsx'
import { MemoizedShowImageForPlayerChoice } from '../show-image-for-player-choice'

interface Props {
    id: string
    name: string
}

export const CurrentRoundView = ({
    gameweekCloses,
    listOfExpandedPrevious,
    setListOfExpandedPreviousHelper,
    theme,
}: any) => {
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)

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

    return (
        <View style={styles(theme).container}>
            <Text style={styles(theme).infoBanner}>Round closes: {gameweekCloses}</Text>
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
                {Object.values(currentGame.players).map((player: any, index: number) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <View key={player.information.id} style={styles(theme).playerContainer}>
                            <View style={styles(theme).playerRow}>
                                <Text
                                    style={[
                                        styles(theme).playerName,
                                        { color: player.information.id === user.id ? '#9f85d4' : theme.text.primary },
                                    ]}
                                >
                                    {player.information.name}
                                </Text>
                                <View style={styles(theme).playerChosenImageAndDownArrow}>
                                    <MemoizedShowImageForPlayerChoice
                                        currentGame={currentGame}
                                        isCurrentLoggedInPlayer={player.information.id === user.id}
                                        player={player}
                                    />
                                    {listOfExpandedPrevious.includes(index) ? (
                                        <FastImage
                                            // Guessing one of these should be an up arrow?
                                            source={require('src/images/other/down-arrow.png')}
                                            style={styles(theme).image}
                                        />
                                    ) : (
                                        <FastImage
                                            source={require('src/images/other/down-arrow.png')}
                                            style={styles(theme).image}
                                        />
                                    )}
                                </View>
                            </View>

                            <Collapsible collapsed={!listOfExpandedPrevious.includes(index)} duration={250}>
                                <View>
                                    {player.rounds.length > 0 ? (
                                        <>
                                            {player.rounds
                                                .filter(
                                                    (round: any) =>
                                                        round.selection.name && round.selection.result !== 'pending',
                                                )
                                                .map((round: any) => (
                                                    <PreviousRound choice={round.selection} theme={theme} />
                                                ))}
                                        </>
                                    ) : (
                                        <View>
                                            <Text>Previous results will show here after Round 1</Text>
                                        </View>
                                    )}
                                </View>
                            </Collapsible>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            alignSelf: 'center',
            backgroundColor: theme.background.primary,
            borderRadius: 5,
            paddingTop: 10,
            width: '100%',
            flexGrow: 1,
            marginBottom: 20,
            elevation: 2,
        },

        infoBanner: {
            textAlign: 'center',
            backgroundColor: '#9f85d4',
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
