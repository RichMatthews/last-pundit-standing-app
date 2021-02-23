import React, { useState } from 'react'
import { StyleSheet, Platform, TouchableOpacity, View, Text, TextInput } from 'react-native'
import firebase from 'firebase'

const auth = firebase.auth()

export const UpdateEmail = ({ navigation }) => {
    const [email, setEmail] = useState('')

    const updateEmail = () => {
        const user = firebase.auth().currentUser
        if (user) {
            return user
                .updateEmail(email)
                .then(() => {
                    console.log('calling then')
                    navigation.navigate('Account')
                })
                .catch((error) => {
                    console.error('error updating email', error)
                })
        }
    }

    return (
        <View style={{ marginHorizontal: 50, marginTop: 25 }}>
            <View style={styles.emailInputWrapper}>
                <TextInput
                    autoCompleteType={'off'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    spellCheck={false}
                    placeholder="Enter new email"
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    style={styles.textInput}
                />
            </View>
            <TouchableOpacity onPress={updateEmail} activeOpacity={0.7}>
                <View style={styles.button}>
                    <Text style={styles.buttonText}>Update Email</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    emailInputWrapper: {
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#bb99ff',
        borderColor: '#bb99ff',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        alignSelf: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
        fontWeight: '600',
        textAlign: 'center',
    },
    textInput: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
})
