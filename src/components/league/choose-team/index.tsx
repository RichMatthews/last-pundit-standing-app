import React, { useState } from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'

import * as Images from 'src/images'
import { Button, ButtonText } from 'src/ui-components/button'
import { getCurrentGameweekFixtures, updateUserGamweekChoice } from 'src/firebase-helpers'
import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'

interface Props {
    currentRound: any
    pullLatestLeagueData: () => void
    setCurrentScreenView: (screen: string) => void
}

export const ChooseTeam = React.memo(({ currentRound, pullLatestLeagueData, setCurrentScreenView }: Props) => {
    const [selectedTeam, setSelectedTeam] = useState<string>('')
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const league = useSelector((store: { league: any }) => store.league)
    const user = useSelector((store: { user: any }) => store.user)
    const findOpponent = async () => {
        const fixtures = await getCurrentGameweekFixtures()
        const selectedTeamFixture: any = fixtures.find(
            (team: { home: string; away: string; result: string }) =>
                team.home === selectedTeam || team.away === selectedTeam,
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

    const setSelectedTeamHelper = (value: string) => {
        if (value !== '0') {
            setSelectedTeam(value)
        }
    }

    const submitChoice = () => {
        if (!selectedTeam) {
            alert('No team selected!')
            return
        }
        const confirmationMsg: string = `You are picking ${selectedTeam}. Are you sure? Once you confirm you are locked in for this gameweek.`

        Alert.alert(
            'Confirm team selection',
            confirmationMsg,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'Confirm', onPress: () => updateUserGamweekChoiceHelper() },
            ],
            { cancelable: false },
        )
    }

    const updateUserGamweekChoiceHelper = async () => {
        const opponent = await findOpponent()
        const choice = {
            hasMadeChoice: true,
            ...opponent,
            result: 'pending',
            value: selectedTeam,
        }

        await updateUserGamweekChoice({ choice, currentRound, currentGame, league, userId: user.id })
        await pullLatestLeagueData()

        setCurrentScreenView('game')
    }

    return (
        <View>
            <View style={styles(undefined).innerContainer}>
                {calculateTeamsAllowedToPickForCurrentRound({
                    currentGame,
                    currentPlayer,
                    leagueTeams: PREMIER_LEAGUE_TEAMS,
                }).map((item: { value: string; label: string; id: number; chosen: boolean }) => {
                    return item.chosen ? (
                        <TouchableOpacity onPress={null} activeOpacity={1}>
                            <View selected={false} style={[styles(undefined).teamLogo]}>
                                <FastImage
                                    source={Images[item.value.replace(/\s/g, '').toLowerCase()]}
                                    style={[styles(undefined).image, styles(undefined).alreadySelectedTeam]}
                                />
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => setSelectedTeamHelper(item.value)} activeOpacity={1}>
                            <View style={styles(item.value === selectedTeam).teamLogo}>
                                <FastImage
                                    source={Images[item.value.replace(/\s/g, '').toLowerCase()]}
                                    style={styles(undefined).image}
                                />
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
            <View style={styles(undefined).button}>
                <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice} activeOpacity={0.8}>
                    <Button disabled={selectedTeam === null}>
                        <ButtonText>Confirm selection</ButtonText>
                    </Button>
                </TouchableOpacity>
            </View>
        </View>
    )
})

const styles = (selected: boolean | undefined) =>
    StyleSheet.create({
        alreadySelectedTeam: {
            opacity: 0.1,
        },
        button: {
            marginTop: 30,
        },
        image: {
            height: 40,
            width: 40,
        },
        innerContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        teamLogo: {
            backgroundColor: selected ? '#eee' : 0,
            borderRadius: selected ? 5 : 0,
            padding: 5,
            margin: 10,
        },
    })
