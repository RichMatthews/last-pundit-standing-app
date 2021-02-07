import React from 'react'
import { StyleSheet, Text, ScrollView, Platform, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { TouchableOpacity } from 'react-native-gesture-handler'
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
    setFlip,
    flip,
    theme,
}: any) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)

    return (
        <View style={styles(theme).container}>
            <View style={styles(theme).topContainer}>
                <Text style={styles(theme).currentRoundHeading}>Current Round</Text>
                <TouchableOpacity onPress={() => setFlip(!flip)}>
                    <View style={styles(theme).selectTeamContainer}>
                        <Text style={styles(theme).buttonText}>Select team</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView>
                <Text style={styles(theme).infoBanner}>Round closes: {gameweekCloses}</Text>
                {Object.values(currentGame.players).map((player: any, index: number) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <View key={player.id} style={styles(theme).playerContainer}>
                            <View style={styles(theme).playerRow}>
                                <Text
                                    style={[
                                        styles(theme).playerName,
                                        { color: player.id === user.id ? 'purple' : theme.text.primary },
                                    ]}
                                >
                                    {player.name}
                                </Text>
                                <View style={styles(theme).playerChosenImageAndDownArrow}>
                                    <MemoizedShowImageForPlayerChoice
                                        currentGame={currentGame}
                                        isCurrentLoggedInPlayer={player.id === user.id}
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
                                                        round.choice.value && round.choice.result !== 'pending',
                                                )
                                                .map((round: any) => (
                                                    <PreviousRound choice={round.choice} theme={theme} />
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
            maxHeight: Platform.OS === 'ios' ? 400 : 300,
            width: '100%',
            paddingTop: 10,
        },
        currentRoundHeading: {
            fontFamily: 'Nunito',
            fontSize: 22,
            fontWeight: '700',
            color: theme.text.primary,
        },
        infoBanner: {
            textAlign: 'center',
            backgroundColor: 'purple',
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
            borderRadius: theme.borders.radius,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            paddingTop: 35,
            paddingBottom: 10,
            marginHorizontal: 20,
        },
        playerRow: {
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        playerName: {
            fontFamily: 'Nunito',
            fontSize: theme.text.large,
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
            fontFamily: 'Nunito',
        },
        topContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 15,
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
