import React, { Fragment, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    TextInput,
    Keyboard,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, ButtonText, InvertedButton, InvertedButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'
import * as Keychain from 'react-native-keychain'
import { useDispatch } from 'react-redux'
import * as RootNavigation from 'src/root-navigation'
import LinearGradient from 'react-native-linear-gradient'

import { ResetPassword } from 'src/components/reset-password'
import { logUserInToApplication, signUserUpToApplication, writeUserToDatabase } from '../../firebase-helpers'
import {
    attemptFaceIDAuthentication,
    checkFaceIDEnabled,
    getInternetCredentialsForFirebase,
} from 'src/utils/canLoginWithFaceId'
import { getCurrentUser } from 'src/redux/reducer/user'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { getLeagues } from 'src/redux/reducer/leagues'

export const AuthenticateUserScreen = ({ theme }) => {
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

    const {
        linearGradient,
        screenWrapper,
        container,
        forgottenPasswordWrapper,
        forgottenPasswordText,
        loginOptionWrapper,
        loginOptionText,
        faceIdWrapper,
        helperButtonWrapper,
        helperButtonText,
        errorWrapper,
        errorText,
        heading,
        inputContainer,
        input,
        spinnerWrapper,
    } = styles(theme)

    const saveCredentialsToSecureStorage: any = async () => {
        await Keychain.setInternetCredentials('firebase', email, password)
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

        if (faceIdAuthSuccessful) {
            try {
                const { username, password } = await getInternetCredentialsForFirebase()
                const { user } = await logUserInToApplication({
                    email: username,
                    password,
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
        const faceIdEnabled = await checkFaceIDEnabled()

        if (faceIdEnabled === 'active') {
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
                style={linearGradient}
            >
                <Text style={heading}>{showResetScreen ? 'Reset Password' : 'Login'}</Text>
            </LinearGradient>
            {/* TODO: Need to check but reckon that some of these can be replaced by ScreenContainer */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={screenWrapper}>
                    <Container style={container}>
                        {showResetScreen ? (
                            <ResetPassword setShowResetScreen={setShowResetScreen} theme={theme} />
                        ) : (
                            <Fragment>
                                <View>
                                    {error ? (
                                        <View style={errorWrapper}>
                                            <Text style={errorText}>{error}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                {loginOption === 'signup' && (
                                    <Fragment>
                                        <View style={inputContainer}>
                                            <TextInput
                                                style={input}
                                                autoCapitalize="none"
                                                placeholder="name"
                                                placeholderTextColor={theme.text.primary}
                                                onChange={(e: any) => setName(e.nativeEvent.text)}
                                            />
                                        </View>
                                        <View style={inputContainer}>
                                            <TextInput
                                                style={input}
                                                autoCapitalize="none"
                                                placeholder="surname"
                                                placeholderTextColor={theme.text.primary}
                                                onChange={(e: any) => setSurname(e.nativeEvent.text)}
                                            />
                                        </View>
                                    </Fragment>
                                )}
                                {(loginOption === 'signup' || loginOption === 'signin') && (
                                    <Fragment>
                                        <View style={inputContainer}>
                                            <TextInput
                                                style={input}
                                                autoCapitalize="none"
                                                placeholder="email"
                                                placeholderTextColor={theme.text.primary}
                                                onChange={(e: any) => setEmailHelper(e)}
                                                value={email}
                                            />
                                        </View>
                                        <View style={inputContainer}>
                                            <TextInput
                                                style={input}
                                                placeholder="password"
                                                placeholderTextColor={theme.text.primary}
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
                                                <View style={forgottenPasswordWrapper}>
                                                    <Text style={forgottenPasswordText}>Forgotten password?</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                        <View style={loginOptionWrapper}>
                                            <TouchableOpacity onPress={logUserIn}>
                                                <Button>
                                                    <ButtonText style={loginOptionText}>
                                                        {loginOption === 'signup' ? 'SIGN UP' : 'SIGN IN'}
                                                    </ButtonText>
                                                </Button>
                                            </TouchableOpacity>
                                        </View>
                                        {loginOption === 'signin' && showFaceIDButton && (
                                            <View style={faceIdWrapper}>
                                                <TouchableOpacity onPress={logUserInWithFaceId}>
                                                    <Button>
                                                        <ButtonText>USE FACE ID</ButtonText>
                                                    </Button>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                    <View style={helperButtonWrapper}>
                                        <TouchableOpacity onPress={authenticateUserHelper}>
                                            <InvertedButton background={theme.button.backgroundColor}>
                                                <Text style={helperButtonText}>
                                                    {loginOption === 'signup'
                                                        ? 'HAVE AN ACCOUNT? SIGN IN'
                                                        : 'NO ACCOUNT? SIGN UP'}
                                                </Text>
                                            </InvertedButton>
                                        </TouchableOpacity>
                                    </View>
                                </Fragment>
                            </Fragment>
                        )}
                    </Container>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </Fragment>
    ) : (
        <Container style={spinnerWrapper}>
            <ActivityIndicator size="large" color={theme.spinner.primary} />
        </Container>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        linearGradient: {
            height: Platform.OS === 'ios' ? 300 : 100,
        },
        screenWrapper: {
            backgroundColor: theme.background.primary,
        },
        container: {
            marginTop: 50,
            width: 350,
            alignSelf: 'center',
        },
        forgottenPasswordWrapper: {
            marginBottom: 15,
            alignSelf: 'flex-end',
        },
        forgottenPasswordText: { color: theme.text.primary, fontSize: 12 },
        loginOptionWrapper: {
            width: 300,
        },
        loginOptionText: {
            fontSize: 16,
        },
        faceIdWrapper: { marginTop: 10, width: 300 },
        helperButtonWrapper: {
            bottom: Platform.OS === 'ios' ? 400 : 300,
            position: 'absolute',
        },
        helperButtonText: {
            color: theme.text.primary,
            fontWeight: '700',
            textAlign: 'center',
        },
        errorWrapper: {
            backgroundColor: theme.button.backgroundColor,
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
            color: theme.text.primary,
            fontSize: 15,
            paddingBottom: Platform.OS === 'ios' ? 10 : 0,
            width: 300,
        },
        spinnerWrapper: { backgroundColor: theme.background.primary, paddingTop: 200 },
    })
