import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity, View } from 'react-native'

import { H1, H2 } from '../../ui-components/headings'

interface LeagueState {
    name?: string
    id?: string
}

const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 100px;
`

const Inner = styled.View`
    margin-top: 50px;
    width: 300px;
`

const LeagueContainer = styled.View`
    display: flex;
    flex-direction: column;
    width: 100%;
`

// const StyledLink = styled(Link)`
//     color: #289960;
//     text-decoration: none;
// `

// const StyledLinkButton = styled(Link)`
//     background: #289960;
//     border-radius: 3px;
//     color: #fff;
//     margin-top: 55px;
//     padding: 10px;
//     text-align: center;
//     text-decoration: none;
// `

export const MyLeagues = ({ navigation, userLeagues }: any) => {
    return (
        <Container>
            <H1>My Leagues</H1>
            <Inner>
                <LeagueContainer>
                    <H2>Private Leagues</H2>
                    {userLeagues.filter((league: any) => league.isPrivate).length ? (
                        userLeagues
                            .filter((league: any) => league.isPrivate)
                            .map((league: LeagueState) => (
                                <TouchableOpacity onPress={() => navigation.navigate('League', { id: league.id })}>
                                    <View key={league.id}>
                                        <Text>{league.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                    ) : (
                        <View>
                            <Text>You have not entered any private leagues yet</Text>
                        </View>
                    )}
                </LeagueContainer>

                <LeagueContainer>
                    <H2>Public Leagues</H2>
                    {userLeagues.filter((league: any) => !league.isPrivate).length ? (
                        userLeagues
                            .filter((league: any) => !league.isPrivate)
                            .map((league: LeagueState) => (
                                <TouchableOpacity onPress={() => navigation.navigate('My Leagues', { id: league.id })}>
                                    <View key={league.id}>
                                        <Text>{league.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                    ) : (
                        <View>
                            <Text>You have not entered any public leagues yet</Text>
                        </View>
                    )}
                </LeagueContainer>
                <TouchableOpacity onPress={() => navigation.navigate(`/join`)}>
                    <Text>Click here to join a league</Text>
                </TouchableOpacity>
            </Inner>
        </Container>
    )
}
