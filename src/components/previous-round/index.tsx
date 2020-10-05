import React from 'react'
import styled from 'styled-components'
import { Image, Text, View } from 'react-native'

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
    width: 30px;

    @media (max-width: 900px) {
        width: 30px;
    }
`

export const PreviousRound = ({ choice }: any) => {
    return choice.teamPlayingAtHome ? (
        <Container>
            <TeamBadge src={`/images/teams/${choice.value.replace(/\s/g, '').toLowerCase()}.png`} lost={false} />
            <Text>{choice.goals}</Text>
            <Text>-</Text>
            <Text>{choice.opponent.goals}</Text>
            <TeamBadge src={`/images/teams/${choice.opponent.name.replace(/\s/g, '').toLowerCase()}.png`} lost={true} />
        </Container>
    ) : (
        <Container>
            <TeamBadge src={`/images/teams/${choice.opponent.name.replace(/\s/g, '').toLowerCase()}.png`} lost={true} />
            <Text>{choice.opponent.goals}</Text>
            <Text>-</Text>
            <Text>{choice.goals}</Text>
            <TeamBadge src={`/images/teams/${choice.value.replace(/\s/g, '').toLowerCase()}.png`} lost={false} />
        </Container>
    )
}
