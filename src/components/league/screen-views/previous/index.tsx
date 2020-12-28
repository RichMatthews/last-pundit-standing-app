import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const PreviousGames = ({ games }) => {
    return (
        <View>
            {games.map((game) => (
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        padding: 10,
                        margin: 10,
                        shadowOpacity: 0.5,
                        // shadowRadius: 5,
                        shadowColor: '#ccc',
                        shadowOffset: { height: 5, width: 0 },
                    }}
                >
                    <Text style={{ color: '#2C3E50', fontSize: 20 }}>
                        {Object.values(game.players).find((player) => !player.hasBeenEliminated).name}
                    </Text>
                    <Text style={{ color: '#aaa' }}>Winner</Text>
                    <Text>
                        Correct Predictions -{' '}
                        {Object.values(game.players).find((player) => !player.hasBeenEliminated).rounds.length}
                    </Text>
                </View>
            ))}
        </View>
    )
}
