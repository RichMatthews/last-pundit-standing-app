import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const LeagueRules = () => {
    const [showRules, setShowRules] = useState(false)

    return (
        <TouchableOpacity onPress={() => setShowRules(!showRules)} activeOpacity={1}>
            <View
                style={{
                    borderRadius: 5,
                    backgroundColor: '#f7f7ff',
                    padding: 10,
                    margin: 5,
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    shadowColor: '#ddd',
                    shadowOffset: { height: 2, width: 0 },
                }}
            >
                <View>
                    <Text style={{ fontSize: 17 }}>League Rules</Text>
                </View>
                <View>
                    <Text>Pick a different team every week</Text>
                    <Text>Home team must win</Text>
                    <Text>Away team must win or draw</Text>
                    <Text>Last Pundit Standing wins jackpot</Text>
                    <Text>Money rolls over if no winner</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}