import React, { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, Platform, View } from 'react-native'
import { useSelector } from 'react-redux'

import { updateUserGamweekChoice } from 'src/firebase-helpers'
import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'
import { findOpponent, isTeamPlayingInADoubleGameweek } from './utils'
import { Fixtures } from 'src/components/fixtures'

interface Props {
    currentRound: any
    pullLatestLeagueData: () => void
}

export const ChooseTeam = ({ currentRound, closeTeamSelectionModal, pullLatestLeagueData, fixtures, theme }: Props) => {
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const league = useSelector((store: { league: any }) => store.league)
    const user = useSelector((store: { user: any }) => store.user)
    const teams = calculateTeamsAllowedToPickForCurrentRound({
        currentGame,
        currentPlayer,
        leagueTeams: PREMIER_LEAGUE_TEAMS,
    })
    const [selectedTeam, setSelectedTeam] = useState<{ code: string; name: string }>()

    const submitChoice = () => {
        if (!selectedTeam) {
            alert('No team selected!')
            return
        }

        const confirmationMsg: string = `You are picking ${selectedTeam.name}. Are you sure? Once you confirm you are locked in for this gameweek.`

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

    const showModalForDoubleGameweek = () => {}

    const updateUserGamweekChoiceHelper = async () => {
        const opponentPlayingAtLeastTwice = await isTeamPlayingInADoubleGameweek(selectedTeam)

        if (opponentPlayingAtLeastTwice) {
            showModalForDoubleGameweek()
            return
        } else {
            const opponent = await findOpponent(selectedTeam)
            console.log(opponent, 'opnt')
            const choice = {
                code: selectedTeam?.code,
                complete: true,
                name: selectedTeam?.name,
                ...opponent,
                result: 'pending',
            }
            console.log(choice, 'choi!')
            // await updateUserGamweekChoice({ choice, currentRound, currentGame, league, userId: user.id })
            // await pullLatestLeagueData()
        }

        closeTeamSelectionModal()
    }

    return (
        <View style={styles(theme).innerContainer}>
            <Fixtures
                fixtures={fixtures}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                chosenTeams={teams.filter((team) => team.chosen).map((team) => team['code'])}
                theme={theme}
            />
            <View style={styles(theme).button}>
                <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice} activeOpacity={0.8}>
                    <View style={styles(theme).buttonText}>
                        <Text style={styles(theme).confirmSelectionText}>Confirm selection</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        alreadySelectedTeam: {
            opacity: 0.1,
        },
        button: {
            marginTop: 30,
        },
        buttonText: {
            backgroundColor: '#9f85d4',
            borderRadius: 5,
            padding: 10,
        },
        confirmSelectionText: {
            color: theme.text.primary,
            fontWeight: '600',
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontSize: theme.text.large,
            textAlign: 'center',
        },
        image: {
            height: 50,
            width: 50,
        },
        selected: {
            opacity: 1,
        },
        unselected: {
            opacity: 0.2,
        },
        innerContainer: {
            flex: 1,
            alignSelf: 'center',
        },
    })
