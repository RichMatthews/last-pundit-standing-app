import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, Platform, View } from 'react-native'
import { useSelector } from 'react-redux'

import { updateUserGamweekChoice } from 'src/firebase-helpers'
import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'
import { findOpponent } from './utils'
import { Fixtures } from 'src/components/fixtures'

interface Props {
    currentRound: any
    pullLatestLeagueData: () => void
}

export const ChooseTeam = ({ currentRound, closeTeamSelectionModal, pullLatestLeagueData, fixtures }: Props) => {
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const league = useSelector((store: { league: any }) => store.league)
    const user = useSelector((store: { user: any }) => store.user)
    const teams = calculateTeamsAllowedToPickForCurrentRound({
        currentGame,
        currentPlayer,
        leagueTeams: PREMIER_LEAGUE_TEAMS,
    })
    const [selectedTeam, setSelectedTeam] = useState<string>('')

    useEffect(() => {
        console.log(
            fixtures,
            teams.filter((team) => team.chosen).map((team) => team['value']),
        )
    }, [])

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
        const opponent = await findOpponent(selectedTeam)
        const choice = {
            hasMadeChoice: true,
            ...opponent,
            result: 'pending',
            value: selectedTeam,
        }

        await updateUserGamweekChoice({ choice, currentRound, currentGame, league, userId: user.id })
        await pullLatestLeagueData()

        closeTeamSelectionModal()
    }

    return (
        <View style={styles.innerContainer}>
            <Fixtures
                fixtures={fixtures}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                chosenTeams={teams.filter((team) => team.chosen).map((team) => team['value'])}
            />
            <View style={styles.button}>
                <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice} activeOpacity={0.8}>
                    <View style={styles.buttonText}>
                        <Text style={styles.confirmSelectionText}>Confirm selection</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        color: '#fff',
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
        fontSize: 17,
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
