import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity, View } from 'react-native'

interface LeagueState {
    name?: string
    id?: string
}

const Container = styled.View`
    margin-top: 100px;
`

const Inner = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: auto;
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
            <Inner>
                <Text>My Leagues</Text>
                <LeagueContainer>
                    <Text>Private Leagues</Text>
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
                    <Text>Public Leagues</Text>
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
