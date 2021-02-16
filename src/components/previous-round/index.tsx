import React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'

import * as Images from '../../images'

export const PreviousRound = ({ choice, theme }: any) => {
    const opponentTeamName: any = choice.opponent.code.toUpperCase()
    const userTeamName: any = choice.code.toUpperCase()

    return choice.teamPlayingAtHome ? (
        <View style={styles(theme).container}>
            <Image source={Images[userTeamName]} style={styles(theme, false).teamBadge} />
            <Text style={styles(theme).text}>{choice.goals}</Text>
            <Text style={styles(theme).text}>-</Text>
            <Text style={styles(theme).text}>{choice.opponent.goals}</Text>
            <Image source={Images[opponentTeamName]} style={styles(theme, true).teamBadge} />
        </View>
    ) : (
        <View style={styles(theme).container}>
            <Image source={Images[opponentTeamName]} style={styles(theme, true).teamBadge} />
            <Text style={styles(theme).text}>{choice.opponent.goals}</Text>
            <Text style={styles(theme).text}>-</Text>
            <Text style={styles(theme).text}>{choice.goals}</Text>
            <Image source={Images[userTeamName]} style={styles(theme, false).teamBadge} />
        </View>
    )
}

const styles = (theme, lost?: boolean) =>
    StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            width: 200,
            margin: 5,
        },
        teamBadge: {
            opacity: lost ? 0.2 : 1,
            height: 30,
            width: 30,
        },
        text: {
            color: theme.text.primary,
            fontSize: theme.text.large,
            fontWeight: '700',
        },
    })
