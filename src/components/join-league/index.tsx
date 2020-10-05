import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '../button'

import { attemptToJoinLeaugeIfItExists, joinLeagueAndAddLeagueToListOfUserLeagues } from '../../firebase-helpers'

interface JoinLeagueProps {
    currentUserId: string
}

const Container = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 50px;
`

const Input = styled.input`
    box-sizing: border-box;
    font-size: 15px;
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
`

export const JoinLeague = ({ currentUserId }: JoinLeagueProps) => {
    const [leaguePin, setLeaguePin] = useState<string | null>(null)
    const history = useHistory()

    const attemptToJoinLeague = (league: any, name: string, surname: string) => {
        const games = Object.values(league.games)
        const currentGame: any = games.filter((game: any) => game !== game.complete)
        if (currentGame) {
            const currentPlayers = Object.values(currentGame[0].players)
            const playerAlreadyInLeague = currentPlayers.find((player: any) => player.id === currentUserId)
            if (playerAlreadyInLeague) {
                alert('You have already entered this league!')
            } else {
                const theDataToBeSynced = {
                    [`/leagues/${league.id}/games/${currentGame[0].gameId}/players/${currentUserId}`]: {
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
                joinLeagueAndAddLeagueToListOfUserLeagues(history, theDataToBeSynced, league)
            }
        }
    }

    const joinLeague = async () => {
        const foundLeague: any = await attemptToJoinLeaugeIfItExists({ currentUserId, leaguePin })
        console.log(foundLeague, 'fl')

        if (foundLeague) {
            const { league, name, surname } = foundLeague
            attemptToJoinLeague(league, name, surname)
        }
    }

    return (
        <Container>
            <div>
                <Input onChange={(e) => setLeaguePin(e.target.value)} placeholder="Enter league pin" />
                <Button onClick={joinLeague}>Join League</Button>
            </div>
        </Container>
    )
}
