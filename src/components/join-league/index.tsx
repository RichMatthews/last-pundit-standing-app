import React, { useState } from 'react'
import { SafeAreaView, TextInput, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import { Button, ButtonText } from '../../ui-components/button'
import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

import { attemptToJoinLeaugeIfItExists, joinLeagueAndAddLeagueToListOfUserLeagues } from '../../firebase-helpers'

interface JoinLeagueProps {
    currentUserId: string
    navigation: {
        navigate: () => void
    }
}

const Input = styled.TextInput`
    border-color: #ccc;
    border-width: 1px;
    font-size: 15px;
    margin-bottom: 20px;
    padding: 10px;
    width: 300px;
`

export const JoinLeague = ({ currentUserId, navigation }: JoinLeagueProps) => {
    const [leaguePin, setLeaguePin] = useState<string>('')

    const attemptToJoinLeague = (league: any, name: string, surname: string) => {
        const games = Object.values(league.games)
        const currentGame: any = games.filter((game: any) => game !== game.complete)
        if (currentGame) {
            const currentPlayers = Object.values(currentGame[0].players)
            const playerAlreadyInLeague = currentPlayers.find((player: any) => player.id === currentUserId)
            if (playerAlreadyInLeague) {
                alert('You have already entered this league!')
            } else {
                const leagueAndUserData = {
                    [`/leagues/${league.id}/games/${currentGame[0].game.id}/players/${currentUserId}`]: {
                        id: currentUserId,
                        name: name + surname,
                        rounds: [{ choice: { hasMadeChoice: false } }],
                    },
                    [`/users/${currentUserId}/leagues/${league.id}`]: {
                        id: league.id,
                        isPrivate: league.isPrivate,
                        name: league.name,
                    },
                }
                joinLeagueAndAddLeagueToListOfUserLeagues({ leagueAndUserData, league, navigation })
            }
        }
    }

    const joinLeague = async () => {
        const foundLeague: any = await attemptToJoinLeaugeIfItExists({ currentUserId, leaguePin })

        if (foundLeague) {
            const { league, name, surname } = foundLeague
            attemptToJoinLeague(league, name, surname)
        }
    }

    return (
        <SafeAreaView>
            <Container>
                <H1 style={{ marginBottom: 30 }}>Join a League</H1>
                <View>
                    <Input onChange={(e) => setLeaguePin(e.nativeEvent.text)} placeholder="Enter league pin" />
                    <TouchableOpacity onPress={joinLeague} disabled={leaguePin === ''}>
                        <Button disabled={leaguePin === ''}>
                            <ButtonText>Join League</ButtonText>
                        </Button>
                    </TouchableOpacity>
                </View>
            </Container>
        </SafeAreaView>
    )
}
