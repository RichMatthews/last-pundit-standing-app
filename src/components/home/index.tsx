import React from 'react'
import { Text } from 'react-native'

import { Container } from '../../ui-components/containers'

export const Home = ({ theme }) => {
    return (
        <Container style={{ backgroundColor: theme.background.primary }}>
            <Text style={{ color: theme.text.primary, fontSize: 20, marginTop: 100 }}>
                Welcome to Last Pundit Standing
            </Text>
        </Container>
    )
}
