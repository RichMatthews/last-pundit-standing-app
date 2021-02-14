import React from 'react'
import { Text, StyleSheet } from 'react-native'

import { Container } from '../../ui-components/containers'

export const Home = ({ theme }) => {
    return (
        <Container style={styles(theme).container}>
            <Text style={styles(theme).text}>Welcome to Last Pundit Standing</Text>
        </Container>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
        },
        text: { color: theme.text.primary, fontSize: 20, marginTop: 100 },
    })
