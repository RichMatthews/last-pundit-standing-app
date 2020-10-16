import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import uid from 'uid'

import { Button, ButtonText } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'
import { getLeagueCreatorInformation } from '../../firebase-helpers'
import { firebaseApp } from '../../config.js'

interface CreateLeagueProps {
    currentUserId: string
}

interface HeadingStyled {
    amount: boolean
}

const Input = styled.TextInput`
    border-color: #ccc;
    border-width: 1px;
    font-size: 15px;
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
`

const LeagueAmountValue = styled.View<HeadingStyled>`
    align-items: center;
    background: ${({ amount }) => (amount ? '#ccc' : 'transparent')};
    border-width: 1px;
    border-color: #ccc;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    height: 40px;
    padding: 3px;
    width: 40px;
`

const EntryFeeContainer = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const QuestionWithToggleOption = styled.View`
    align-items: center;
    display: flex;
    justify-content: space-between;
`

const SectionDivider = styled.View`
    margin: 15px 0 0 0;
`

export const CreateLeague = ({ currentUserId }: CreateLeagueProps) => {
    const [privateLeague, setPrivateLeague] = useState(false)
    const [leagueName, setLeagueName] = useState('')
    const [selectedFee, setSelectedFee] = useState(10)

    const getLeagueCreatorInformationThenCreateLeague = async () => {
        const playerInfo: any = await getLeagueCreatorInformation(currentUserId)
        createLeague(playerInfo)
    }

    const createLeague = (playerInfo: { name: string }) => {
        const leagueCreationConfirmationMessage = window.confirm(
            `You are creating a ${
                privateLeague ? 'private' : 'public'
            } league called ${leagueName}. Click OK to confirm or cancel to make more changes`,
        )
        if (!leagueCreationConfirmationMessage) {
            return
        }
        const leagueId = uid()
        const leagueJoinPin = uid()
        const newGameId = uid()
        const updateMultipleLeaguesAndUsersJoinedLeagues = {
            [`/leagues/${leagueId}`]: {
                admin: {
                    name: playerInfo.name,
                    id: currentUserId,
                },
                currentRound: 0,
                entryFee: selectedFee,
                id: leagueId,
                games: {
                    [newGameId]: {
                        complete: false,
                        currentGameRound: 0,
                        gameId: newGameId,
                        players: {
                            [currentUserId]: {
                                id: currentUserId,
                                name: playerInfo.name,
                                rounds: [{ choice: { hasMadeChoice: false } }],
                            },
                        },
                        winner: false,
                    },
                },
                isPrivate: privateLeague,
                joinPin: leagueJoinPin,
                name: leagueName,
            },
            [`/users/${currentUserId}/leagues/${leagueId}`]: {
                id: leagueId,
                isPrivate: privateLeague,
                name: leagueName,
            },
        }
        firebaseApp
            .database()
            .ref()
            .update(updateMultipleLeaguesAndUsersJoinedLeagues, (error) => {
                if (error) {
                    alert('Failed to create league, please try again.')
                } else {
                    // history.push(`/leagues/${leagueId}`)
                }
            })
    }

    const setLeagueNameHelper = (e: any) => {
        setLeagueName(e.nativeEvent.text)
    }

    const entryFrees = [
        { amount: 'Free', key: 0 },
        { amount: '£5', key: 5 },
        { amount: '£10', key: 10 },
        { amount: '£20', key: 20 },
    ]

    return (
        <Container>
            <H1>Create League</H1>
            <Inner>
                <SectionDivider>
                    <Input autoCorrect={false} onChange={(e) => setLeagueNameHelper(e)} placeholder="League name" />
                </SectionDivider>
                <SectionDivider>
                    <QuestionWithToggleOption>
                        <Text>Private League?</Text>
                        {/* <ReactToggle onChange={() => setPrivateLeague(!privateLeague)} /> */}
                    </QuestionWithToggleOption>
                </SectionDivider>
                <SectionDivider>
                    <View>
                        <Text>Entry Fee</Text>
                    </View>
                    <SectionDivider>
                        <EntryFeeContainer>
                            {entryFrees.map((fee: { key: number; amount: string }) => (
                                <TouchableOpacity onPress={() => setSelectedFee(fee.key)}>
                                    <LeagueAmountValue amount={selectedFee === fee.key} key={fee.key}>
                                        <Text>{fee.amount}</Text>
                                    </LeagueAmountValue>
                                </TouchableOpacity>
                            ))}
                        </EntryFeeContainer>
                    </SectionDivider>
                </SectionDivider>
                <SectionDivider>
                    {/* <Select
                        options={[{ value: 'Premier League', label: 'Premier League' }]}
                        placeholder="Select a competition"
                    /> */}
                </SectionDivider>
                <SectionDivider>
                    <TouchableOpacity
                        onPress={leagueName.length === 0 ? null : () => getLeagueCreatorInformationThenCreateLeague()}
                    >
                        <Button disabled={leagueName.length === 0}>
                            <ButtonText>Create and join league</ButtonText>
                        </Button>
                    </TouchableOpacity>
                </SectionDivider>
            </Inner>
        </Container>
    )
}
