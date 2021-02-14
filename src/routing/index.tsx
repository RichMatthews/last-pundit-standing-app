import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
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
import {
    attemptFaceIDAuthentication,
    checkFaceIDEnabled,
    getInternetCredentialsForFirebase,
} from 'src/utils/canLoginWithFaceId'
import { setTheme } from 'src/redux/reducer/theme'
import { Host } from 'react-native-portalize'
import AntIcon from 'react-native-vector-icons/AntDesign'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// const getHeaderTitle = (route) => {
//     const routeName = getFocusedRouteNameFromRoute(route) ?? 'Leagues'
//     switch (routeName) {
//         case 'Create':
//             return 'Create League'
//         case 'Join':
//             return 'Join League'
//         case 'Home':
//             return 'Home'
//         case 'Leagues':
//             return 'Leagues'
//     }
// }

const AuthStack = ({ theme }) => (
    <Stack.Navigator
        screenOptions={{
            animationEnabled: false,
            cardStyle: { backgroundColor: theme.background.primary },
            headerShown: false,
            headerTitle: '',
        }}
    >
        <Stack.Screen name="Home">{(props: any) => <Home theme={theme} />}</Stack.Screen>
        <Stack.Screen name="Reset Password">{(props: any) => <ResetPassword theme={theme} />}</Stack.Screen>
        <Stack.Screen name="Update Email">{(props: any) => <UpdateEmail theme={theme} />}</Stack.Screen>
    </Stack.Navigator>
)

const Stacks = ({ isSignedIn, theme }: any) => (
    <Stack.Navigator>
        {isSignedIn ? (
            <>
                <Stack.Screen
                    name="My Leagues"
                    options={{
                        headerStyle: {
                            backgroundColor: theme.background.primary,
                            shadowOpacity: 0,
                        },
                        headerTintColor: theme.text.primary,
                    }}
                >
                    {(props: any) => <MyLeagues navigation={props.navigation} theme={theme} />}
                </Stack.Screen>

                <Stack.Screen
                    name="League"
                    options={{
                        headerTintColor: theme.text.primary,
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
            cardStyle: { backgroundColor: theme.background.primary },
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
        screenOptions={{
            headerTitle: 'Settings',
            headerTitleStyle: { color: theme.text.primary },
            headerBackImage: () => (
                <AntIcon name="close" color={theme.button.color} size={20} style={{ marginLeft: 20 }} />
            ),
            headerBackTitleVisible: false,
            animationEnabled: true,
            cardStyle: { backgroundColor: theme.background.primary },
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
                labelStyle: { fontSize: theme.text.small },
                style: {
                    borderTopColor: 'transparent',
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
                    return <AuthStack theme={theme} />
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
                        options={({ route }) => ({
                            headerShown: false,
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
        </Host>
    ) : (
        <AuthenticateUserScreen theme={theme} />
    )
}

// const LoggedInNavigator = () => (

// )

const LoggedOutNavigator = ({ theme }) => <AuthenticateUserScreen theme={theme} />
