import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button, ButtonText } from '../../ui-components/button'
import { Container } from '../../ui-components/containers'

const StyledTextInput = styled.TextInput`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`

const auth = firebase.auth()

export const ResetPassword = () => {
    const [email, setEmail] = useState('')
    // const history = useHistory()

    const resetPassword = () => {}

    return (
        <Container>
            <View style={{ marginBottom: 20 }}>
                <Text>Enter your email and we will send your a password reset link</Text>
                <StyledTextInput placeholder="Enter your email" onChange={(e) => setEmail(e.nativeEvent.text)} />
            </View>
            <Button>
                <ButtonText>Send password reset link</ButtonText>
            </Button>
        </Container>
    )
}
