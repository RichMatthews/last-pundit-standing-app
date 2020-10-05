import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { TextInput, Text, View } from 'react-native'
import Select from 'react-select'
import styled from 'styled-components'
import uid from 'uid'

import { Button } from '../button'

import { firebaseApp } from '../../config.js'
import { getLeagueCreatorInformation } from '../../firebase-helpers'

interface CreateLeagueProps {
    currentUserId: string
}

interface HeadingStyled {
    amount: boolean
}

const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
`

const Input = styled.TextInput`
    font-size: 15px;
    padding: 10px;
    width: 100%;
`

const InnerContainer = styled.View`
    display: flex;
    flex-direction: column;
    width: 250px;
`

const LeagueAmountValue = styled.View<HeadingStyled>`
    align-items: center;
    background: ${({ amount }) => (amount ? '#ccc' : '#fff')};
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    height: 40px;
    padding: 3px;
    width: 40px;
`

const EntryFeeContainer = styled.View`
    display: flex;
    flex-wrap: wrap;
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
    const [secondPlaceMoneyBack, setSecondPlaceMoneyBack] = useState(false)
    const [leagueName, setLeagueName] = useState('')
    const [selectedFee, setSelectedFee] = useState(10)
    const history = useHistory()

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
                secondPlaceMoneyBack,
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
                    history.push(`/leagues/${leagueId}`)
                }
            })
    }

    const setLeagueNameHelper = (e: any) => {
        setLeagueName(e.target.value)
    }

    const entryFrees = [
        { amount: 'Free', key: 0 },
        { amount: '£5', key: 5 },
        { amount: '£10', key: 10 },
        { amount: '£20', key: 20 },
    ]

    return (
        <Container>
            <InnerContainer>
                <SectionDivider>
                    <Input onChange={(e) => setLeagueNameHelper(e)} placeholder="League name" />
                </SectionDivider>
                <SectionDivider>
                    <QuestionWithToggleOption>
                        <Text>Private League?</Text>
                        {/* <ReactToggle onChange={() => setPrivateLeague(!privateLeague)} /> */}
                    </QuestionWithToggleOption>
                </SectionDivider>
                <SectionDivider>
                    <QuestionWithToggleOption>
                        <Text>2nd place money back?</Text>
                        {/* <ReactToggle onChange={() => setSecondPlaceMoneyBack(!secondPlaceMoneyBack)} /> */}
                    </QuestionWithToggleOption>
                </SectionDivider>
                <SectionDivider>
                    <View>
                        <Text>Entry Fee</Text>
                    </View>
                    <SectionDivider>
                        <EntryFeeContainer>
                            {entryFrees.map((fee: { key: number; amount: string }) => (
                                <LeagueAmountValue
                                    amount={selectedFee === fee.key}
                                    key={fee.key}
                                    onClick={() => setSelectedFee(fee.key)}
                                >
                                    <Text>{fee.amount}</Text>
                                </LeagueAmountValue>
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
                    <Button
                        onClick={leagueName.length === 0 ? null : getLeagueCreatorInformationThenCreateLeague}
                        disabled={leagueName.length === 0}
                    >
                        <Text>Create and join league</Text>
                    </Button>
                </SectionDivider>
            </InnerContainer>
        </Container>
    )
}
