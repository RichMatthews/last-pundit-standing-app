import React from 'react'
import { Image, Text, View, Platform, StyleSheet } from 'react-native'

import * as Images from '../../images'

export const PreviousRound = ({ choice, theme }: any) => {
    const { code: opponentTeamCode, name: opponentName } = choice.opponent
    const { code: userTeamCode, name: userTeamName }: any = choice

    return choice.teamPlayingAtHome ? (
        <View style={styles(theme).container}>
            <View style={styles(theme).homeTeam}>
                <Text style={[styles(theme).homeTeamName, styles(theme).playerTeam]}>{userTeamName}</Text>
                <Image source={Images[userTeamCode]} style={styles(theme).teamBadge} />
            </View>
            <View style={styles(theme).centerGoals}>
                <Text style={[styles(theme).goals, styles(theme).userGoals]}>{choice.goals}</Text>
                <Text style={styles(theme).centerText}>|</Text>
                <Text style={styles(theme).goals}>{choice.opponent.goals}</Text>
            </View>
            <View style={styles(theme).awayTeam}>
                <Image source={Images[opponentTeamCode]} style={styles(theme).teamBadge} />
                <Text style={[styles(theme).awayTeamName]}>{opponentName}</Text>
            </View>
        </View>
    ) : (
        <View style={styles(theme).container}>
            <View style={styles(theme).homeTeam}>
                <Text style={styles(theme).homeTeamName}>{opponentName}</Text>
                <Image source={Images[opponentTeamCode]} style={styles(theme).teamBadge} />
            </View>
            <View style={styles(theme).centerGoals}>
                <Text style={styles(theme).goals}>{choice.opponent.goals}</Text>
                <Text style={styles(theme).centerText}>|</Text>
                <Text style={[styles(theme).goals, styles(theme).userGoals]}>{choice.goals}</Text>
            </View>
            <View style={styles(theme).awayTeam}>
                <Image source={Images[userTeamCode]} style={styles(theme).teamBadge} />
                <Text style={[styles(theme).playerTeam, styles(theme).awayTeamName]}>{userTeamName}</Text>
            </View>
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            margin: 5,
            width: 300,
        },
        centerGoals: {
            backgroundColor: theme.purple,
            flexDirection: 'row',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            padding: 5,
            width: 50,
        },
        teamBadge: {
            height: 25,
            width: 25,
        },
        goals: {
            width: 15,
            color: theme.text.inverse,
            fontWeight: '700',
            textAlign: 'center',
            fontSize: 15,
        },
        playerTeam: {
            // color: theme.purple,
        },
        centerText: {
            alignItems: 'center',
            color: theme.text.inverse,
            fontSize: 15,
        },
        homeTeam: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 10,
            width: 150,
        },
        awayTeam: {
            alignItems: 'center',
            flexDirection: 'row',
            width: 150,
            marginLeft: 10,
        },
        homeTeamName: {
            color: theme.text.primary,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontWeight: '600',
            marginRight: 5,
            fontSize: 13,
        },
        awayTeamName: {
            color: theme.text.primary,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontWeight: '600',
            marginLeft: 5,
            fontSize: 13,
        },
        userGoals: {
            color: '#00FF87',
        },
    })
