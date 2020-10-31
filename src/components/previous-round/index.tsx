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

export const PreviousRound = ({ choice }: any) => {
    const opponentTeamName: any = choice.opponent.name.replace(/\s/g, '').toLowerCase()
    const userTeamName: any = choice.value.replace(/\s/g, '').toLowerCase()

    return choice.teamPlayingAtHome ? (
        <Container>
            <TeamBadge source={Images[userTeamName]} lost={false} />
            <Text style={{fontSize: 20, fontWeight: '600'}}>{choice.goals}</Text>
            <Text style={{fontSize: 20, fontWeight: '600'}}>-</Text>
            <Text style={{fontSize: 20, fontWeight: '600'}}>{choice.opponent.goals}</Text>
            <TeamBadge source={Images[opponentTeamName]} lost={true} />
        </Container>
    ) : (
        <Container>
            <TeamBadge source={Images[opponentTeamName]} lost={true} />
            <Text style={{fontSize: 20, fontWeight: '600'}}>{choice.opponent.goals}</Text>
            <Text style={{fontSize: 20, fontWeight: '600'}}>-</Text>
            <Text style={{fontSize: 20, fontWeight: '600'}}>{choice.goals}</Text>
            <TeamBadge source={Images[userTeamName]} lost={false} />
        </Container>
    )
}
//
