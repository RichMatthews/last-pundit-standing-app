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
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'center',
            width: width,
        },
        viewed: {
            borderBottomWidth: 3,
            borderColor: theme.borders.primaryColor,
            color: theme.tint.active,
            fontWeight: '700',
        },
        notViewed: {
            color: theme.text.primary,
        },
        text: {
            padding: 10,
            paddingBottom: 0,
            fontSize: 13,
        },
    })
