import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import { CurrentRoundView } from 'src/components/league/current-round'

export const CurrentGame = ({ loaded, showCurrent, setShowCurrent, theme }: any) => {
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)

    const setListOfExpandedPreviousHelper = (index: number) => {
        if (listOfExpandedPrevious.includes(index)) {
            setListOfExpandedPrevious(listOfExpandedPrevious.filter((x: number) => x !== index))
        } else {
            setListOfExpandedPrevious(listOfExpandedPrevious.concat(index))
        }
    }

    if (loaded === 'league-found') {
        return (
            <View style={{ flex: 1 }}>
                <CurrentRoundView
                    gameweekCloses={currentGameweek.endsReadable}
                    listOfExpandedPrevious={listOfExpandedPrevious}
                    setListOfExpandedPreviousHelper={setListOfExpandedPreviousHelper}
                    theme={theme}
                    showCurrent={showCurrent}
                    setShowCurrent={setShowCurrent}
                />
            </View>
        )
    }

    return (
        <View style={styles(theme).loading}>
            <ActivityIndicator size="large" color={theme.spinner.primary} />
            <Text style={styles(theme).loadingText}>Retrieving League information...</Text>
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        loading: {
            alignSelf: 'center',
            marginTop: 100,
            minHeight: 100,
        },
        loadingText: {
            color: theme.text.primary,
            fontSize: 20,
        },
    })
