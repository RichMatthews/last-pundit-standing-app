import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button, ButtonText } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'

const StyledTextInput = styled.TextInput`
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`

const auth = firebase.auth()

export const UpdateEmail = ({ currentUser }) => {
    const [email, setEmail] = useState('')

    const updateEmail = () => {
        var user = firebase.auth().currentUser
        user.updateEmail(email)
            .then(() => {
                console.log('success')
                // Update successful.
            })
            .catch((error) => {
                console.log('error updating email', error)
            })
    }

    return (
        <Container>
            <Inner>
                <View style={{ marginBottom: 20 }}>
                    <StyledTextInput placeholder="Enter new email" onChange={(e) => setEmail(e.nativeEvent.text)} />
                </View>
                <TouchableOpacity onPress={updateEmail}>
                    <Button>
                        <ButtonText>Update Email</ButtonText>
                    </Button>
                </TouchableOpacity>
            </Inner>
        </Container>
    )
}
