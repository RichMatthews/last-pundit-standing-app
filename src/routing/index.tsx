import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import SplashScreen from 'react-native-splash-screen'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthenticateUserScreen } from '../components/authenticate-user'
import { logUserInToApplication } from 'src/firebase-helpers'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { getLeagues } from 'src/redux/reducer/leagues'
import { getCurrentUser } from 'src/redux/reducer/user'
import { firebaseApp } from '../config.js'
import { DARK_THEME, LIGHT_THEME } from 'src/theme'
import {
    attemptFaceIDAuthentication,
    checkFaceIDEnabled,
    getInternetCredentialsForFirebase,
} from 'src/utils/canLoginWithFaceId'
import { setTheme } from 'src/redux/reducer/theme'
import { Host } from 'react-native-portalize'
import { SettingsStack } from 'src/routing/tabs/settings'
import { TabNavigation } from 'src/routing/tabs'

export const Stack = createStackNavigator()

export const Routing = () => {
    const currentUser = firebaseApp.auth().currentUser
    const dispatch = useDispatch()
    const userFromRedux = useSelector((store: { user: any }) => store.user)
    const mode = useSelector((store: { theme: any }) => store.theme)
    const theme = mode === 'dark' ? DARK_THEME : LIGHT_THEME
    console.disableYellowBox = true

    useEffect(() => {
        async function getUser() {
            if (await userJustSignedOut()) {
                return
            }
            await setThemeMode()
            const lastLogin = await checkIfNeedToReauthenticateUser()

            if (currentUser) {
                try {
                    await dispatch(getCurrentUser(currentUser))
                    await dispatch(getLeagues(currentUser.uid))
                    await dispatch(getCurrentGameWeekInfo())

                    SplashScreen.hide()
                } catch (e) {
                    console.error(e)
                }
            } else if (lastLogin) {
                const faceIdTurnedOn = await checkFaceIDEnabled()
                if (faceIdTurnedOn) {
                    const faceIdAuthSuccessful = await attemptFaceIDAuthentication()
                    if (faceIdAuthSuccessful) {
                        logUserInAndSetUserInRedux()
                    } else {
                        SplashScreen.hide()
                    }
                } else {
                    SplashScreen.hide()
                }
            } else {
                logUserInAndSetUserInRedux()
            }
        }
        getUser()
    }, [])

    const setThemeMode = async () => {
        const theme = await AsyncStorage.getItem('theme')
        if (theme) {
            dispatch(setTheme(theme))
        }
    }

    const checkIfNeedToReauthenticateUser = async () => {
        const lastLogin = await AsyncStorage.getItem('lastLogin')
        const currentTime = Date.now()
        const date = new Date()
        const tomorrow = date.setDate(date.getDate() + 1) / 1000

        return true
    }

    const userJustSignedOut = async () => {
        const timeOfSignOut = await AsyncStorage.getItem('signOutTimeStamp')
        const currentTime = Date.now()
        if (Number(currentTime) > Number(timeOfSignOut) + 10000) {
            return false
        }
        return true
    }

    const logUserInAndSetUserInRedux = async () => {
        const { username, password } = await getInternetCredentialsForFirebase()
        if (!username || !password) {
            SplashScreen.hide()
            return
        }
        try {
            const { user } = await logUserInToApplication({
                email: username,
                password: password,
            })

            await dispatch(getCurrentUser(user))
            await dispatch(getLeagues(user.uid))
        } catch (e) {
            console.error(e, 'error in routing')
        }

        SplashScreen.hide()
    }

    return userFromRedux && Object.values(userFromRedux).length ? (
        <LoggedInNavigator theme={theme} user={userFromRedux} />
    ) : (
        <LoggedOutNavigator theme={theme} />
    )
}

const LoggedInNavigator = ({ theme, user: userFromRedux }) => (
    <Host>
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={({ route }) => ({
                    animationEnabled: true,
                    headerTitleStyle: {
                        color: theme.text.primary,
                        fontSize: 25,
                    },
                })}
                mode="modal"
            >
                <Stack.Screen
                    name="Home"
                    options={() => ({
                        headerShown: false,
                    })}
                >
                    {() => <TabNavigation theme={theme} user={userFromRedux} />}
                </Stack.Screen>
                <Stack.Screen
                    name="Account"
                    options={() => ({
                        headerShown: false,
                    })}
                >
                    {() => <SettingsStack theme={theme} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    </Host>
)

const LoggedOutNavigator = ({ theme }) => <AuthenticateUserScreen theme={theme} />
