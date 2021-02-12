import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Keyboard,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import uid from 'uid'

import { Button, ButtonText } from 'src/ui-components/button'
import { ScreenComponent } from 'src/ui-components/containers/screenComponent'
import { Container } from 'src/ui-components/containers'
import { getLeagueCreatorInformation } from 'src/firebase-helpers'
import { firebaseApp } from 'src/config.js'
import { getLeagues } from 'src/redux/reducer/leagues'

export const CreateLeague = ({ navigation, theme }: any) => {
    const [privateLeague, setPrivateLeague] = useState(true)
    const [leagueName, setLeagueName] = useState('')
    const [selectedFee, setSelectedFee] = useState(10)
    const [leagueNameTooLong, setLeagueNameTooLong] = useState(false)
    const [loading, setLoading] = useState(false)
    const user = useSelector((store: { user: any }) => store.user)
    const dispatch = useDispatch()

    const getLeagueCreatorInformationThenCreateLeague = async () => {
        if (leagueNameTooLong) {
            return
        }
        setLoading(true)
        const playerInfo: any = await getLeagueCreatorInformation(user.id)
        createLeague(playerInfo)
    }

    const createLeague = (playerInfo: { name: string }) => {
        const leagueCreationConfirmationMessage = `You are creating a ${
            privateLeague ? 'private' : 'public'
        } league called ${leagueName}. Click OK to confirm or cancel to make more changes`

        Alert.alert(
            'Confirm League Creation',
            leagueCreationConfirmationMessage,
            [
                {
                    text: 'Cancel',
                    onPress: () => setLoading(false),
                    style: 'cancel',
                },
                { text: 'Confirm', onPress: () => userConfirmedLeagueCreation(playerInfo) },
            ],
            { cancelable: false },
        )
    }

    const userConfirmedLeagueCreation = (playerInfo) => {
        const leagueId = uid()
        const leagueJoinPin = uid()
        const newGameId = uid()
        const updateMultipleLeaguesAndUsersJoinedLeagues = {
            [`/leagues/${leagueId}`]: {
                admin: {
                    name: playerInfo.name,
                    id: user.id,
                },
                currentRound: 0,
                entryFee: selectedFee,
                id: leagueId,
                games: {
                    [newGameId]: {
                        complete: false,
                        currentGameRound: 0,
                        id: newGameId,
                        players: {
                            [user.id]: {
                                id: user.id,
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
            },
            [`/users/${user.id}/leagues/${leagueId}`]: {
                id: leagueId,
                isPrivate: privateLeague,
                name: leagueName,
            },
        }
        return firebaseApp
            .database()
            .ref()
            .update(updateMultipleLeaguesAndUsersJoinedLeagues, async (error) => {
                if (error) {
                    alert('Failed to create league, please try again.')
                } else {
                    setLoading(false)
                    await dispatch(getLeagues(user.id))
                    navigation.navigate('League', { leagueId: leagueId })
                }
            })
    }

    const setLeagueNameHelper = (e: any) => {
        if (e.nativeEvent.text.length > 20) {
            setLeagueNameTooLong(true)
        } else {
            setLeagueNameTooLong(false)
        }
        setLeagueName(e.nativeEvent.text)
    }

    const entryFees = [
        { amount: 'Free', key: 0 },
        { amount: '£5', key: 5 },
        { amount: '£10', key: 10 },
        { amount: '£20', key: 20 },
    ]

    return loading ? (
        <Container>
            <ActivityIndicator size="large" color="#2C3E50" />
            <Text>Creating League...</Text>
        </Container>
    ) : (
        <ScreenComponent theme={theme}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles(theme).container}>
                    {leagueNameTooLong && <Text>League name must be 20 characters or less</Text>}
                    <TextInput
                        autoCorrect={false}
                        onChange={(e) => setLeagueNameHelper(e)}
                        placeholder="League name"
                        placeholderTextColor={theme.text.primary}
                        style={styles(theme).textInput}
                    />

                    <View style={styles(theme).optionsWrapper}>
                        <TouchableOpacity onPress={() => setPrivateLeague(true)}>
                            <View style={styles(theme, privateLeague).optionButton}>
                                <Text style={styles(theme, privateLeague).optionButtonText}>Private</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setPrivateLeague(false)}>
                            <View style={styles(theme, !privateLeague).optionButton}>
                                <Text style={styles(theme, !privateLeague).optionButtonText}>Public</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles(theme).optionsWrapper}>
                        {entryFees.map((fee: { key: number; amount: string }) => (
                            <TouchableOpacity onPress={() => setSelectedFee(fee.key)}>
                                <View
                                    key={fee.key}
                                    style={[
                                        styles(theme, selectedFee === fee.key).optionButton,
                                        styles(theme, selectedFee === fee.key).priceOptionButton,
                                    ]}
                                >
                                    <Text style={styles(theme, selectedFee === fee.key).optionButtonText}>
                                        {fee.amount}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View>
                        <TouchableOpacity
                            onPress={
                                leagueName.length === 0 ? null : () => getLeagueCreatorInformationThenCreateLeague()
                            }
                        >
                            <Button disabled={leagueName.length === 0 || leagueName.length > 20}>
                                <ButtonText>Create and join league</ButtonText>
                            </Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </ScreenComponent>
    )
}

const styles = (theme: any, active?: boolean) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
            padding: 15,
        },
        textInput: {
            backgroundColor: theme.input.backgroundColor,
            color: theme.text.primary,
            borderRadius: theme.borders.radius,
            fontSize: 15,
            padding: 10,
            marginBottom: 20,
            width: '100%',
        },
        optionsWrapper: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            marginBottom: 20,
        },
        optionButton: {
            borderWidth: 0,
            backgroundColor: active ? '#9f85d4' : '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 40,
            height: 30,
            width: 80,
            shadowOpacity: 1,
            shadowRadius: 3,
            shadowColor: '#aaa',
            shadowOffset: { height: 2, width: 0 },
        },
        priceOptionButton: {
            width: 60,
        },
        optionButtonText: {
            color: active ? '#fff' : 'purple',
        },
    })
