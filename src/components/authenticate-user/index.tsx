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
            <Text style={styles(theme).heading}>{showResetScreen ? 'Reset Password' : 'Login'}</Text>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={{ backgroundColor: theme.background.primary }}>
                    <Container style={{ marginTop: 50, width: 350, alignSelf: 'center' }}>
                        {showResetScreen ? (
                            <ResetPassword setShowResetScreen={setShowResetScreen} theme={theme} />
                        ) : (
                            <Fragment>
                                <View>
                                    {error ? (
                                        <View style={styles(theme).error}>
                                            <Text style={styles(theme).errorText}>{error}</Text>
                                        </View>
                                    ) : null}
                                </View>

                                {loginOption === 'signup' && (
                                    <Fragment>
                                        <View style={styles(theme).inputContainer}>
                                            <TextInput
                                                style={styles(theme).input}
                                                autoCapitalize="none"
                                                placeholder="name"
                                                placeholderTextColor={theme.text.primary}
                                                onChange={(e: any) => setName(e.nativeEvent.text)}
                                            />
                                        </View>
                                        <View style={styles(theme).inputContainer}>
                                            <TextInput
                                                style={styles(theme).input}
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
                                        <View style={styles(theme).inputContainer}>
                                            <TextInput
                                                style={styles(theme).input}
                                                autoCapitalize="none"
                                                placeholder="email"
                                                placeholderTextColor={theme.text.primary}
                                                onChange={(e: any) => setEmailHelper(e)}
                                                value={email}
                                            />
                                        </View>
                                        <View style={styles(theme).inputContainer}>
                                            <TextInput
                                                style={styles(theme).input}
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
                                                <View
                                                    style={{
                                                        marginBottom: 15,
                                                        alignSelf: 'flex-end',
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            color: theme.text.primary,
                                                            fontSize: 12,
                                                            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
                                                        }}
                                                    >
                                                        Forgotten password?
                                                    </Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                        <View style={{ width: 300 }}>
                                            <TouchableOpacity onPress={logUserIn}>
                                                <View style={{ borderWidth: 1, borderRadius: 5, padding: 5 }}>
                                                    <Text
                                                        style={{
                                                            color: theme.text.primary,
                                                            fontSize: 16,
                                                            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        {loginOption === 'signup' ? 'SIGN UP' : 'SIGN IN'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        {loginOption === 'signin' && showFaceIDButton && (
                                            <View style={{ marginTop: 10, width: 300 }}>
                                                <TouchableOpacity onPress={logUserInWithFaceId}>
                                                    <Button>
                                                        <ButtonText>USE FACE ID</ButtonText>
                                                    </Button>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                    <View
                                        style={{
                                            bottom: Platform.OS === 'ios' ? 400 : 300,
                                            position: 'absolute',
                                        }}
                                    >
                                        <TouchableOpacity onPress={authenticateUserHelper}>
                                            <View>
                                                <Text
                                                    style={{
                                                        color: theme.text.primary,
                                                        fontWeight: '700',
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {loginOption === 'signup'
                                                        ? 'HAVE AN ACCOUNT? SIGN IN'
                                                        : 'NO ACCOUNT? SIGN UP'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Fragment>
                            </Fragment>
                        )}
                    </Container>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ScreenComponent>
    ) : (
        <Container style={{ backgroundColor: theme.background.primary, paddingTop: 200 }}>
            <ActivityIndicator size="large" color={theme.spinner.primary} />
        </Container>
    )
}

const styles = (theme) =>
    StyleSheet.create({
        auth: {
            display: 'flex',
            alignSelf: 'center',
        },
        authText: {
            fontSize: theme.text.small,
            textAlign: 'center',
        },
        error: {
            backgroundColor: theme.background.primary,
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
            color: theme.text.primary,
            fontSize: 25,
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
            marginHorizontal: 50,
            marginTop: 100,
            fontWeight: '600',
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
            fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
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
