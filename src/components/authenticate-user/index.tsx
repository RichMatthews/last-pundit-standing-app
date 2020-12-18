import React, { Fragment, useEffect, useState } from 'react'
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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, ButtonText, InvertedButton, InvertedButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'
import { H1 } from 'src/ui-components/headings'
import * as Keychain from 'react-native-keychain'
import { useDispatch } from 'react-redux'
import * as RootNavigation from 'src/root-navigation'
import LinearGradient from 'react-native-linear-gradient'

import { ResetPassword } from 'src/components/reset-password'
import { logUserInToApplication, signUserUpToApplication, writeUserToDatabase } from '../../firebase-helpers'
import { attemptFaceIDAuthentication, retrieveCredentialsToSecureStorage } from 'src/utils/canLoginWithFaceId'
import { getCurrentUser } from 'src/redux/reducer/user'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { getLeagues } from 'src/redux/reducer/leagues'

export const AuthenticateUserScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState<any>(null)
    const [loaded, setLoaded] = useState(true)
    const [loginOption, setLoginOption] = useState('signin')
    const [showFaceIDButton, setShowFaceIDButton] = useState(false)
    const [showResetScreen, setShowResetScreen] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        checkIfFaceIDAvailable()
    }, [])

    const saveCredentialsToSecureStorage: any = async () => {
        await Keychain.setGenericPassword(email, password)
    }

    const logUserIn = async () => {
        if (email === '' || password === '') {
            setError('Email or password cannot be blank')
            return
        }
        setLoaded(false)
        if (loginOption === 'signin') {
            saveCredentialsToSecureStorage()
            try {
                const { user } = await logUserInToApplication({ email, password })

                await AsyncStorage.setItem('secureUid', user.uid)
                await getUserAndLeaguesAndGameWeekInfo(user)
                setLoaded(true)
            } catch (e) {
                setPassword('')
                setError(e.message)
                setLoaded(true)
            }
        } else {
            try {
                const { user } = await signUserUpToApplication({ email, password, name, surname })
                await writeUserToDatabase({ user, name, surname })
                await AsyncStorage.setItem('secureUid', user.uid)
                await getUserAndLeaguesAndGameWeekInfo(user)

                setLoaded(true)
            } catch (e) {
                console.error('error')
                setLoaded(true)
            }
        }
    }

    const logUserInWithFaceId = async () => {
        setLoaded(false)
        const faceIdAuthSuccessful = await attemptFaceIDAuthentication()
        const { emailFromSecureStorage, passwordFromSecureStorage } = await retrieveCredentialsToSecureStorage()

        if (faceIdAuthSuccessful) {
            try {
                const { user } = await logUserInToApplication({
                    email: emailFromSecureStorage,
                    password: passwordFromSecureStorage,
                })

                if (user) {
                    await getUserAndLeaguesAndGameWeekInfo(user)
                    RootNavigation.navigate('My Leagues')
                    setLoaded(true)
                }
            } catch (e) {
                setError('Failed Face Id')
                setLoaded(true)
            }
        } else {
            setLoaded(true)
        }
    }

    const getUserAndLeaguesAndGameWeekInfo = async (user: any) => {
        await dispatch(getCurrentUser(user))
        await dispatch(getLeagues(user.uid))
        await dispatch(getCurrentGameWeekInfo())
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

    const checkIfFaceIDAvailable = async () => {
        const x = await AsyncStorage.getItem('faceIdStatus')
        const userNameIsSet = await Keychain.getGenericPassword()

        if (x === 'active' && userNameIsSet) {
            setShowFaceIDButton(true)
        } else {
            setShowFaceIDButton(false)
        }
    }

    return loaded ? (
        <Fragment>
            <LinearGradient
                colors={['#a103fc', '#5055b3']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={{ height: Platform.OS === 'ios' ? 300 : 100, borderBottomRightRadius: 250 }}
            >
                <H1 style={styles.heading}>{showResetScreen ? 'Reset Password' : 'Login'}</H1>
            </LinearGradient>
            <SafeAreaView>
                <Container style={{ marginTop: 50, width: 350, alignSelf: 'center' }}>
                    {showResetScreen ? (
                        <ResetPassword setShowResetScreen={setShowResetScreen} />
                    ) : (
                        <Fragment>
                            <View>
                                {error ? (
                                    <View style={styles.error}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}
                            </View>

                            {loginOption === 'signup' && (
                                <Fragment>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize="none"
                                            placeholder="name"
                                            placeholderTextColor="#666464"
                                            onChange={(e: any) => setName(e.nativeEvent.text)}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize="none"
                                            placeholder="surname"
                                            placeholderTextColor="#666464"
                                            onChange={(e: any) => setSurname(e.nativeEvent.text)}
                                        />
                                    </View>
                                </Fragment>
                            )}
                            {(loginOption === 'signup' || loginOption === 'signin') && (
                                <Fragment>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            autoCapitalize="none"
                                            placeholder="email"
                                            placeholderTextColor="#666464"
                                            onChange={(e: any) => setEmailHelper(e)}
                                            value={email}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="password"
                                            placeholderTextColor="#666464"
                                            secureTextEntry={true}
                                            onChange={(e: any) => setPasswordHelper(e)}
                                            value={password}
                                        />
                                    </View>
                                </Fragment>
                            )}

                            <Fragment>
                                <View>
                                    <TouchableOpacity onPress={() => setShowResetScreen(true)}>
                                        {loginOption === 'signin' && (
                                            <View
                                                style={{
                                                    marginBottom: 15,
                                                    alignSelf: 'flex-end',
                                                }}
                                            >
                                                <Text style={{ color: '#827ee6', fontSize: 12 }}>
                                                    Forgotten password?
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                    <View style={{ width: 300 }}>
                                        <TouchableOpacity onPress={logUserIn}>
                                            <Button>
                                                <ButtonText style={{ fontSize: 16 }}>
                                                    {loginOption === 'signup' ? 'SIGN UP' : 'SIGN IN'}
                                                </ButtonText>
                                            </Button>
                                        </TouchableOpacity>
                                    </View>
                                    {loginOption === 'signin' && showFaceIDButton && (
                                        <View style={{ marginTop: 10 }}>
                                            <TouchableOpacity onPress={logUserInWithFaceId}>
                                                <Button>
                                                    <ButtonText>USE FACE ID</ButtonText>
                                                </Button>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                                <View style={{ bottom: Platform.OS === 'ios' ? 400 : 300, position: 'absolute' }}>
                                    <TouchableOpacity onPress={authenticateUserHelper}>
                                        <InvertedButton>
                                            <InvertedButtonText>
                                                {loginOption === 'signup'
                                                    ? 'HAVE AN ACCOUNT? SIGN IN'
                                                    : 'NO ACCOUNT? SIGN UP'}
                                            </InvertedButtonText>
                                        </InvertedButton>
                                    </TouchableOpacity>
                                </View>
                            </Fragment>
                        </Fragment>
                    )}
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
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ff0033',
        padding: 10,
        width: 300,
    },
    errorText: {
        color: '#ff0033',
        fontWeight: '700',
    },
    heading: {
        color: '#fff',
        position: 'absolute',
        bottom: 0,
        padding: 30,
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
        width: 300,
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
