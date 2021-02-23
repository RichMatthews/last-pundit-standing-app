import React from 'react'
import { ScrollView, Platform, View, Text, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from 'src/images'

export const Results = ({ player, theme }) => (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles(theme).playerResultsContainer}>
            {player.rounds.map((round, index) => {
                const { opponent: playerChoiceOpponent, code: playerChoice } = round.selection
                const playerChoicePlayingAtHome = round.selection.teamPlayingAtHome
                const playerChoiceOpponentImage = Images[playerChoiceOpponent.code]
                const playerChoiceImage = Images[playerChoice]
                let homeImage, awayImage

                if (playerChoicePlayingAtHome) {
                    homeImage = playerChoiceImage
                    awayImage = playerChoiceOpponentImage
                } else {
                    homeImage = playerChoiceOpponentImage
                    awayImage = playerChoiceImage
                }

                return (
                    <View style={styles(theme).gameWithRoundNumber}>
                        <View style={styles(theme).roundNumberContainer}>
                            <Text style={styles(theme).roundNumberText}>{index + 1}</Text>
                        </View>
                        <View style={styles(theme).game}>
                            <FastImage
                                source={homeImage}
                                style={[styles(theme).homeImage, { opacity: playerChoicePlayingAtHome ? 1 : 0.25 }]}
                            />

                            <View style={styles(theme).centerGoals}>
                                <Text style={styles(theme).goals}>
                                    {playerChoicePlayingAtHome ? round.selection.goals : round.selection.opponent.goals}
                                </Text>
                                <Text style={styles(theme).centerText}>|</Text>
                                <Text style={styles(theme).goals}>
                                    {!playerChoicePlayingAtHome
                                        ? round.selection.goals
                                        : round.selection.opponent.goals}
                                </Text>
                            </View>
                            <FastImage
                                source={awayImage}
                                style={[styles(theme).awayImage, { opacity: playerChoicePlayingAtHome ? 0.25 : 1 }]}
                            />
                        </View>
                    </View>
                )
            })}
        </View>
    </ScrollView>
)

export const CachedResults = React.memo(Results)

const styles = (theme: any) =>
    StyleSheet.create({
        amountCorrectText: {
            color: theme.text.primary,
            fontSize: theme.text.xlarge,
            textAlign: 'center',
        },
        centerText: {
            alignItems: 'center',
            color: theme.text.inverse,
            fontSize: 15,
        },
        centerGoals: {
            backgroundColor: '#390d40',
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: 50,
        },
        goals: {
            color: theme.text.inverse,
            fontWeight: '700',
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            textAlign: 'center',
        },
        playerResultsContainer: {
            flexDirection: 'row',
        },
        gameWithRoundNumber: {
            alignItems: 'center',
        },
        roundNumberContainer: {
            backgroundColor: '#390d40',
            borderRadius: 50,
            width: 20,
            height: 20,

            justifyContent: 'center',
        },
        roundNumberText: {
            color: '#fff',
            fontWeight: '700',
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            textAlign: 'center',
        },
        game: {
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: 5,
            paddingHorizontal: 5,
        },
        homeImage: {
            width: 20,
            height: 20,
            marginRight: 5,
        },
        awayImage: {
            width: 20,
            height: 20,
            marginLeft: 5,
        },
    })
