import React from 'react'
import { Text, View } from 'react-native'

export const PreviousGames = ({ games }) => {
    return games.length ? (
        <View>
            {games.map((game) => (
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        padding: 10,
                        margin: 5,
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text style={{ color: '#2C3E50', fontSize: 20 }}>
                            {Object.values(game.players).find((player) => !player.hasBeenEliminated).name}
                        </Text>
                        <Text style={{ color: '#aaa' }}>Winner</Text>
                    </View>
                    <View style={{ display: 'flex' }}>
                        <Text style={{ fontSize: 25, textAlign: 'center' }}>
                            {Object.values(game.players).find((player) => !player.hasBeenEliminated).rounds.length}
                        </Text>
                        <Text style={{ fontSize: 10, textAlign: 'center' }}>Correct</Text>
                    </View>
                </View>
            ))}
        </View>
    ) : (
        <View>
            <Text>Previous games will show here after they are complete</Text>
        </View>
    )
}
