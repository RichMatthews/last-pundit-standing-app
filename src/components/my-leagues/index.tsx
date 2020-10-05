import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-native'
import { Text, View } from 'react-native'

interface LeagueState {
    name?: string
    id?: string
}

interface LeagueProps {
    userLeagues: []
}

const Container = styled.View``

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

const StyledLink = styled(Link)`
    color: #289960;
    text-decoration: none;
`

const StyledLinkButton = styled(Link)`
    background: #289960;
    border-radius: 3px;
    color: #fff;
    margin-top: 55px;
    padding: 10px;
    text-align: center;
    text-decoration: none;
`

export const MyLeagues = ({ userLeagues }: LeagueProps) => {
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
                                <StyledLink to={`/leagues/${league.id}`}>
                                    <View>
                                        <Text>{league.name}</Text>
                                    </View>
                                </StyledLink>
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
                                <StyledLink to={`/leagues/${league.id}`}>
                                    <View>
                                        <Text>{league.name}</Text>
                                    </View>
                                </StyledLink>
                            ))
                    ) : (
                        <View>
                            <Text>You have not entered any public leagues yet</Text>
                        </View>
                    )}
                </LeagueContainer>
                <StyledLinkButton to={`/join`}>
                    <Text>Click here to join a league</Text>
                </StyledLinkButton>
            </Inner>
        </Container>
    )
}
