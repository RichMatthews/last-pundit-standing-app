import React, { useState } from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import { CurrentRoundView } from '../../current-round'
import { PageNotFound } from '../../../404'

import { Container } from '../../../../ui-components/containers'

export const CurrentGame = ({ loaded }: any) => {
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
                    <View style={styles.subheading}>
                        <Text style={styles.maintext}>
                            <Text style={styles.subtext}>Round closes: </Text>
                            <Text>{currentGameweek.endsReadable}</Text>
                        </Text>
                    </View>
                    <View style={styles.wrapper}>
                        <View style={[styles.section]}>
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
        display: 'flex',
    },

    subheading: {
        borderColor: '#ccc',
        padding: 10,
        width: '100%',
    },
    maintext: {
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    subtext: {
        fontWeight: '400',
    },
})
