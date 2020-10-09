import React from 'react'
import { Text } from 'react-native'

import { Container, Inner } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

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
