import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

interface LeagueState {
    name?: string
    id?: string
}

interface LeagueProps {
    userLeagues: []
}

const Container = styled.div``

const Inner = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 300px;
    margin: auto;
`

const LeagueContainer = styled.div`
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
    cursor: pointer;
    margin-top: 55px;
    padding: 10px;
    text-align: center;
    text-decoration: none;
`

export const MyLeagues = ({ userLeagues }: LeagueProps) => {
    return (
        <Container>
            <Inner>
                <h1>My Leagues</h1>
                <LeagueContainer>
                    <h3>Private Leagues</h3>
                    {userLeagues.filter((league: any) => league.isPrivate).length ? (
                        userLeagues
                            .filter((league: any) => league.isPrivate)
                            .map((league: LeagueState) => (
                                <StyledLink to={`/leagues/${league.id}`}>
                                    <div>{league.name}</div>
                                </StyledLink>
                            ))
                    ) : (
                        <div>You have not entered any private leagues yet</div>
                    )}
                </LeagueContainer>

                <LeagueContainer>
                    <h3>Public Leagues</h3>
                    {userLeagues.filter((league: any) => !league.isPrivate).length ? (
                        userLeagues
                            .filter((league: any) => !league.isPrivate)
                            .map((league: LeagueState) => (
                                <StyledLink to={`/leagues/${league.id}`}>
                                    <div>{league.name}</div>
                                </StyledLink>
                            ))
                    ) : (
                        <div>You have not entered any public leagues yet</div>
                    )}
                </LeagueContainer>
                <StyledLinkButton to={`/join`}>Click here to join a league</StyledLinkButton>
            </Inner>
        </Container>
    )
}
