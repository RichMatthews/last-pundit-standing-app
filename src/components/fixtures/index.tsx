import React from 'react'
import { Text, TouchableOpacity, Platform, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from '../../images'

export const Fixtures = ({ chosenTeams, fixtures, playerHasMadeChoice, selectedTeam, setSelectedTeam, theme }) => {
    return (
        <View>
            <Text style={styles(theme).heading}>Gameweek Fixtures</Text>
            {!playerHasMadeChoice && (
                <Text style={styles(theme).subHeading}>Select your team then confirm at the bottom</Text>
            )}
            <View style={styles(theme).container}>
                {fixtures.map((block: any, index: number) => (
                    <>
                        <Text
                            style={{
                                backgroundColor: '#302d30',
                                fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
                                color: theme.text.primary,
                                fontWeight: '600',
                                padding: 5,
                                textAlign: 'center',
                            }}
                        >
                            {block.date}
                        </Text>
                        <View>
                            {block.matches.map((match, index: number) => {
                                const { code: homeTeamCode, name: homeTeamName } = match.home
                                const { code: awayTeamCode, name: awayTeamName } = match.away
                                const homeTeamPreviouslyChosen = chosenTeams.includes(homeTeamCode)
                                const awayTeamPreviouslyChosen = chosenTeams.includes(awayTeamCode)

                                return (
                                    <View key={homeTeamCode}>
                                        <View style={styles(theme).center}>
                                            <TouchableOpacity
                                                onPress={
                                                    homeTeamPreviouslyChosen
                                                        ? null
                                                        : () => setSelectedTeam({ ...match.home, index, home: true })
                                                }
                                                activeOpacity={homeTeamPreviouslyChosen ? 1 : 0.7}
                                            >
                                                <View
                                                    style={[
                                                        styles(theme).matchContainerHome,
                                                        { opacity: homeTeamPreviouslyChosen ? 0.1 : 1 },
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles(theme).teamName,
                                                            {
                                                                color:
                                                                    selectedTeam?.code === homeTeamCode &&
                                                                    selectedTeam?.index === index
                                                                        ? '#390d40'
                                                                        : theme.text.primary,
                                                            },
                                                        ]}
                                                    >
                                                        {homeTeamName}
                                                    </Text>
                                                    <View style={styles(theme).teamBadgeContainer}>
                                                        <FastImage
                                                            style={styles(theme).teamBadge}
                                                            source={Images[homeTeamCode]}
                                                        />
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                            <View style={styles(theme).vsContainer}>
                                                <Text style={styles(theme).vs}>{match.time || 'TBC'}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={
                                                    awayTeamPreviouslyChosen
                                                        ? null
                                                        : () => setSelectedTeam({ ...match.away, index, home: false })
                                                }
                                                activeOpacity={awayTeamPreviouslyChosen ? 1 : 0.7}
                                            >
                                                <View
                                                    style={[
                                                        styles(theme).matchContainerAway,
                                                        { opacity: awayTeamPreviouslyChosen ? 0.1 : 1 },
                                                    ]}
                                                >
                                                    <View style={styles(theme).teamBadgeContainer}>
                                                        <FastImage
                                                            style={styles(theme).teamBadge}
                                                            source={Images[awayTeamCode]}
                                                        />
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles(theme).teamName,
                                                            {
                                                                color:
                                                                    selectedTeam?.code === awayTeamCode &&
                                                                    selectedTeam?.index === index
                                                                        ? '#390d40'
                                                                        : theme.text.primary,
                                                            },
                                                        ]}
                                                    >
                                                        {awayTeamName}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </>
                ))}
            </View>
        </View>
    )
}
const styles = (theme) =>
    StyleSheet.create({
        center: {
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        container: {
            alignSelf: 'center',
        },
        heading: {
            color: theme.text.primary,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontSize: 20,
            alignSelf: 'center',
            fontWeight: '600',
            marginBottom: 10,
        },
        matchContainerAway: {
            flexDirection: 'row',
            alignItems: 'center',
            width: 150,
        },
        matchContainerHome: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: 150,
        },
        subHeading: {
            alignSelf: 'center',
            color: theme.text.primary,
            marginBottom: 10,
        },
        teamName: {
            fontSize: theme.text.small,
            marginRight: 5,
            fontWeight: '600',
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
        },
        teamBadge: {
            width: 40,
            height: 40,
        },
        teamBadgeContainer: {
            borderRadius: 5,
            padding: 5,
        },
        vsContainer: {
            alignSelf: 'center',
            borderColor: '#454545',
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            padding: 10,
            margin: 10,
        },
        vs: {
            color: theme.text.primary,
            marginLeft: 10,
            marginRight: 10,
        },
    })
