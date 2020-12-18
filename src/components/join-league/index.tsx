import React, { Fragment, useState } from 'react'
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native'
import styled from 'styled-components'

import { Button, ButtonText } from '../../ui-components/button'
import { Container } from '../../ui-components/containers'
import LinearGradient from 'react-native-linear-gradient'
import { SvgBackground } from 'src/components/svg-background'
import { attemptToJoinLeaugeIfItExists, joinLeagueAndAddLeagueToListOfUserLeagues } from '../../firebase-helpers'
import { H1, ScreenHeading } from '../../ui-components/headings'

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

    const attemptToJoinLeague = (league: any, name: string, surname: string) => {
        const games = Object.values(league.games)
        const currentGame: any = games.filter((game: any) => game !== game.complete)
        if (currentGame) {
            const currentPlayers = Object.values(currentGame[0].players)
            const playerAlreadyInLeague = currentPlayers.find((player: any) => player.id === currentUserId)
            if (playerAlreadyInLeague) {
                alert('You have already entered this league!')
            } else {
                console.log('DATA:', league, currentGame[0], currentUserId)
                const leagueAndUserData = {
                    [`/leagues/${league.id}/games/${currentGame[0].id}/players/${currentUserId}`]: {
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
        <Fragment>
            {/* <ScreenHeading title={'Join League'} /> */}

            <Container style={{ backgroundColor: '#fff' }}>
                <Text>Please enter a pin to join a league</Text>
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
        </Fragment>
    )
}

{
    /* <SafeAreaView style={{ backgroundColor: '#fff' }}>
<View
    style={{
        backgroundColor: '#827ee6',

        padding: 20,
        width: '100%',
        borderBottomRightRadius: 40,
        borderBottomLeftRadius: 40,
    }}
>
    <H1 style={{ color: '#fff' }}>Join League</H1>
</View> */
}
