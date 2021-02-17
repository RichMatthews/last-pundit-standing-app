import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native'
import firebase from 'firebase'

import { Button, ButtonText } from '../../ui-components/button'
import { Container } from '../../ui-components/containers'

const auth = firebase.auth()

export const UpdateEmail = ({ currentUser }) => {
    const [email, setEmail] = useState('')

    const updateEmail = () => {
        const user = firebase.auth().currentUser
        user.updateEmail(email)
            .then(() => {
                // Update successful.
            })
            .catch((error) => {
                console.error('error updating email', error)
            })
    }

    return (
        <Container>
            <View style={styles.emailInputWrapper}>
                <TextInput
                    placeholder="Enter new email"
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    style={styles.textInput}
                />
            </View>
            <TouchableOpacity onPress={updateEmail}>
                <Button>
                    <ButtonText>Update Email</ButtonText>
                </Button>
            </TouchableOpacity>
        </Container>
    )
}

const styles = StyleSheet.create({
    emailInputWrapper: {
        marginBottom: 20,
    },
    textInput: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
})
