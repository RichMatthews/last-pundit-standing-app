import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
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
import { logUserInToApplication, signUserUpToApplication } from 'src/firebase-helpers'
import { getCurrentGameWeekInfo } from 'src/redux/reducer/current-gameweek'
import { getLeagues } from 'src/redux/reducer/leagues'
import { getCurrentUser } from 'src/redux/reducer/user'
import { firebaseApp } from '../config.js'

import { attemptFaceIDAuthentication, retrieveCredentialsToSecureStorage } from 'src/utils/canLoginWithFaceId'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

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

const Stacks = ({ isSignedIn }: any) => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: '#fff' },
            headerShown: false,
            headerTitle: '',
            headerStyle: {
                elevation: 0,
                shadowOpacity: 0,
            },
            animationEnabled: false,
        }}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen name="My Leagues">
                    {(props: any) => <MyLeagues navigation={props.navigation} />}
                </Stack.Screen>
                <Stack.Screen
                    name="League"
                    options={{
                        headerTintColor: '#fff',
                        headerBackTitle: 'Back to leagues',
                        headerShown: true,
                        headerStyle: { backgroundColor: '#827ee6', elevation: 0, shadowOpacity: 0 },
                    }}
                >
                    {(props: any) => <League leagueId={props.route.params.leagueId} />}
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

const CreateStack = ({ isSignedIn }: any) => (
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
                    {(props: any) => <CreateLeague navigation={props.navigation} />}
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

const ModalStacks = () => (
    <Stack.Navigator headerMode="none" screenOptions={{ animationEnabled: true }} mode="modal">
        <Stack.Screen name="Account" options={{ animationEnabled: true }}>
            {(props: any) => {
                return <Account navigation={props.navigation} />
            }}
        </Stack.Screen>
    </Stack.Navigator>
)

const TabNavigation = ({ user }: any) => {
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
                        return <MaterialIcons name={'account-circle-outline'} size={size} color={color} />
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
            tabBarOptions={{
                activeTintColor: '#827ee6',
                labelStyle: { fontSize: 13 },
            }}
        >
            <Tab.Screen name="Leagues">
                {(props: any) => {
                    return <Stacks isSignedIn={user} userId={user.id} />
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
                    return <CreateStack isSignedIn={user} userId={user.id} />
                }}
            </Tab.Screen>

            <Tab.Screen name="Join">
                {(props: any) => {
                    return <JoinLeague navigation={props.navigation} currentUserId={user.id} />
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

    useEffect(() => {
        async function getUser() {
            if (await userJustSignedOut()) {
                return
            }
            const lastLogin = await checkIfNeedToReauthenticateUser()

            if (currentUser) {
                try {
                    await dispatch(getCurrentUser(currentUser))
                    await dispatch(getLeagues(currentUser.uid))
                    await dispatch(getCurrentGameWeekInfo())
                    SplashScreen.hide()
                } catch (e) {
                    console.log(e)
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

    const checkIfNeedToReauthenticateUser = async () => {
        const lastLogin = await AsyncStorage.getItem('lastLogin')
        const currentTime = Date.now()
        const oneday = 60 * 60 * 24
        const threeDays = oneday * 3
        const threeDaysSince = Number(lastLogin) + threeDays

        if (threeDaysSince > 2607937909295) {
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
        console.log('CALLING: logUserInAndSetUserInRedux')
        const { emailFromSecureStorage, passwordFromSecureStorage } = await retrieveCredentialsToSecureStorage()
        if (!emailFromSecureStorage || !passwordFromSecureStorage) {
            console.log('1:::')
            SplashScreen.hide()
            return
        }
        try {
            console.log('2:::')
            const { user } = await logUserInToApplication({
                email: emailFromSecureStorage,
                password: passwordFromSecureStorage,
            })

            console.log(user)
            await dispatch(getCurrentUser(user))
            await dispatch(getLeagues(user.uid))
        } catch (e) {
            console.log(e, 'error in routing')
        }

        SplashScreen.hide()
    }

    return userFromRedux && Object.values(userFromRedux).length ? (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" screenOptions={{ animationEnabled: true }} mode="modal">
                <Stack.Screen name="TabScreen">{(props: any) => <TabNavigation user={userFromRedux} />}</Stack.Screen>
                <Stack.Screen name="Account">{(props: any) => <ModalStacks />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    ) : (
        <AuthenticateUserScreen />
    )
}
