import React from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

import { H1 } from '../../ui-components/headings'

const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 100px;
`

const Inner = styled.View`
    margin-top: 50px;
    width: 300px;
`

export const Home = () => {
    return (
        <Container>
            <H1>Welcome to Last Pundit Standing</H1>
            <Inner>
                <Text>
                    The place where like minded football loving fans come to find out who is the best armchair pundit
                </Text>
            </Inner>
        </Container>
    )
}
