import React from 'react'
import { Text } from 'react-native'

import { Container, Inner } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

export const Home = () => {
    return (
        <Container style={{ backgroundColor: '#F2F1F7' }}>
            <H1>Welcome to Last Pundit Standing</H1>
            <Inner>
                <Text>Better than your mates at predicting the results?</Text>
            </Inner>
        </Container>
    )
}
