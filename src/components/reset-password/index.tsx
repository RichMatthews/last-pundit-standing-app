import React, { Fragment, useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import firebase from 'firebase'

import { Button, ButtonText, InvertedButton, InvertedButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'

export const ResetPassword = ({ setShowResetScreen, theme }: any) => {
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
                <Container style={{ display: 'flex', alignSelf: 'center', width: 300 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ color: theme.text.primary, fontSize: theme.text.medium }}>
                            Enter your email and we will send you a link to reset your password{' '}
                        </Text>
                        <TextInput
                            autoCapitalize="none"
                            style={{
                                borderBottomWidth: 1,
                                borderColor: '#ccc',
                                fontSize: theme.text.small,
                                marginTop: 15,
                                paddingBottom: 10,
                            }}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.text.primary}
                            onChange={(e) => setEmail(e.nativeEvent.text)}
                        />
                    </View>
                    <View style={{ width: 300 }}>
                        <TouchableOpacity onPress={resetPassword}>
                            <Button>
                                <ButtonText>Send password reset link</ButtonText>
                            </Button>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setShowResetScreen(false)}>
                        <View style={{ marginTop: 20 }}>
                            <InvertedButton background={theme.button.backgroundColor}>
                                <Text style={{ color: theme.text.primary, fontWeight: '700', textAlign: 'center' }}>
                                    Cancel
                                </Text>
                            </InvertedButton>
                        </View>
                    </TouchableOpacity>
                </Container>
            </SafeAreaView>
        </Fragment>
    )
}
