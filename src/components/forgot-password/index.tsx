import React, { useState } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'

const auth = firebase.auth()

export const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    // const history = useHistory()

    const resetPassword = () => {
        var actionCodeSettings = {
            url: 'http://d3pbczmgxzrjcq.cloudfront.net/login',
            handleCodeInApp: false,
        }

        auth.sendPasswordResetEmail(email, actionCodeSettings)
            .then(() => {
                alert('email sent')
                // history.push('/login')
            })
            .catch((error) => {
                console.log(error, 'er')
                alert('error')
            })
    }
    return (
        <Container>
            <input placeholder="Enter your email address" onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={resetPassword}>
                <Text>Send password reset email</Text>
            </Button>
        </Container>
    )
}
