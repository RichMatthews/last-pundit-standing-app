import React from 'react'
import { Text } from 'react-native'

import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

export const Home = () => {
    return (
        <Container style={{ backgroundColor: '#F2F1F7' }}>
            <H1 style={{ marginTop: 150 }}>Welcome to Last Pundit Standing</H1>

            <Text>Better than your mates at predicting the results?</Text>

            <Text>Think you know more than the so called "expert" television pundits?</Text>

            <Text>Think you know more than the so called "expert" television pundits?</Text>
        </Container>
    )
}
