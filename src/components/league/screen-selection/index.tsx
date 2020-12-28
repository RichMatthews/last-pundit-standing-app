import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
interface ScreenSelection {
    currentScreenView: string
    setCurrentScreenView: (screen: string) => void
}

var width = Dimensions.get('window').width

export const ScreenSelection = ({ currentScreenView, setCurrentScreenView }: ScreenSelection) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setCurrentScreenView('game')} activeOpacity={1}>
                <View style={[styles.innerContainer, currentScreenView === 'game' ? styles.viewed : styles.notViewed]}>
                    <Text style={[styles.text, currentScreenView === 'game' ? styles.viewed : styles.notViewed]}>
                        LEAGUE
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreenView('selection')} activeOpacity={1}>
                <View
                    style={[
                        styles.innerContainer,
                        currentScreenView === 'selection' ? styles.viewed : styles.notViewed,
                    ]}
                >
                    <Text style={[styles.text, currentScreenView === 'selection' ? styles.viewed : styles.notViewed]}>
                        SELECTION
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreenView('info')} activeOpacity={1}>
                <View style={[styles.innerContainer, currentScreenView === 'info' ? styles.viewed : styles.notViewed]}>
                    <Text style={[styles.text, currentScreenView === 'info' ? styles.viewed : styles.notViewed]}>
                        INFORMATION
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setCurrentScreenView('previous')} activeOpacity={1}>
                <View
                    style={[styles.innerContainer, currentScreenView === 'previous' ? styles.viewed : styles.notViewed]}
                >
                    <Text style={[styles.text, currentScreenView === 'previous' ? styles.viewed : styles.notViewed]}>
                        PREVIOUS
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        width: width * 0.95,
    },
    innerContainer: {
        borderColor: '#827ee6',
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 10,
        paddingBottom: 0,
    },
    viewed: {
        borderBottomWidth: 3,
        borderColor: '#fff',
        color: '#fff',
    },
    notViewed: {
        color: '#fff',
        opacity: 0.8,
    },
    text: {
        padding: 10,
        paddingBottom: 0,
        fontSize: 13,
    },
})
