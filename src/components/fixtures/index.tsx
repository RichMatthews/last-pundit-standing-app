import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { getCurrentGameweekFixtures } from '../../firebase-helpers'

const Container = styled.div`
    @media (max-width: 900px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 150px;
    }
`

const Center = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 5px;
    width: 100px;
`

const Match = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 5px;
`

const Team = styled.div<any>`
    display: flex;
    justify-content: ${({ homeTeam }) => (homeTeam ? 'flex-end' : 'flex-start')};
    width: 200px;

    @media (max-width: 900px) {
        display: none;
    }
`

export const Fixtures = () => {
    const [gameweekFixtures, setGameweekFixtures] = useState([])

    useEffect(() => {
        async function fetchFixtures() {
            const fixtures: any = await getCurrentGameweekFixtures()
            setGameweekFixtures(fixtures)
        }

        fetchFixtures()
    }, [])

    return (
        <Container>
            {gameweekFixtures.map((match: any) => (
                <Match>
                    <Team homeTeam={true}>{match.home}</Team>
                    <Center>
                        <img
                            src={`/images/teams/${match.home.replace(/\s/g, '').toLowerCase()}.png`}
                            height="30px"
                            width="30px"
                        />
                        <div> vs </div>
                        <img
                            src={`/images/teams/${match.away.replace(/\s/g, '').toLowerCase()}.png`}
                            height="30px"
                            width="30px"
                        />
                    </Center>
                    <Team homeTeam={false}>{match.away}</Team>
                </Match>
            ))}
        </Container>
    )
}
