import React from 'react'
import { Text, TouchableOpacity, Platform, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from '../../images'

export const Fixtures = ({ chosenTeams, fixtures, selectedTeam, setSelectedTeam }) => {
    return (
        <View>
            <Text style={styles.heading}>Gameweek Fixtures</Text>
            <Text style={styles.subHeading}>Select your team then confirm at the bottom</Text>
            <View style={styles.container}>
                {fixtures.map((match: any) => {
                    const homeTeamPreviouslyChosen = chosenTeams.includes(match.home)
                    const awayTeamPreviouslyChosen = chosenTeams.includes(match.away)

                    return (
                        <View key={match.home}>
                            <View style={styles.center}>
                                <TouchableOpacity
                                    onPress={homeTeamPreviouslyChosen ? null : () => setSelectedTeam(match.home)}
                                    activeOpacity={homeTeamPreviouslyChosen ? 1 : 0.7}
                                >
                                    <View
                                        style={[
                                            styles.matchContainerHome,
                                            { opacity: homeTeamPreviouslyChosen ? 0.2 : 1 },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.teamName,
                                                { color: selectedTeam === match.home ? '#9f85d4' : 'black' },
                                            ]}
                                        >
                                            {match.home}
                                        </Text>
                                        <View style={styles.teamBadgeContainer}>
                                            <FastImage
                                                style={{ width: 40, height: 40 }}
                                                source={Images[match.home.replace(/\s/g, '').toLowerCase()]}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.vsContainer}>
                                    <Text style={styles.vs}>{match.time || 'TBC'}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setSelectedTeam(match.away)}
                                    activeOpacity={awayTeamPreviouslyChosen ? 1 : 0.7}
                                >
                                    <View
                                        style={[
                                            styles.matchContainerAway,
                                            { opacity: awayTeamPreviouslyChosen ? 0.2 : 1 },
                                        ]}
                                    >
                                        <View style={styles.teamBadgeContainer}>
                                            <FastImage
                                                style={styles.teamBadge}
                                                source={Images[match.away.replace(/\s/g, '').toLowerCase()]}
                                            />
                                        </View>
                                        <Text
                                            style={[
                                                styles.teamName,
                                                { color: selectedTeam === match.away ? '#9f85d4' : 'black' },
                                            ]}
                                        >
                                            {match.away}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        width: 300,
    },
    container: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    heading: {
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
        color: '#aaa',
        marginBottom: 10,
    },
    teamName: {
        fontSize: 12,
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
        borderColor: '#ccc',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        padding: 10,

        margin: 10,
    },
    vs: {
        marginLeft: 10,
        marginRight: 10,
    },
    title: { fontSize: 17, alignSelf: 'center', fontWeight: '700', marginBottom: 10 },
    clubBadge: { width: 30, height: 30 },
})
