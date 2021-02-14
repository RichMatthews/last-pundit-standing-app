import React, { Fragment, useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import firebase from 'firebase'

import { Button, ButtonText, InvertedButton } from 'src/ui-components/button'
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
                <Container stylesOverride={styles(theme).container}>
                    <View style={styles(theme).bodyWrapper}>
                        <Text style={styles(theme).bodyText}>
                            Enter your email and we will send you a link to reset your password{' '}
                        </Text>
                        <TextInput
                            autoCapitalize="none"
                            style={styles(theme).textInput}
                            placeholder="Enter your email"
                            placeholderTextColor={theme.text.primary}
                            onChange={(e) => setEmail(e.nativeEvent.text)}
                        />
                    </View>
                    <View style={styles(theme).resetTextWrapper}>
                        <TouchableOpacity onPress={resetPassword}>
                            <Button>
                                <ButtonText>Send password reset link</ButtonText>
                            </Button>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setShowResetScreen(false)}>
                        <View style={styles(theme).cancelButtonWrapper}>
                            <InvertedButton background={theme.button.backgroundColor}>
                                <Text style={styles(theme).cancelButtonText}>Cancel</Text>
                            </InvertedButton>
                        </View>
                    </TouchableOpacity>
                </Container>
            </SafeAreaView>
        </Fragment>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        container: {
            display: 'flex',
            alignSelf: 'center',
            width: 300,
        },
        bodyWrapper: { marginBottom: 20 },
        bodyText: { color: theme.text.primary, fontSize: theme.text.medium },
        textInput: {
            borderBottomWidth: 1,
            borderColor: '#ccc',
            fontSize: theme.text.small,
            marginTop: 15,
            paddingBottom: 10,
        },
        resetTextWrapper: { width: 300 },
        cancelButtonWrapper: { marginTop: 20 },
        cancelButtonText: { color: theme.text.primary, fontWeight: '700', textAlign: 'center' },
    })
