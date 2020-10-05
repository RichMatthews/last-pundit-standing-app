import React from 'react'
import styled from 'styled-components'

interface ImageStyled {
    lost: boolean
}

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 200px;
    margin: 15px auto;
`

const Image = styled.img<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    width: 30px;

    @media (max-width: 900px) {
        width: 30px;
    }
`

export const PreviousRound = ({ choice }: any) => {
    return choice.teamPlayingAtHome ? (
        <Container>
            <Image src={`/images/teams/${choice.value.replace(/\s/g, '').toLowerCase()}.png`} lost={false} />
            <div>{choice.goals}</div>
            <div>-</div>
            <div>{choice.opponent.goals}</div>
            <Image src={`/images/teams/${choice.opponent.name.replace(/\s/g, '').toLowerCase()}.png`} lost={true} />
        </Container>
    ) : (
        <Container>
            <Image src={`/images/teams/${choice.opponent.name.replace(/\s/g, '').toLowerCase()}.png`} lost={true} />
            <div>{choice.opponent.goals}</div>
            <div>-</div>
            <div>{choice.goals}</div>
            <Image src={`/images/teams/${choice.value.replace(/\s/g, '').toLowerCase()}.png`} lost={false} />
        </Container>
    )
}
