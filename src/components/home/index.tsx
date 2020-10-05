import React from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

const Container = styled.View`
    margin-top: 100px;
`

export const Home = () => {
    return (
        <Container>
            <Text>Welcome to Last Pundit Standing</Text>
            <Text>
                The place where like minded football loving fans come to find out who is the best armchair pundit
            </Text>
        </Container>
    )
}
