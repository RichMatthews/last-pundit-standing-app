import React, { useState } from 'react'
import {
    Alert,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import { Picker } from '@react-native-community/picker'
import styled from 'styled-components'

import * as Images from '../../images'
import { CURRENT_GAMEWEEK } from '../../admin/current-week'
import { Button, ButtonText } from '../../ui-components/button'

import { updateUserGamweekChoice } from '../../firebase-helpers'

const width = Dimensions.get('window').width

const SectionDivider = styled.View`
    min-width: 100%;
    width: 100%;
`

const SelectedTeam = styled.View`
    border-width: 1px;
    border-color: #ccc;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 10px;
    width: 100%;
`

const TeamBadge = styled.Image`
    resize-mode: contain;
    height: 25px;
    width: 25px;
`

export const ChooseTeam = ({
    calculateTeamsAllowedToPickForCurrentRound,
    currentRound,
    currentUserId,
    gameId,
    leagueId,
    leagueOnly,
    pullLatestLeagueData,
}: any) => {
    const [selectedTeam, setSelectedTeam] = useState<any>(null)
    const [modalOpen, setModalOpen] = useState(false)

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
        console.log(value === '0', 'val')
        if (value !== '0') {
            setSelectedTeam(value)
            // setModalOpen(false)
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
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'Confirm', onPress: () => updateUserGamweekChoiceHelper() },
            ],
            { cancelable: false },
        )
    }

    const updateUserGamweekChoiceHelper = () => {
        const choice = {
            hasMadeChoice: true,
            // id: selectedTeam.id,
            ...findOpponent(),
            result: 'pending',
            value: selectedTeam,
        }

        updateUserGamweekChoice({ choice, currentRound, currentUserId, gameId, leagueId, pullLatestLeagueData })
    }

    return (
        <View>
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    onRequestClose={() => setModalOpen(false)}
                    transparent={true}
                    visible={modalOpen}
                    style={styles.modalContent}
                >
                    <TouchableOpacity onPress={() => setModalOpen(!modalOpen)}>
                        <TouchableWithoutFeedback onPress={() => setModalOpen(!modalOpen)}>
                            <View style={{ height: '100%' }}></View>
                        </TouchableWithoutFeedback>
                    </TouchableOpacity>
                    <View style={styles.innerContainer}>
                        <Picker
                            onValueChange={(value: any) => setSelectedTeamHelper(value)}
                            selectedValue={selectedTeam}
                            style={{ display: 'flex', width: 150 }}
                        >
                            <Picker.Item label="Select a team.." value="0" />
                            {calculateTeamsAllowedToPickForCurrentRound().map((item) => {
                                return <Picker.Item label={item.label} value={item.value} />
                            })}
                        </Picker>
                    </View>
                </Modal>
            </View>
            <SectionDivider>
                <TouchableOpacity onPress={() => setModalOpen(true)}>
                    <SelectedTeam>
                        <Text>{selectedTeam ? selectedTeam : 'Select Team'}</Text>
                        {selectedTeam && (
                            <TeamBadge source={Images[selectedTeam.replace(/\s/g, '').toLowerCase()]} width="40" />
                        )}
                    </SelectedTeam>
                </TouchableOpacity>
                <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice}>
                    <Button disabled={selectedTeam === null}>
                        <ButtonText>Confirm selection</ButtonText>
                    </Button>
                </TouchableOpacity>
            </SectionDivider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width,
    },
    modalContent: {
        margin: 0,
    },
    modalContainer: {
        justifyContent: 'center',
    },
    innerContainer: {
        position: 'absolute',
        bottom: 0,
        opacity: 1,
        alignItems: 'center',
        backgroundColor: '#ccc',
        width,
    },
})
