import React, { useCallback, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import styled from 'styled-components'

import { CurrentRoundView } from '../../current-round'
import { ChooseTeam } from '../../../choose-team'
import { PageNotFound } from '../../../404'
import { firebaseApp } from '../../../../config.js'

import { H1, H2 } from '../../../../ui-components/headings'
import { Container } from '../../../../ui-components/containers'

interface LeagueProps {
    currentUserId: string
    leagueId: string
    navigation: any
}
interface ImageStyled {
    lost?: boolean
}

const Section = styled.View`
    background: transparent;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    padding: 10px;
`

const SelectionWrapper = styled(Section)`
    border-bottom-width: 5px;
    border-bottom-color: #ccc;
`

const CurrentRoundSelectionWrapper = styled(Section)`
    background: transparent;
    padding: 0;
`

const LeagueInformationWrapper = styled(SelectionWrapper)`
    display: flex;
`

const Wrapper = styled.View`
    display: flex;
    flex-direction: column;
`

const TextContainer = styled.View`
    margin: 10px;
    text-align: center;
`

const TeamSelectionText = styled.Text`
    margin-top: 20px;
`

const wait = (timeout: any) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout)
    })
}

export const CurrentGame = ({
    currentGame,
    currentGameweek,
    currentPlayer,
    currentViewedGame,
    currentUserId,
    league,
    gamesInLeague,
    listOfExpandedPrevious,
    loaded,
    selectionTimeEnded,
    currentScreenView,
    refreshing,
    pullLatestLeagueData,
    setRefreshing,
    calculateTeamsAllowedToPickForCurrentRound,
    setCurrentViewedGame,
    setListOfExpandedPrevious,
}: any) => {
    const onRefresh = useCallback(() => {
        setRefreshing(true)
        pullLatestLeagueData()
        wait(2000).then(() => setRefreshing(false))
    }, [])

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame.currentGameRound
        const currentRound = currentPlayer.rounds[currentGameRound]
        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.choice.result === 'lost')

        if (playerOutOfGame.length) {
            return (
                <View>
                    <Text>You are no longer in this game</Text>
                </View>
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice === false) {
            return (
                <ChooseTeam
                    calculateTeamsAllowedToPickForCurrentRound={calculateTeamsAllowedToPickForCurrentRound}
                    pullLatestLeagueData={pullLatestLeagueData}
                    currentRound={currentGameRound}
                    currentUserId={currentUserId}
                    gameId={currentGame.gameId}
                    leagueId={league.id}
                    leagueOnly={true}
                />
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice) {
            return (
                <View>
                    <Text>You have made your choice for this week.</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>You didn't select a team in time and are unfortunately now out of this game.</Text>
                </View>
            )
        }
    }

    const setListOfExpandedPreviousHelper = (index: number) => {
        if (listOfExpandedPrevious.includes(index)) {
            setListOfExpandedPrevious(listOfExpandedPrevious.filter((x: number) => x !== index))
        } else {
            setListOfExpandedPrevious(listOfExpandedPrevious.concat(index))
        }
    }

    if (loaded === 'league-found') {
        return (
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <SafeAreaView style={{ backgroundColor: 'transparent' }}>
                    <Container>
                        <Wrapper>
                            <CurrentRoundSelectionWrapper>
                                <CurrentRoundView
                                    currentUserId={currentUserId}
                                    currentViewedGame={currentViewedGame}
                                    gamesInLeague={gamesInLeague}
                                    listOfExpandedPrevious={listOfExpandedPrevious}
                                    selectionTimeEnded={selectionTimeEnded}
                                    setCurrentViewedGame={setCurrentViewedGame}
                                    setListOfExpandedPreviousHelper={setListOfExpandedPreviousHelper}
                                />
                            </CurrentRoundSelectionWrapper>
                            <SelectionWrapper>
                                <H2>Team Selection</H2>
                                <TeamSelectionText>{showTeamSelectionPage()}</TeamSelectionText>
                            </SelectionWrapper>
                        </Wrapper>
                    </Container>
                </SafeAreaView>
            </ScrollView>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return (
        <Container style={{ marginTop: 100 }}>
            <ActivityIndicator size="large" color="#827ee6" />
            <Text style={{ fontSize: 20 }}>Retrieving League information...</Text>
        </Container>
    )
}
