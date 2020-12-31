import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Header } from 'react-navigation-stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SplashScreen from 'react-native-splash-screen'
import { useDispatch, useSelector } from 'react-redux'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { Account } from '../components/account'
import { CreateLeague } from '../components/create-league'
import { Home } from '../components/home'
import { JoinLeague } from '../components/join-league'
import { MyLeagues } from '../components/my-leagues'
import { League } from '../components/league'
import { AuthenticateUserScreen } from '../components/authenticate-user'
import { ResetPassword } from '../components/reset-password'
import { UpdateEmail } from '../components/update-email'
import { logUserInToApplication } from 'src/firebase-helpers'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { getLeagues } from 'src/redux/reducer/leagues'
import { getCurrentUser } from 'src/redux/reducer/user'
import { firebaseApp } from '../config.js'
import { DARK_THEME, LIGHT_THEME } from 'src/theme'
import { attemptFaceIDAuthentication, retrieveCredentialsToSecureStorage } from 'src/utils/canLoginWithFaceId'
import { setTheme } from 'src/redux/reducer/theme'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const getHeaderTitle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Leagues'
    switch (routeName) {
        case 'Create':
            return 'Create League'
        case 'Join':
            return 'Join League'
        case 'Home':
            return 'Home'
        case 'Leagues':
            return 'Leagues'
    }
}

const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            animationEnabled: false,
            cardStyle: { backgroundColor: '#fff' },
            headerShown: false,
            headerTitle: '',
        }}
    >
        <Stack.Screen name="Home">{(props: any) => <Home />}</Stack.Screen>
        <Stack.Screen name="Reset Password">{(props: any) => <ResetPassword />}</Stack.Screen>
        <Stack.Screen name="Update Email">{(props: any) => <UpdateEmail />}</Stack.Screen>
    </Stack.Navigator>
)

const Stacks = ({ isSignedIn, theme }: any) => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            headerTitle: '',
            headerStyle: {
                elevation: 5,
                shadowOpacity: 0,
            },
            animationEnabled: false,
        }}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen name="My Leagues">
                    {(props: any) => <MyLeagues navigation={props.navigation} theme={theme} />}
                </Stack.Screen>
                <Stack.Screen
                    name="League"
                    options={{
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back to leagues',
                        headerShown: false,
                        headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
                    }}
                >
                    {(props: any) => <League leagueId={props.route.params.leagueId} theme={theme} />}
                </Stack.Screen>
            </>
        ) : (
            <>
                <Stack.Screen name="Sign In">
                    {(props: any) => <AuthenticateUserScreen navigation={props.navigation} />}
                </Stack.Screen>
                <Stack.Screen name="Sign Up">
                    {(props: any) => <AuthenticateUserScreen navigation={props.navigation} />}
                </Stack.Screen>
            </>
        )}
    </Stack.Navigator>
)

const CreateStack = ({ isSignedIn, theme }: any) => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: '#fff' },
            headerShown: false,
            headerTitle: '',
        }}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen name="My Leagues">
                    {(props: any) => <CreateLeague navigation={props.navigation} theme={theme} />}
                </Stack.Screen>
            </>
        ) : (
            <>
                <Stack.Screen name="Sign In">
                    {(props: any) => <AuthenticateUserScreen navigation={props.navigation} />}
                </Stack.Screen>
            </>
        )}
    </Stack.Navigator>
)

const ModalStacks = ({ theme }) => (
    <Stack.Navigator
        headerMode="none"
        screenOptions={{
            animationEnabled: true,
            cardStyle: { backgroundColor: '#212020' },
        }}
        mode="modal"
    >
        <Stack.Screen name="Account" options={{ animationEnabled: true }}>
            {(props: any) => {
                return <Account navigation={props.navigation} theme={theme} />
            }}
        </Stack.Screen>
    </Stack.Navigator>
)

const TabNavigation = ({ theme, user }: any) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName

                    if (route.name === 'Home') {
                        iconName = 'ios-home-outline'
                    } else if (route.name === 'Create') {
                        iconName = 'ios-create-outline'
                    } else if (route.name === 'Join') {
                        iconName = 'ios-add'
                    } else if (route.name === 'Leagues') {
                        iconName = 'ios-trophy-outline'
                    } else if (route.name === 'My Account') {
                        return (
                            <MaterialIcons
                                name={'account-circle-outline'}
                                size={size}
                                color={focused ? theme.tint.active : theme.tint.inactive}
                            />
                        )
                    }

                    return (
                        <Ionicons
                            name={iconName}
                            size={size}
                            color={focused ? theme.tint.active : theme.tint.inactive}
                        />
                    )
                },
            })}
            tabBarOptions={{
                activeTintColor: theme.tint.active,
                inactiveTintColor: theme.tint.inactive,
                labelStyle: { fontSize: 13 },
                style: {
                    backgroundColor: theme.background.primary,
                },
            }}
        >
            <Tab.Screen name="Leagues">
                {(props: any) => {
                    return <Stacks isSignedIn={user} theme={theme} userId={user.id} />
                }}
            </Tab.Screen>
            <Tab.Screen
                name="Home"
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault()
                        navigation.navigate('Home', { screen: 'Home', resetPassword: false, updateEmail: false })
                    },
                })}
            >
                {(props: any) => {
                    return <AuthStack />
                }}
            </Tab.Screen>

            <Tab.Screen name="Create">
                {(props: any) => {
                    return <CreateStack isSignedIn={user} theme={theme} userId={user.id} />
                }}
            </Tab.Screen>

            <Tab.Screen name="Join">
                {(props: any) => {
                    return <JoinLeague currentUserId={user.id} navigation={props.navigation} theme={theme} />
                }}
            </Tab.Screen>

            <Tab.Screen
                name="My Account"
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault()
                        navigation.navigate('Account')
                    },
                })}
            >
                {(props: any) => {
                    return <Account />
                }}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export const Routing = () => {
    const currentUser = firebaseApp.auth().currentUser
    const dispatch = useDispatch()
    const userFromRedux = useSelector((store: { user: any }) => store.user)
    const mode = useSelector((store: { theme: any }) => store.theme)
    const theme = mode === 'dark' ? DARK_THEME : LIGHT_THEME

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
                    console.log('here, taking ages')
                    SplashScreen.hide()
                } catch (e) {
                    console.error(e)
                }
            } else if (lastLogin) {
                const faceIdAuthSuccessful = await attemptFaceIDAuthentication()
                if (faceIdAuthSuccessful) {
                    logUserInAndSetUserInRedux()
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
        const oneday = 60 * 60 * 24
        const threeDays = oneday * 3
        const threeDaysSince = Number(lastLogin) + threeDays

        if (threeDaysSince > currentTime) {
            return false
        }
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
        const { emailFromSecureStorage, passwordFromSecureStorage } = await retrieveCredentialsToSecureStorage()
        if (!emailFromSecureStorage || !passwordFromSecureStorage) {
            SplashScreen.hide()
            return
        }
        try {
            const { user } = await logUserInToApplication({
                email: emailFromSecureStorage,
                password: passwordFromSecureStorage,
            })

            await dispatch(getCurrentUser(user))
            await dispatch(getLeagues(user.uid))
        } catch (e) {
            console.error(e, 'error in routing')
        }

        SplashScreen.hide()
    }

    return userFromRedux && Object.values(userFromRedux).length ? (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={({ route }) => ({
                    animationEnabled: true,
                    headerTitleStyle: {
                        color: '#000',
                        fontSize: 25,
                    },
                })}
                mode="modal"
            >
                <Stack.Screen
                    name="Home"
                    options={({ route }) => ({
                        headerTitle: getHeaderTitle(route),
                        headerShown:
                            getHeaderTitle(route) === 'Leagues' || getHeaderTitle(route) === 'Home' ? false : true,
                        headerStyle: {
                            elevation: 5,
                            shadowOpacity: 0,
                            backgroundColor: theme.background.primary,
                        },
                        headerTitleStyle: {
                            color: theme.headings.primary,
                            fontSize: theme.text.xlarge,
                        },
                    })}
                >
                    {(props: any) => <TabNavigation theme={theme} user={userFromRedux} />}
                </Stack.Screen>
                <Stack.Screen
                    name="Account"
                    options={({ route }) => ({
                        headerShown: false,
                    })}
                >
                    {(props: any) => <ModalStacks theme={theme} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    ) : (
        <AuthenticateUserScreen />
    )
}
