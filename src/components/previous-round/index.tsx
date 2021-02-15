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
    margin: 5px auto;
`

const TeamBadge = styled.Image<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    height: 30px;
    width: 30px;
`

export const PreviousRound = ({ choice, theme }: any) => {
    const opponentTeamName: any = choice.opponent.code.toUpperCase()
    const userTeamName: any = choice.code.toUpperCase()

    return choice.teamPlayingAtHome ? (
        <Container>
            <TeamBadge source={Images[userTeamName]} lost={false} />
            <Text style={{ color: theme.text.primary, fontSize: theme.text.large, fontWeight: '700' }}>
                {choice.goals}
            </Text>
            <Text style={{ color: theme.text.primary, fontSize: theme.text.large, fontWeight: '700' }}>-</Text>
            <Text style={{ color: theme.text.primary, fontSize: theme.text.large, fontWeight: '700' }}>
                {choice.opponent.goals}
            </Text>
            <TeamBadge source={Images[opponentTeamName]} lost={true} />
        </Container>
    ) : (
        <Container>
            <TeamBadge source={Images[opponentTeamName]} lost={true} />
            <Text style={{ color: theme.text.primary, fontSize: theme.text.large, fontWeight: '700' }}>
                {choice.opponent.goals}
            </Text>
            <Text style={{ color: theme.text.primary, fontSize: theme.text.large, fontWeight: '700' }}>-</Text>
            <Text style={{ color: theme.text.primary, fontSize: theme.text.large, fontWeight: '700' }}>
                {choice.goals}
            </Text>
            <TeamBadge source={Images[userTeamName]} lost={false} />
        </Container>
    )
}
