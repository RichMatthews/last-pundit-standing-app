import React, { useState } from 'react'
import { Text, View } from 'react-native'
import Select from 'react-select'
import styled from 'styled-components'

import { CURRENT_GAMEWEEK } from '../../admin/current-week'
import { Button } from '../button'

import { updateUserGamweekChoice } from '../../firebase-helpers'

const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
`

const InnerContainer = styled.View`
    display: flex;
    flex-direction: column;
    width: 250px;
`

const SectionDivider = styled.View`
    margin: 15px 0 0 0;
`

const customReactSelectStyles = {
    control: (base: any) => ({
        ...base,
        background: '#fff',
        fontSize: 12,
        marginLeft: 0,
        marginBottom: 0,
    }),
    placeholder: (base: any) => ({
        ...base,
        fontSize: 12,
        color: '#9393A8',
    }),
    option: (base: any) => ({
        ...base,
        fontSize: 12,
    }),
    menu: (base: any) => ({
        ...base,
        fontSize: 12,
    }),
    menuList: (base: any) => ({
        ...base,
        fontSize: 12,
    }),
    valueContainer: (base: any) => ({
        ...base,
        fontSize: 12,
        minHeight: 40,
    }),
}

const Option = styled.View`
    align-items: center;
    display: flex;
    & > div {
        font-size: 15px;
    }
    & > img {
        margin-right: 10px;
    }
`
const formatOptionLabel = ({ label, value }: any) => (
    <Option>
        <img src={`/images/teams/${value.replace(/\s/g, '').toLowerCase()}.png`} alt="" height="30" width="30" />
        <View>
            <Text>{label}</Text>
        </View>
    </Option>
)

export const ChooseTeam = ({
    calculateTeamsAllowedToPickForCurrentRound,
    currentRound,
    currentUserId,
    gameId,
    leagueId,
    leagueOnly,
    pullLatestLeagueData,
}: any) => {
    const [selectedTeam, setSelectedTeam] = useState<any>({ label: null })

    const findOpposition = () => {
        const selectedTeamFixture: any = CURRENT_GAMEWEEK.fixtures.find(
            (team) => team.home === selectedTeam.label || team.away === selectedTeam.label,
        )
        const homeTeam = selectedTeamFixture['home']
        const awayTeam = selectedTeamFixture['away']
        const selectedTeamPlayingAtHome = homeTeam === selectedTeam.label

        if (selectedTeamPlayingAtHome) {
            return {
                teamPlayingAtHome: true,
                opponent: {
                    name: awayTeam,
                },
            }
        } else {
            return {
                teamPlayingAtHome: false,
                opponent: {
                    name: homeTeam,
                },
            }
        }
    }

    const submitChoice = () => {
        if (!selectedTeam.label) {
            return
        }
        const confirmation: any = window.confirm(
            `You are picking ${selectedTeam.label}. Are you sure? Once you confirm you are locked in for this gameweek.`,
        )
        if (confirmation && leagueOnly) {
            const choice = {
                hasMadeChoice: true,
                id: selectedTeam.id,
                ...findOpposition(),
                result: 'pending',
                value: selectedTeam.label,
            }
            updateUserGamweekChoice({ choice, currentRound, currentUserId, gameId, leagueId, pullLatestLeagueData })
        }
    }

    return (
        <Container>
            <InnerContainer>
                {/* <Select
                    onChange={(team: any) => setSelectedTeam(team)}
                    formatOptionLabel={formatOptionLabel}
                    isSearchable={false}
                    // options={calculateTeamsAllowedToPickForCurrentRound()}
                    options={[{ value: '', label: '' }]}
                    placeholder="Select a team for this week"
                    styles={customReactSelectStyles}
                /> */}

                <SectionDivider>
                    <Button disabled={selectedTeam.label === null} onClick={submitChoice}>
                        <Text>Select team</Text>
                    </Button>
                </SectionDivider>
            </InnerContainer>
        </Container>
    )
}
