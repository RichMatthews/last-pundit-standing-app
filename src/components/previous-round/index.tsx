import React from 'react'
import styled from 'styled-components'
import { Image, Text, View } from 'react-native'

import * as Images from '../../images'

interface ImageStyled {
    lost: boolean
}

const Container = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
    margin: 15px auto;
`

const TeamBadge = styled.Image<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    height: 30px;
    width: 30px;
`

export const PreviousRound = ({ choice }: any) => {
    console.log(choice, 'choice!')
    const opponentTeamName: any = choice.opponent.name.replace(/\s/g, '').toLowerCase()
    const userTeamName: any = choice.value.replace(/\s/g, '').toLowerCase()

    return choice.teamPlayingAtHome ? (
        <Container>
            <TeamBadge source={Images[userTeamName]} lost={false} />
            <Text>{choice.goals}</Text>
            <Text>-</Text>
            <Text>{choice.opponent.goals}</Text>
            <TeamBadge source={Images[opponentTeamName]} lost={true} />
        </Container>
    ) : (
        <Container>
            <TeamBadge source={Images[opponentTeamName]} lost={true} />
            <Text>{choice.opponent.goals}</Text>
            <Text>-</Text>
            <Text>{choice.goals}</Text>
            <TeamBadge source={Images[userTeamName]} lost={false} />
        </Container>
    )
}
//
