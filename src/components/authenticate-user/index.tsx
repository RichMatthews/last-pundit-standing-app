import React, { Fragment, useState } from 'react'
import {
    ActivityIndicator,
    TextInput,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { Button, ButtonText, InvertedButton, InvertedButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'
import { H1 } from 'src/ui-components/headings'
import SecureStorage from 'react-native-secure-storage'
import { useDispatch } from 'react-redux'

import { logUserInToApplication, signUserUpToApplication } from '../../firebase-helpers'
import { canLoginWithFaceId, retrieveCredentialsToSecureStorage } from 'src/utils/canLoginWithFaceId'
import { getCurrentUser } from 'src/redux/reducer/user'

export const AuthenticateUserScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState<any>(null)
    const [loaded, setLoaded] = useState(true)
    const [loginOption, setLoginOption] = useState('signin')
    const dispatch = useDispatch()

    const saveCredentialsToSecureStorage: any = async () => {
        await SecureStorage.setItem('secureEmail', email)
        await SecureStorage.setItem('securePassword', password)
    }

    const logUserIn = async () => {
        if (email === '' || password === '') {
            setError('Email or password cannot be blank')
            return
        }
        setLoaded(false)
        if (loginOption === 'signin') {
            saveCredentialsToSecureStorage()
            const user = await logUserInToApplication({ email, password })
            await SecureStorage.setItem('secureUid', user.user.uid)
            setLoaded(true)
        } else {
            signUserUpToApplication(email, password, name, setError, surname)
        }
    }

    const logUserInWithFaceId = async () => {
        setLoaded(true)
        const faceIdOk = await canLoginWithFaceId()

        const { emailFromSecureStorage, passwordFromSecureStorage } = await retrieveCredentialsToSecureStorage()

        if (faceIdOk) {
            const res = await logUserInToApplication({
                email: emailFromSecureStorage,
                password: passwordFromSecureStorage,
            })
            console.log('res,', res, 'RESS')
            if (res.user) {
                dispatch(getCurrentUser(res.user.uid))
            }
        }
    }

    const authenticateUserHelper = () => {
        if (loginOption === 'signin') {
            setLoginOption('signup')
        } else {
            setLoginOption('signin')
        }
    }

    const setEmailHelper = (e: any) => {
        setError(null)
        setEmail(e.nativeEvent.text)
    }

    const setPasswordHelper = (e: any) => {
        setError(null)
        setPassword(e.nativeEvent.text)
    }

    return loaded ? (
        <Fragment>
            <SafeAreaView style={{ flex: 0, height: Platform.OS === 'ios' ? 200 : 100, backgroundColor: '#827ee6' }} />
            <SafeAreaView>
                <H1 style={styles.heading}>Login</H1>
                <Container style={{ marginTop: 50 }}>
                    <View>
                        {error ? (
                            <View style={styles.error}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}
                    </View>

                    {loginOption === 'signup' && (
                        <>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    placeholder="name"
                                    placeholderTextColor="#666464"
                                    onChange={(e: any) => setName(e)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    placeholder="surname"
                                    placeholderTextColor="#666464"
                                    onChange={(e: any) => setEmailHelper(e)}
                                />
                            </View>
                        </>
                    )}
                    {(loginOption === 'signup' || loginOption === 'signin') && (
                        <>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    autoCapitalize="none"
                                    placeholder="email"
                                    placeholderTextColor="#666464"
                                    onChange={(e: any) => setEmailHelper(e)}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="password"
                                    placeholderTextColor="#666464"
                                    secureTextEntry={true}
                                    onChange={(e: any) => setPasswordHelper(e)}
                                />
                            </View>
                        </>
                    )}

                    <>
                        <TouchableOpacity onPress={logUserIn}>
                            <Button>
                                <ButtonText>{loginOption === 'signup' ? 'SIGN UP' : 'SIGN IN'}</ButtonText>
                            </Button>
                        </TouchableOpacity>
                        {loginOption === 'signin' && (
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity onPress={logUserInWithFaceId}>
                                    <Button>
                                        <ButtonText>USE FACE ID</ButtonText>
                                    </Button>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={{ bottom: Platform.OS === 'ios' ? 400 : 300, position: 'absolute' }}>
                            <TouchableOpacity onPress={authenticateUserHelper}>
                                <InvertedButton>
                                    <InvertedButtonText>
                                        {loginOption === 'signup' ? 'HAVE AN ACCOUNT? SIGN IN' : 'NO ACCOUNT? SIGN UP'}
                                    </InvertedButtonText>
                                </InvertedButton>
                            </TouchableOpacity>
                        </View>
                    </>
                </Container>
            </SafeAreaView>
        </Fragment>
    ) : (
        <Container style={{ marginTop: 200 }}>
            <ActivityIndicator size="large" color="#827ee6" />
        </Container>
    )
}

const styles = StyleSheet.create({
    auth: {
        bottom: 300,
        display: 'flex',
        position: 'absolute',
        alignSelf: 'center',
    },
    authContainer: {
        backgroundColor: '#fafafa',
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        padding: 10,
        margin: 15,
        shadowOpacity: 1,
        shadowRadius: 5,
        shadowColor: '#ccc',
        shadowOffset: { height: 2, width: 0 },
        width: 200,
    },
    authText: {
        fontSize: 12,
        textAlign: 'center',
    },
    buttonText: {
        color: '#fff',
        alignItems: 'center',
        textAlign: 'center',
    },
    error: {
        backgroundColor: '#ff0033',
        borderRadius: 5,
        padding: 10,
        width: 300,
    },
    errorText: {
        color: '#fff',
        fontWeight: '700',
    },
    heading: {
        backgroundColor: '#827ee6',
        color: '#fff',
        padding: 20,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: Platform.OS === 'ios' ? 10 : 0,
        margin: 10,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        fontSize: 15,
        paddingBottom: Platform.OS === 'ios' ? 10 : 0,
        width: '80%',
    },
    inputSection: {
        marginTop: 50,
    },
    image: {
        alignSelf: 'center',
        marginRight: 5,
        textAlign: 'center',
    },
})
