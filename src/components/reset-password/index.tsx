import React, { Fragment, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import firebase from 'firebase'

import { Button, ButtonText, InvertedButton, InvertedButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'

const StyledTextInput = styled.TextInput`
    padding: 10px;
    padding-left: 0;
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
`

export const ResetPassword = ({ setShowResetScreen }: any) => {
    const [email, setEmail] = useState('')

    const resetPassword = () => {
        return firebase
            .auth()
            .sendPasswordResetEmail(`${email}`)
            .then(() => {
                alert(`We have sent an email to ${email}. Check your inbox, reset and get predicting again`)
                setShowResetScreen(false)
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <Fragment>
            <SafeAreaView>
                <Container style={{ display: 'flex', alignSelf: 'center', width: '80%' }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 17 }}>
                            Enter your email and we will send you a link to reset your password{' '}
                        </Text>
                        <StyledTextInput
                            autoCapitalize="none"
                            style={{ fontSize: 18, marginTop: 15 }}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.nativeEvent.text)}
                        />
                    </View>
                    <TouchableOpacity onPress={resetPassword}>
                        <Button>
                            <ButtonText>Send password reset link</ButtonText>
                        </Button>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowResetScreen(false)}>
                        <View style={{ marginTop: 20 }}>
                            <InvertedButton>
                                <InvertedButtonText>Cancel</InvertedButtonText>
                            </InvertedButton>
                        </View>
                    </TouchableOpacity>
                </Container>
            </SafeAreaView>
        </Fragment>
    )
}
