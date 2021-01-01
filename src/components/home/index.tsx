import React from 'react'
import { Text } from 'react-native'

import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

export const Home = ({ theme }) => {
    return (
        <Container style={{ backgroundColor: theme.background.primary }}>
            <H1 style={{ color: theme.text.primary, fontSize: 20, marginTop: 100 }}>Welcome to Last Pundit Standing</H1>
        </Container>
    )
}
