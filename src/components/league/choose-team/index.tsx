import React, { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import * as Images from 'src/images'
import { CURRENT_GAMEWEEK } from 'src/admin/current-week'
import { Button, ButtonText } from 'src/ui-components/button'
import { useDispatch, useSelector } from 'react-redux'

import { updateUserGamweekChoice } from 'src/firebase-helpers'

import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'

const SectionDivider = styled.View`
    margin-top: 15px;
`

const Team = styled.View`
    border-radius: ${({ selected }) => (selected ? '50px' : '0')};
    border-color: ${({ selected }) => (selected ? '#827ee6' : 'transparent')};
    border-width: 1px;
    padding: 10px;
    margin: 5px;
`

const Image = styled.Image`
    height: 40px;
    opacity: ${({ chosen }) => (chosen ? 0.2 : 1)};
    width: 40px;
`

export const ChooseTeam = React.memo(({ currentRound, pullLatestLeagueData, setCurrentScreenView }: any) => {
    const [selectedTeam, setSelectedTeam] = useState<any>(null)
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const league = useSelector((store: { league: any }) => store.league)
    const user = useSelector((store: { user: any }) => store.user)

    const findOpponent = () => {
        const selectedTeamFixture: any = CURRENT_GAMEWEEK.fixtures.find(
            (team) => team.home === selectedTeam || team.away === selectedTeam,
        )
        const homeTeam = selectedTeamFixture['home']
        const awayTeam = selectedTeamFixture['away']
        const selectedTeamPlayingAtHome = homeTeam === selectedTeam

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

    const setSelectedTeamHelper = (value: any) => {
        if (value !== '0') {
            setSelectedTeam(value)
        }
    }

    const submitChoice = () => {
        if (!selectedTeam) {
            alert('No team selected!')
            return
        }
        const confirmationMsg: any = `You are picking ${selectedTeam}. Are you sure? Once you confirm you are locked in for this gameweek.`

        Alert.alert(
            'Confirm team selection',
            confirmationMsg,
            [
                {
                    text: 'Cancel',
                    onPress: () => console.warn('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Confirm', onPress: () => updateUserGamweekChoiceHelper() },
            ],
            { cancelable: false },
        )
    }

    const updateUserGamweekChoiceHelper = async () => {
        const choice = {
            hasMadeChoice: true,
            // id: selectedTeam.id,
            ...findOpponent(),
            result: 'pending',
            value: selectedTeam,
        }

        await updateUserGamweekChoice({ choice, currentRound, currentGame, league, userId: user.id })
        await pullLatestLeagueData()

        setCurrentScreenView('game')
    }

    return (
        <View>
            <View style={styles.innerContainer}>
                {calculateTeamsAllowedToPickForCurrentRound({
                    currentGame,
                    currentPlayer,
                    leagueTeams: PREMIER_LEAGUE_TEAMS,
                }).map((item) => {
                    return item.chosen ? (
                        <TouchableOpacity onPress={null} activeOpacity={1}>
                            <Team selected={false}>
                                <Image source={Images[item.value.replace(/\s/g, '').toLowerCase()]} chosen={true} />
                            </Team>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setSelectedTeamHelper(item.value)} activeOpacity={0.5}>
                            <Team selected={item.value === selectedTeam}>
                                <Image source={Images[item.value.replace(/\s/g, '').toLowerCase()]} chosen={false} />
                            </Team>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <SectionDivider>
                <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice}>
                    <Button disabled={selectedTeam === null}>
                        <ButtonText>Confirm selection</ButtonText>
                    </Button>
                </TouchableOpacity>
            </SectionDivider>
        </View>
    )
})

const styles = StyleSheet.create({
    modalContent: {
        margin: 0,
    },
    innerContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
})
