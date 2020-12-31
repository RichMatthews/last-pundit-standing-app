import React, { useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import { CurrentRoundView } from '../../current-round'
import { PageNotFound } from '../../../404'

import { Container } from '../../../../ui-components/containers'

export const CurrentGame = ({ loaded, theme }: any) => {
    console.log(theme, ' them1')
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
            <SafeAreaView>
                <Container>
                    <View style={styles(theme).subheading}>
                        <Text style={styles(theme).maintext}>
                            <Text style={styles(theme).subtext}>Round closes: </Text>
                            <Text style={{ color: theme.text.primary }}>{currentGameweek.endsReadable}</Text>
                        </Text>
                    </View>
                    <CurrentRoundView
                        listOfExpandedPrevious={listOfExpandedPrevious}
                        setListOfExpandedPreviousHelper={setListOfExpandedPreviousHelper}
                        theme={theme}
                    />
                </Container>
            </SafeAreaView>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return (
        <Container style={styles(theme).loading}>
            <ActivityIndicator size="large" color={'red'} />
            <Text style={styles(theme).loadingText}>Retrieving League information...</Text>
        </Container>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        loading: {
            marginTop: 100,
        },
        loadingText: {
            color: theme.colors.primaryColor,
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
