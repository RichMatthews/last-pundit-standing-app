import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
interface ScreenSelection {
    currentScreenView: string
    setCurrentScreenView: (screen: string) => void
    theme: any
}

var width = Dimensions.get('window').width

export const ScreenSelection = ({ currentScreenView, setCurrentScreenView, theme }: ScreenSelection) => {
    return (
        <View style={styles(theme).container}>
            <TouchableOpacity onPress={() => setCurrentScreenView('game')} activeOpacity={1}>
                <View style={[currentScreenView === 'game' ? styles(theme).viewed : styles(theme).notViewed]}>
                    <Text
                        style={[
                            styles(theme).text,
                            currentScreenView === 'game' ? styles(theme).viewed : styles(theme).notViewed,
                        ]}
                    >
                        LEAGUE
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreenView('selection')} activeOpacity={1}>
                <View style={[currentScreenView === 'selection' ? styles(theme).viewed : styles(theme).notViewed]}>
                    <Text
                        style={[
                            styles(theme).text,
                            currentScreenView === 'selection' ? styles(theme).viewed : styles(theme).notViewed,
                        ]}
                    >
                        SELECTION
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreenView('info')} activeOpacity={1}>
                <View style={[currentScreenView === 'info' ? styles(theme).viewed : styles(theme).notViewed]}>
                    <Text
                        style={[
                            styles(theme).text,
                            currentScreenView === 'info' ? styles(theme).viewed : styles(theme).notViewed,
                        ]}
                    >
                        INFORMATION
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreenView('previous')} activeOpacity={1}>
                <View style={[currentScreenView === 'previous' ? styles(theme).viewed : styles(theme).notViewed]}>
                    <Text
                        style={[
                            styles(theme).text,
                            currentScreenView === 'previous' ? styles(theme).viewed : styles(theme).notViewed,
                        ]}
                    >
                        PREVIOUS
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.button.backgroundColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
            shadowColor: '#aaa',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 4,
            shadowRadius: 6,
            width,
        },
        viewed: {
            borderBottomWidth: 4,
            borderColor: theme.tint.active,
            color: theme.tint.active,
        },
        notViewed: {
            color: theme.text.primary,
        },
        text: {
            padding: 10,
            paddingBottom: 2,
            fontWeight: '700',
            fontSize: 13,
        },
    })
