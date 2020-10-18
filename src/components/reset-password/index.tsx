import React, { useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'

const auth = firebase.auth()

export const ResetPassword = () => {
    const [email, setEmail] = useState('')
    // const history = useHistory()

    const resetPassword = () => {}

    return (
        <Container>
            <TextInput placeholder="Enter your old password" onChange={(e) => setEmail(e.nativeEvent.text)} />
            <TextInput placeholder="Enter new password" onChange={(e) => setEmail(e.nativeEvent.text)} />
            <TextInput placeholder="Enter new password" onChange={(e) => setEmail(e.nativeEvent.text)} />
            <Text>Rest password</Text>
        </Container>
    )
}
