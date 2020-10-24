import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button, ButtonText } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'

const StyledTextInput = styled.TextInput`
    padding: 10px;
    padding-left: 0;
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
            <Inner>
                <View style={{ marginBottom: 20 }}>
                    <Text>Enter your email and we will send you a link to reset your password </Text>
                    <StyledTextInput placeholder="Enter your email" onChange={(e) => setEmail(e.nativeEvent.text)} />
                </View>
                <TouchableOpacity onPress={resetPassword}>
                    <Button>
                        <ButtonText>Send password reset link</ButtonText>
                    </Button>
                </TouchableOpacity>
            </Inner>
        </Container>
    )
}
