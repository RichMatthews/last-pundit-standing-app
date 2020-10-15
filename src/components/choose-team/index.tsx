import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Picker } from '@react-native-community/picker'
import styled from 'styled-components'

import { CURRENT_GAMEWEEK } from '../../admin/current-week'
import { Button, ButtonText } from '../../ui-components/button'

import { updateUserGamweekChoice } from '../../firebase-helpers'

import { Container, Inner } from '../../ui-components/containers'

const SectionDivider = styled.View`
    margin: 15px 0 0 0;
`

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
        console.log(selectedTeam, 'selet')
        if (!selectedTeam.label) {
            alert('No team selected!')
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
    console.log(selectedTeam, 'st')
    return (
        <Container>
            <Inner>
                <Picker onValueChange={(value: any) => setSelectedTeam(value)} selectedValue={selectedTeam}>
                    {calculateTeamsAllowedToPickForCurrentRound().map((item) => {
                        return <Picker.Item label={item.label} value={item.value} />
                    })}
                </Picker>
                <SectionDivider>
                    <TouchableOpacity onPress={submitChoice}>
                        <Button disabled={selectedTeam.label === null}>
                            <ButtonText>Select team</ButtonText>
                        </Button>
                    </TouchableOpacity>
                </SectionDivider>
            </Inner>
        </Container>
    )
}
