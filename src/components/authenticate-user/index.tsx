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
import { Button, ButtonText } from 'src/ui-components/button'
import { Container } from 'src/ui-components/containers'
import * as Keychain from 'react-native-keychain'
import { useDispatch } from 'react-redux'
import * as RootNavigation from 'src/root-navigation'
import { ScreenComponent } from 'src/ui-components/containers/screenComponent'
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
        screenWrapper,
        container,
        heading,
        forgottenPasswordWrapper,
        forgottenPasswordText,
        loginOptionWrapper,
        loginOptionText,
        loginOptionTextWrapper,
        faceIdWrapper,
        helperButtonWrapper,
        helperButtonText,
        errorWrapper,
        errorText,
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
        <ScreenComponent theme={theme}>
            <Text style={heading}>{showResetScreen ? 'Reset Password' : 'Login'}</Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={screenWrapper}>
                    {showResetScreen ? (
                        <ResetPassword setShowResetScreen={setShowResetScreen} theme={theme} />
                    ) : (
                        <View style={container}>
                            <View style={{ alignSelf: 'center', marginHorizontal: 50 }}>
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
                                    <View>
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
                                    </View>
                                )}

                                <>
                                    <TouchableOpacity onPress={() => setShowResetScreen(true)} activeOpacity={0.7}>
                                        {loginOption === 'signin' && (
                                            <View style={forgottenPasswordWrapper}>
                                                <Text style={forgottenPasswordText}>Forgotten password?</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={logUserIn} activeOpacity={0.7}>
                                        <View style={loginOptionTextWrapper}>
                                            <Text style={loginOptionText}>
                                                {loginOption === 'signup' ? 'SIGN UP' : 'SIGN IN'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>

                                    {loginOption === 'signin' && showFaceIDButton && (
                                        <View style={faceIdWrapper}>
                                            <TouchableOpacity onPress={logUserInWithFaceId}>
                                                <Button>
                                                    <ButtonText>USE FACE ID</ButtonText>
                                                </Button>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </>
                            </View>
                            <View style={helperButtonWrapper}>
                                <TouchableOpacity onPress={authenticateUserHelper} activeOpacity={0.7}>
                                    <View>
                                        <Text style={helperButtonText}>
                                            {loginOption === 'signup'
                                                ? 'HAVE AN ACCOUNT? SIGN IN'
                                                : 'NO ACCOUNT? SIGN UP'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ScreenComponent>
    ) : (
        <View style={spinnerWrapper}>
            <ActivityIndicator size="large" color={theme.spinner.inverse} />
        </View>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        screenWrapper: {
            backgroundColor: theme.background.primary,
            flex: 1,
        },
        container: {
            justifyContent: 'space-between',
            flex: 1,
        },
        auth: {
            alignSelf: 'center',
        },
        forgottenPasswordWrapper: {
            marginBottom: 15,
            alignSelf: 'flex-end',
        },
        forgottenPasswordText: {
            color: theme.text.primary,
            fontSize: 12,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
        },
        loginOptionWrapper: {
            width: 300,
        },
        loginOptionTextWrapper: {
            backgroundColor: '#bb99ff',
            borderColor: '#bb99ff',
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
            alignSelf: 'center',
            width: '100%',
        },
        loginOptionText: {
            color: theme.text.inverse,
            fontSize: 16,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            fontWeight: '600',
            textAlign: 'center',
        },
        faceIdWrapper: { marginTop: 10, width: 300 },
        helperButtonWrapper: {},
        helperButtonText: {
            color: theme.text.primary,
            fontWeight: '700',
            textAlign: 'center',
        },
        errorWrapper: {
            justifyContent: 'flex-start',
        },
        error: {
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#ff0033',
            width: 300,
        },
        errorText: {
            color: '#ff0033',
            fontWeight: '600',
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular',
        },
        heading: {
            color: theme.text.primary,
            fontSize: 25,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            marginHorizontal: 50,
            marginTop: 100,
            fontWeight: '600',
        },
        inputContainer: {
            flexDirection: 'row',
            padding: Platform.OS === 'ios' ? 10 : 0,
            marginVertical: 10,
        },
        input: {
            borderBottomWidth: 1,
            borderColor: '#ccc',
            color: theme.text.primary,
            fontSize: 15,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            paddingBottom: Platform.OS === 'ios' ? 10 : 0,
            width: '100%',
        },
        spinnerWrapper: { backgroundColor: theme.background.primary, marginTop: 100 },
    })
