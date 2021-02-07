import React, { useState } from 'react'
import {
    ActivityIndicator,
    Keyboard,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    TextInput,
    View,
    StyleSheet,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Button, ButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'
import { ScreenComponent } from 'src/ui-components/containers/screenComponent'
import { attemptToJoinLeaugeIfItExists, joinLeagueAndAddLeagueToListOfUserLeagues } from 'src/firebase-helpers'
import { getLeagues } from 'src/redux/reducer/leagues'

interface JoinLeagueProps {
    currentUserId: string
    navigation: {
        navigate: () => void
    }
    theme: any
}

export const JoinLeague = ({ currentUserId, navigation, theme }: JoinLeagueProps) => {
    const [leaguePin, setLeaguePin] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const userFromRedux = useSelector((store: { user: any }) => store.user)

    const attemptToJoinLeague = async (league: any, name: string, surname: string) => {
        const games = Object.values(league.games)
        const currentGame: any = games.filter((game: any) => game !== game.complete)
        if (currentGame) {
            const currentPlayers = Object.values(currentGame[0].players)
            const playerAlreadyInLeague = currentPlayers.find((player: any) => player.id === currentUserId)
            if (playerAlreadyInLeague) {
                alert('You have already entered this league!')
                setLoading(false)
            } else {
                const leagueAndUserData = {
                    [`/leagues/${league.id}/games/${currentGame[0].id}/players/${currentUserId}`]: {
                        id: currentUserId,
                        name: name + ' ' + surname,
                        rounds: [{ choice: { hasMadeChoice: false } }],
                    },
                    [`/users/${currentUserId}/leagues/${league.id}`]: {
                        id: league.id,
                        isPrivate: league.isPrivate,
                        name: league.name,
                    },
                }
                await joinLeagueAndAddLeagueToListOfUserLeagues({ leagueAndUserData, league, navigation })
                await dispatch(getLeagues(userFromRedux.id))
                setLoading(false)
            }
        }
    }

    const joinLeague = async () => {
        setLoading(true)
        const foundLeague: any = await attemptToJoinLeaugeIfItExists({ currentUserId, leaguePin })

        if (foundLeague) {
            const { league, name, surname } = foundLeague
            attemptToJoinLeague(league, name, surname)
        } else {
            setLoading(false)
        }
    }

    return loading ? (
        <Container style={{ backgroundColor: theme.background.primary }}>
            <ActivityIndicator size="large" color="#2C3E50" />
            <Text>Joining League...</Text>
        </Container>
    ) : (
        <ScreenComponent theme={theme}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles(theme).container}>
                    <Text style={styles(theme).helperText}>Please enter a pin to join a league</Text>
                    <TextInput
                        autoFocus={true}
                        onChange={(e) => setLeaguePin(e.nativeEvent.text)}
                        placeholder="League pin"
                        placeholderTextColor={theme.text.primary}
                        style={styles(theme).textInput}
                    />
                    <TouchableOpacity onPress={joinLeague} disabled={leaguePin === ''}>
                        <Button disabled={leaguePin === ''}>
                            <ButtonText>Join League</ButtonText>
                        </Button>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </ScreenComponent>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
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
        helperText: {
            color: theme.text.primary,
            marginBottom: 20,
        },
    })
