import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity, View } from 'react-native'

import { Button, ButtonText } from '../../ui-components/button'
import { H1, H2 } from '../../ui-components/headings'
import { Container, Inner } from '../../ui-components/containers'

interface LeagueState {
    name?: string
    id?: string
}

const LeagueContainer = styled.View`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const LeagueItem = styled.View`
    margin: 10px 10px 10px 0;
`

const LeagueName = styled.Text`
    color: #827ee6;
    font-size: 17px;
`
const NoLeagueText = styled(LeagueName)`
    color: #000;
`

export const MyLeagues = ({ navigation, userLeaguesFetchComplete, userLeagues }: any) => {
    return (
        <Container>
            <H1>My Leagues</H1>
            <Inner>
                <LeagueContainer>
                    <H2>Private Leagues</H2>

                    {userLeaguesFetchComplete ? (
                        userLeagues.filter((league: any) => league.isPrivate).length ? (
                            userLeagues
                                .filter((league: any) => league.isPrivate)
                                .map((league: LeagueState) => (
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('League', { leagueId: league.id })}
                                    >
                                        <LeagueItem key={league.id}>
                                            <LeagueName>{league.name}</LeagueName>
                                        </LeagueItem>
                                    </TouchableOpacity>
                                ))
                        ) : (
                            <View>
                                <LeagueItem>
                                    <NoLeagueText>You have not entered any public leagues yet</NoLeagueText>
                                </LeagueItem>
                            </View>
                        )
                    ) : (
                        <Text>Fetching Leagues...</Text>
                    )}
                </LeagueContainer>

                <LeagueContainer>
                    <H2>Public Leagues</H2>
                    {userLeagues.filter((league: any) => !league.isPrivate).length ? (
                        userLeagues
                            .filter((league: any) => !league.isPrivate)
                            .map((league: LeagueState) => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('League', { leagueId: league.id })}
                                >
                                    <LeagueItem key={league.id}>
                                        <LeagueName>{league.name}</LeagueName>
                                    </LeagueItem>
                                </TouchableOpacity>
                            ))
                    ) : (
                        <View>
                            <LeagueItem>
                                <NoLeagueText>You have not entered any public leagues yet</NoLeagueText>
                            </LeagueItem>
                        </View>
                    )}
                </LeagueContainer>
                <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                    <Button marginTop={100}>
                        <ButtonText>Click here to join a league</ButtonText>
                    </Button>
                </TouchableOpacity>
            </Inner>
        </Container>
    )
}
