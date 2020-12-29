import React, { Fragment, useState } from 'react'
import { ActivityIndicator, Keyboard, TouchableOpacity, TouchableWithoutFeedback, Text, View } from 'react-native'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'

import { Button, ButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'
import { attemptToJoinLeaugeIfItExists, joinLeagueAndAddLeagueToListOfUserLeagues } from 'src/firebase-helpers'
import { getLeagues } from 'src/redux/reducer/leagues'
interface JoinLeagueProps {
    currentUserId: string
    navigation: {
        navigate: () => void
    }
}

const Input = styled.TextInput`
    background: #f7f7f7;
    align-self: center;
    font-size: 15px;
    padding: 10px;
    margin-bottom: 20px;
    margin: 10px;
    width: 100%;
`

export const JoinLeague = ({ currentUserId, navigation }: JoinLeagueProps) => {
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
        <Container style={{ backgroundColor: '#fff' }}>
            <ActivityIndicator size="large" color="#2C3E50" />
            <Text>Joining League...</Text>
        </Container>
    ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container style={{ backgroundColor: '#fff' }}>
                <Text style={{ color: '#2C3E50' }}>Please enter a pin to join a league</Text>
                <View>
                    <View style={{ marginTop: 20, width: 400 }}>
                        <Input
                            autoFocus={true}
                            onChange={(e) => setLeaguePin(e.nativeEvent.text)}
                            placeholder="League pin"
                        />

                        <TouchableOpacity onPress={joinLeague} disabled={leaguePin === ''}>
                            <View style={{ display: 'flex', alignSelf: 'flex-start' }}>
                                <Button disabled={leaguePin === ''}>
                                    <ButtonText>Join League</ButtonText>
                                </Button>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>
        </TouchableWithoutFeedback>
    )
}
