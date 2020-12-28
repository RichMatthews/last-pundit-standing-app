import React, { useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'

import { CurrentRoundView } from '../../current-round'
import { PageNotFound } from '../../../404'

import { Container } from '../../../../ui-components/containers'

export const CurrentGame = ({ loaded }: any) => {
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])

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
                    <View style={styles.wrapper}>
                        <View style={[styles.currentRoundSelectionWrapper, styles.section]}>
                            <CurrentRoundView
                                listOfExpandedPrevious={listOfExpandedPrevious}
                                setListOfExpandedPreviousHelper={setListOfExpandedPreviousHelper}
                            />
                        </View>
                    </View>
                </Container>
            </SafeAreaView>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return (
        <Container style={styles.loading}>
            <ActivityIndicator size="large" color="#827ee6" />
            <Text style={styles.loadingText}>Retrieving League information...</Text>
        </Container>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
    },
    loading: {
        marginTop: 100,
    },
    loadingText: {
        fontSize: 20,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
    },

    currentRoundSelectionWrapper: {
        backgroundColor: 'transparent',
        padding: 0,
    },
})
