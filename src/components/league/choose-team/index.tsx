import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, Platform, View } from 'react-native'
import { useSelector } from 'react-redux'

import { updateUserGamweekChoice } from 'src/firebase-helpers'
import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'
import { findOpponent } from './utils'
import { Fixtures } from 'src/components/fixtures'
import { SelectionModal } from './selection-modal'

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
    const playerHasMadeChoice = currentPlayer.rounds[currentPlayer.rounds.length - 1].selection.complete
    const [selectedTeam, setSelectedTeam] = useState<{ code: string; name: string; index: 0 }>()
    const [modalOpen, setModalOpen] = useState(false)
    const [opponent, setOpponent] = useState(null)

    const submitChoice = async () => {
        if (!selectedTeam) {
            return
        }
        const { opponent: opponentData } = await findOpponent(selectedTeam)

        setOpponent(opponentData)
        setModalOpen(true)
    }

    const updateUserGamweekChoiceHelper = async () => {
        const selection = {
            code: selectedTeam?.code,
            complete: true,
            name: selectedTeam?.name,
            opponent,
            result: 'pending',
        }
        await updateUserGamweekChoice({ selection, currentRound, currentGame, league, userId: user.id })
        await pullLatestLeagueData()
        setModalOpen(false)

        closeTeamSelectionModal()
    }

    return (
        <View style={styles(theme).innerContainer}>
            <Fixtures
                playerHasMadeChoice={playerHasMadeChoice}
                fixtures={fixtures}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                chosenTeams={teams.filter((team) => team.chosen).map((team) => team['code'])}
                theme={theme}
            />
            {!playerHasMadeChoice && (
                <View style={styles(theme).button}>
                    <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice} activeOpacity={0.8}>
                        <View style={styles(theme).buttonText}>
                            <Text style={styles(theme).confirmSelectionText}>Confirm selection</Text>
                            {selectedTeam && opponent && (
                                <SelectionModal
                                    selectedTeam={selectedTeam}
                                    modalOpen={modalOpen}
                                    setModalOpen={setModalOpen}
                                    selectedTeamOpponent={opponent}
                                    updateUserGamweekChoiceHelper={updateUserGamweekChoiceHelper}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        alreadySelectedTeam: {
            opacity: 0.1,
        },
        button: {
            marginTop: 10,
        },
        buttonText: {
            backgroundColor: '#9f85d4',
            borderRadius: 5,
            padding: 10,
        },
        confirmSelectionText: {
            color: theme.text.inverse,
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
