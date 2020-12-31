import React from 'react'
import { Text, View } from 'react-native'

export const PreviousGames = ({ games, theme }) => {
    return games.length ? (
        <View style={{ height: '100%' }}>
            {games.map((game) => (
                <View
                    style={{
                        backgroundColor: theme.button.backgroundColor,
                        borderRadius: 5,
                        padding: 10,
                        margin: 10,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text style={{ color: theme.text.primary, fontSize: theme.text.large }}>
                            {Object.values(game.players).find((player) => !player.hasBeenEliminated).name}
                        </Text>
                        <Text style={{ color: '#aaa' }}>Winner</Text>
                    </View>
                    <View style={{ display: 'flex' }}>
                        <Text style={{ color: theme.text.primary, fontSize: theme.text.xlarge, textAlign: 'center' }}>
                            {Object.values(game.players).find((player) => !player.hasBeenEliminated).rounds.length}
                        </Text>
                        <Text style={{ color: theme.text.primary, fontSize: theme.text.xsmall, textAlign: 'center' }}>
                            Correct
                        </Text>
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
