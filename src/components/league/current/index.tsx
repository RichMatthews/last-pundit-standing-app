import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import { CurrentRoundView } from 'src/components/league/current-round'
import { PageNotFound } from '../../404'

export const CurrentGame = ({ loaded, flip, setFlip, theme }: any) => {
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
            <View>
                <View style={styles(theme).subheading}>
                    {/* <Text style={styles(theme).maintext}>
                    <Text style={styles(theme).subtext}>Round closes: </Text>
                    <Text style={{ color: theme.text.primary }}>{currentGameweek.endsReadable}</Text>
                </Text> */}
                </View>
                <CurrentRoundView
                    listOfExpandedPrevious={listOfExpandedPrevious}
                    setListOfExpandedPreviousHelper={setListOfExpandedPreviousHelper}
                    flip={flip}
                    setFlip={setFlip}
                    theme={theme}
                />
            </View>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
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
        subheading: {
            padding: 10,
        },
        maintext: {
            fontSize: theme.text.medium,
            fontWeight: '700',
            textAlign: 'center',
        },
        subtext: {
            color: theme.text.primary,
            fontWeight: '400',
        },
    })
