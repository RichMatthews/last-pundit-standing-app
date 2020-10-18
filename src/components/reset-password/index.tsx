import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button, ButtonText } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'

const StyledTextInput = styled.TextInput`
    padding: 10px;
    border-bottom-width: 1;
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
                    <StyledTextInput
                        placeholder="Enter your old password"
                        onChange={(e) => setEmail(e.nativeEvent.text)}
                    />
                    <StyledTextInput placeholder="Enter new password" onChange={(e) => setEmail(e.nativeEvent.text)} />
                    <StyledTextInput placeholder="Enter new password" onChange={(e) => setEmail(e.nativeEvent.text)} />
                </View>
                <Button>
                    <ButtonText>Reset password</ButtonText>
                </Button>
            </Inner>
        </Container>
    )
}
