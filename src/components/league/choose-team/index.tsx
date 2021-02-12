import React, { useCallback, useState, useRef } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'
import Carousel from 'react-native-snap-carousel'

import * as Images from 'src/images'
import { ButtonText } from 'src/ui-components/button'
import { updateUserGamweekChoice } from 'src/firebase-helpers'
import { calculateTeamsAllowedToPickForCurrentRound } from 'src/utils/calculateTeamsAllowedToPickForCurrentRound'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'
import { findOpponent } from './utils'

interface Props {
    currentRound: any
    pullLatestLeagueData: () => void
}

export const ChooseTeam = React.memo(({ currentRound, pullLatestLeagueData }: Props) => {
    const [selectedTeam, setSelectedTeam] = useState<string>('')
    const [activeSlide, setActiveSlide] = useState(0)
    const refCarousel = useRef()
    const currentPlayer = useSelector((store: { currentPlayer: any }) => store.currentPlayer)
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const league = useSelector((store: { league: any }) => store.league)
    const user = useSelector((store: { user: any }) => store.user)
    const teams = calculateTeamsAllowedToPickForCurrentRound({
        currentGame,
        currentPlayer,
        leagueTeams: PREMIER_LEAGUE_TEAMS,
    })

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
    }

    const snapToSelectedItem = useCallback(
        (index: number) => {
            if (!teams[index].chosen) {
                refCarousel?.current.snapToItem(index, true)
                return
            }
            refCarousel?.current.snapToItem(index + 1, true)
        },
        [teams],
    )

    const setActiveSlideAndTeam = useCallback(
        (index: number) => {
            if (teams[index].chosen) {
                // we should alert here
                return
            }
            setActiveSlide(index)
            setSelectedTeam(teams[index].value)
        },
        [teams],
    )

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => snapToSelectedItem(index)}>
                <FastImage
                    source={Images[item.value.replace(/\s/g, '').toLowerCase()]}
                    style={[styles.image, item.value === selectedTeam ? styles.selected : styles.unselected]}
                />
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.innerContainer}>
            <Carousel
                activeSlideOffset={2}
                enableMomentum={true}
                ref={refCarousel}
                onSnapToItem={(index: number) => setActiveSlideAndTeam(index)}
                layout={'default'}
                data={teams}
                renderItem={renderItem}
                sliderWidth={250}
                itemWidth={50}
            />

            <View style={styles.button}>
                <TouchableOpacity disabled={selectedTeam === null} onPress={submitChoice} activeOpacity={0.8}>
                    <View style={styles.buttonText}>
                        <Text>Confirm selection</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
})

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
