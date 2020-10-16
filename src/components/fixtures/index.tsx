import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import * as Images from '../../images'
import { H2 } from '../../ui-components/headings'
// import { Container } from '../../ui-components/containers'

import { getCurrentGameweekFixtures } from '../../firebase-helpers'

const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
`

const Inner = styled.View`
    display: ${({ expand }) => (expand ? 'flex' : 'none')};
    margin-top: 20px;
    justify-content: center;
    width: 300px;
`

const Center = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px;
    width: 100px;
`

const Match = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
`

const HomeTeam = styled.View<any>`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;

    width: 120px;
`

const AwayTeam = styled(HomeTeam)`
    align-items: flex-start;
`

const TeamBadge = styled.Image`
    height: 30px;
    width: 30px;
`

const LeagueNameAndLeagueTypeImage = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const ExpandImage = styled.Image<any>`
    align-self: center;
    height: 15px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};
    width: 15px;
`

export const Fixtures = () => {
    const [gameweekFixtures, setGameweekFixtures] = useState([])
    const [showFixtures, setShowFixtures] = useState(false)

    useEffect(() => {
        async function fetchFixtures() {
            const fixtures: any = await getCurrentGameweekFixtures()
            setGameweekFixtures(fixtures)
        }
        fetchFixtures()
    }, [])

    return (
        <TouchableOpacity onPress={() => setShowFixtures(!showFixtures)} activeOpacity={1}>
            <LeagueNameAndLeagueTypeImage>
                <H2>Gameweek Fixtures</H2>
                <ExpandImage expand={showFixtures} source={require('../../images/other/down-arrow.png')} />
            </LeagueNameAndLeagueTypeImage>
            <Container>
                <Inner expand={showFixtures}>
                    {gameweekFixtures.map((match: any) => (
                        <Match key={match.home}>
                            <HomeTeam homeTeam={true}>
                                <Text>{match.home}</Text>
                            </HomeTeam>
                            <Center>
                                <TeamBadge source={Images[match.home.replace(/\s/g, '').toLowerCase()]} />
                                <Text style={{ marginLeft: 10, marginRight: 10 }}> vs </Text>
                                <TeamBadge source={Images[match.away.replace(/\s/g, '').toLowerCase()]} />
                            </Center>
                            <AwayTeam homeTeam={false}>
                                <Text>{match.away}</Text>
                            </AwayTeam>
                        </Match>
                    ))}
                </Inner>
            </Container>
        </TouchableOpacity>
    )
}
// const HistoricalRounds = styled.View<any>`
//     display: ${({ expand }) => (expand ? 'flex' : 'none')};
//     margin: 15px;
// `
