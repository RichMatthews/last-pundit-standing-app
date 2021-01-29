import React, { useState, useRef } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
interface ScreenSelection {
    currentScreenView: string
    setCurrentScreenView: (screen: string) => void
    theme: any
}

var width = Dimensions.get('window').width

export const ScreenSelection = ({ currentScreenView, setCurrentScreenView, theme }: ScreenSelection) => {
    const [scrolledIntoView, setScrolledIntoView] = useState(false)
    const [userHasDragged, setUserHasDragged] = useState(false)
    const [currentXPosition, setCurrentXPosition] = useState(0)
    const scrollRef = useRef()

    const setScreenAndCorrectPosition = (screen: string, margin: number) => {
        console.log(screen, currentScreenView, 'same?')
        setCurrentScreenView(screen)
        if (screen === currentScreenView) {
            return
        }

        const newXPosition = currentXPosition + 100
        scrollRef.current.scrollTo({ x: margin, animated: true })
        setCurrentXPosition(newXPosition)
        setCurrentScreenView(screen)
    }

    const setScrolledIntoViewHelper = () => {
        setScrolledIntoView(false)
        setUserHasDragged(true)
    }

    return (
        <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            onScrollEndDrag={() => setScrolledIntoViewHelper()}
            centerContent={true}
        >
            <View style={styles(theme).surroundingContainer}>
                <View style={[styles(theme).container]}>
                    <TouchableOpacity onPress={() => setScreenAndCorrectPosition('game', 130)} activeOpacity={1}>
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
                    <TouchableOpacity onPress={() => setScreenAndCorrectPosition('selection', 220)} activeOpacity={1}>
                        <View
                            style={[currentScreenView === 'selection' ? styles(theme).viewed : styles(theme).notViewed]}
                        >
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
                    <TouchableOpacity onPress={() => setScreenAndCorrectPosition('info', 330)} activeOpacity={1}>
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
                    <TouchableOpacity onPress={() => setScreenAndCorrectPosition('previous', 440)} activeOpacity={1}>
                        <View
                            style={[currentScreenView === 'previous' ? styles(theme).viewed : styles(theme).notViewed]}
                        >
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
                    <TouchableOpacity onPress={() => setScreenAndCorrectPosition('rules', 520)} activeOpacity={1}>
                        <View style={[currentScreenView === 'rules' ? styles(theme).viewed : styles(theme).notViewed]}>
                            <Text
                                style={[
                                    styles(theme).text,
                                    currentScreenView === 'rules' ? styles(theme).viewed : styles(theme).notViewed,
                                ]}
                            >
                                RULES
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        surroundingContainer: {
            width: 1000,
        },
        container: {
            alignSelf: 'center',
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // marginLeft: 150,
            width,
        },
        viewed: {
            alignSelf: 'center',
            borderBottomWidth: 2,
            borderColor: theme.tint.active,
            color: theme.text.inverse,
        },
        notViewed: {
            color: '#bbb',
        },
        text: {
            fontWeight: '700',
            padding: 10,
            paddingBottom: 0,
            fontSize: 15,
            textAlign: 'center',
        },
    })
