import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export const ScreenSelection = ({ currentScreenView, setCurrentScreenView }) => {
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
                paddingBottom: 10,
                width: 350,
            }}
        >
            <View
                style={{
                    backgroundColor: currentScreenView === 'game' ? '#827ee6' : 'transparent',
                    borderTopLeftRadius: 5,
                    borderColor: '#827ee6',
                    borderWidth: 2,
                    borderBottomLeftRadius: 5,
                    borderRightWidth: 0,
                    padding: 5,
                    width: '30%',
                }}
            >
                <TouchableOpacity onPress={() => setCurrentScreenView('game')}>
                    <Text
                        style={{
                            color: currentScreenView === 'game' ? '#fff' : '#000',
                            fontSize: 12,
                            textAlign: 'center',
                        }}
                    >
                        Current Game
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    backgroundColor: currentScreenView === 'info' ? '#827ee6' : 'transparent',
                    borderColor: '#827ee6',
                    borderWidth: 2,
                    borderLeftWidth: 1,
                    padding: 5,
                    width: '30%',
                }}
            >
                <TouchableOpacity onPress={() => setCurrentScreenView('info')}>
                    <Text
                        style={{
                            color: currentScreenView === 'info' ? '#fff' : '#000',
                            fontSize: 12,
                            textAlign: 'center',
                        }}
                    >
                        League Info
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    backgroundColor: currentScreenView === 'previous' ? '#827ee6' : 'transparent',
                    borderTopRightRadius: 5,
                    borderColor: '#827ee6',
                    borderWidth: 2,
                    borderBottomRightRadius: 5,
                    borderLeftWidth: 0,
                    padding: 5,
                    width: '30%',
                }}
            >
                <TouchableOpacity onPress={() => setCurrentScreenView('previous')}>
                    <Text
                        style={{
                            color: currentScreenView === 'previous' ? '#fff' : '#000',
                            fontSize: 12,
                            textAlign: 'center',
                        }}
                    >
                        Previous Game
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
