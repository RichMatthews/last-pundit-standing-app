import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
interface ScreenSelection {
    currentScreenView: string
    setCurrentScreenView: (screen: string) => void
}

const reusableView = (currentScreenView: string, setCurrentScreenView: any, screen: string) => (
    <View style={[styles.innerContainer, currentScreenView === screen ? styles.viewed : styles.notViewed]}>
        <TouchableOpacity onPress={() => setCurrentScreenView(screen)}>
            <Text style={[styles.text, currentScreenView === screen ? styles.viewed : styles.notViewed]}>
                Current Game
            </Text>
        </TouchableOpacity>
    </View>
)

export const ScreenSelection = ({ currentScreenView, setCurrentScreenView }: ScreenSelection) => {
    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.innerContainer,
                    styles.borderLeft,
                    currentScreenView === 'game' ? styles.viewed : styles.notViewed,
                ]}
            >
                <TouchableOpacity onPress={() => setCurrentScreenView('game')}>
                    <Text style={[styles.text, currentScreenView === 'game' ? styles.viewed : styles.notViewed]}>
                        Current Game
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.innerContainer, currentScreenView === 'info' ? styles.viewed : styles.notViewed]}>
                <TouchableOpacity onPress={() => setCurrentScreenView('info')}>
                    <Text style={[styles.text, currentScreenView === 'info' ? styles.viewed : styles.notViewed]}>
                        League Info
                    </Text>
                </TouchableOpacity>
            </View>
            <View
                style={[
                    styles.innerContainer,
                    styles.borderRight,
                    currentScreenView === 'previous' ? styles.viewed : styles.notViewed,
                ]}
            >
                <TouchableOpacity onPress={() => setCurrentScreenView('previous')}>
                    <Text style={[styles.text, currentScreenView === 'previous' ? styles.viewed : styles.notViewed]}>
                        Previous Game
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    borderRight: {
        borderRightWidth: 2,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
    },
    borderLeft: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5,
    },
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
        borderWidth: 2,
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
        textAlign: 'center',
        backgroundColor: '#827ee6',
    },
    notViewed: {
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
    },
})
