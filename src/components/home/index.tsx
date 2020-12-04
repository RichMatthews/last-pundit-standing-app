import React from 'react'
import { Text } from 'react-native'

import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

export const Home = () => {
    return (
        <Container style={{ backgroundColor: '#F2F1F7' }}>
            <H1 style={{ fontSize: 20, marginTop: 100 }}>Welcome to Last Pundit Standing</H1>
        </Container>
    )
}
