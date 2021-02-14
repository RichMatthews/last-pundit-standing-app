import React from 'react'
import { Text, StyleSheet, View } from 'react-native'

export const LeagueRules = ({ theme }) => {
    return (
        <View>
            <View>
                <Text style={{ fontSize: theme.text.heading }}>League Rules</Text>
            </View>
            <View>
                <Text>Pick a different team every week</Text>
                <Text>Home team must win</Text>
                <Text>Away team must win or draw</Text>
                <Text>Last Pundit Standing wins jackpot</Text>
                <Text>Money rolls over if no winner</Text>
            </View>
        </View>
    )
}

const styles = (theme) => StyleSheet.create({})
