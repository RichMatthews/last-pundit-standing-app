import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
interface ScreenSelection {
    currentScreenView: string
    setCurrentScreenView: (screen: string) => void
}

export const ScreenSelection = ({ currentScreenView, setCurrentScreenView }: ScreenSelection) => {
    return (
        <View style={styles.container}>
            <View style={[styles.innerContainer, currentScreenView === 'game' ? styles.viewed : styles.notViewed]}>
                <TouchableOpacity onPress={() => setCurrentScreenView('game')} activeOpacity={1}>
                    <Text style={[styles.text, currentScreenView === 'game' ? styles.viewed : styles.notViewed]}>
                        Current Game
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.innerContainer, currentScreenView === 'selection' ? styles.viewed : styles.notViewed]}>
                <TouchableOpacity onPress={() => setCurrentScreenView('selection')} activeOpacity={1}>
                    <Text style={[styles.text, currentScreenView === 'selection' ? styles.viewed : styles.notViewed]}>
                        Team selection
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.innerContainer, currentScreenView === 'info' ? styles.viewed : styles.notViewed]}>
                <TouchableOpacity onPress={() => setCurrentScreenView('info')} activeOpacity={1}>
                    <Text style={[styles.text, currentScreenView === 'info' ? styles.viewed : styles.notViewed]}>
                        League Info
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.innerContainer, currentScreenView === 'previous' ? styles.viewed : styles.notViewed]}>
                <TouchableOpacity onPress={() => setCurrentScreenView('previous')} activeOpacity={1}>
                    <Text style={[styles.text, currentScreenView === 'previous' ? styles.viewed : styles.notViewed]}>
                        Previous Game
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingBottom: 10,
        width: 350,
    },
    innerContainer: {
        borderColor: '#827ee6',

        borderRightWidth: 0,
        padding: 5,
        width: '30%',
    },
    leagueInfo: {
        borderColor: '#827ee6',
        borderWidth: 2,
        borderLeftWidth: 1,
        padding: 5,
        width: '30%',
    },
    viewed: {
        borderBottomWidth: 1,
        borderColor: '#827ee6',
        color: '#827ee6',
        fontWeight: '700',
        textAlign: 'center',
    },
    notViewed: {
        backgroundColor: 'transparent',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
    },
})
