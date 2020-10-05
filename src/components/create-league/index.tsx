import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import ReactToggle from 'react-toggle'
import 'react-toggle/style.css'
import styled from 'styled-components'
import Select from 'react-select'
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

const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
`

const Input = styled.input`
    box-sizing: border-box;
    font-size: 15px;
    padding: 10px;
    width: 100%;
`

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 250px;
`

const LeagueAmountValue = styled('div')<HeadingStyled>`
    align-items: center;
    background: ${({ amount }) => (amount ? '#ccc' : '#fff')};
    border: 1px solid #ccc;
    cursor: pointer;
    display: flex;
    justify-content: center;
    height: 40px;
    padding: 3px;
    width: 40px;
`

const EntryFeeContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`

const QuestionWithToggleOption = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`

const SectionDivider = styled.div`
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
                        <div>Private League?</div>
                        <ReactToggle onChange={() => setPrivateLeague(!privateLeague)} />
                    </QuestionWithToggleOption>
                </SectionDivider>
                <SectionDivider>
                    <QuestionWithToggleOption>
                        <div>2nd place money back?</div>
                        <ReactToggle onChange={() => setSecondPlaceMoneyBack(!secondPlaceMoneyBack)} />
                    </QuestionWithToggleOption>
                </SectionDivider>
                <SectionDivider>
                    <div>Entry Fee</div>
                    <SectionDivider>
                        <EntryFeeContainer>
                            {entryFrees.map((fee: { key: number; amount: string }) => (
                                <LeagueAmountValue
                                    amount={selectedFee === fee.key}
                                    key={fee.key}
                                    onClick={() => setSelectedFee(fee.key)}
                                >
                                    {fee.amount}
                                </LeagueAmountValue>
                            ))}
                        </EntryFeeContainer>
                    </SectionDivider>
                </SectionDivider>
                <SectionDivider>
                    <Select
                        options={[{ value: 'Premier League', label: 'Premier League' }]}
                        placeholder="Select a competition"
                    />
                </SectionDivider>
                <SectionDivider>
                    <Button
                        onClick={leagueName.length === 0 ? null : getLeagueCreatorInformationThenCreateLeague}
                        disabled={leagueName.length === 0}
                    >
                        Create and join league
                    </Button>
                </SectionDivider>
            </InnerContainer>
        </Container>
    )
}
