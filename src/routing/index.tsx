import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SplashScreen from 'react-native-splash-screen'
import { useDispatch, useSelector } from 'react-redux'

import * as RootNavigation from 'src/root-navigation'
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

import { canLoginWithFaceId, retrieveCredentialsToSecureStorage } from 'src/utils/canLoginWithFaceId'

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

const Stacks = ({ isSignedIn, userLeaguesFetchComplete }: any) => (
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
                    {(props: any) => (
                        <MyLeagues navigation={props.navigation} userLeaguesFetchComplete={userLeaguesFetchComplete} />
                    )}
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

const TabNavigation = ({ userLeaguesFetchComplete, user }: any) => {
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
                    return (
                        <Stacks
                            isSignedIn={user}
                            userLeaguesFetchComplete={userLeaguesFetchComplete}
                            userId={user.id}
                        />
                    )
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
    const [userLeaguesFetchComplete, setUserLeaguesFetchComplete] = useState(false)

    const currentUser = firebaseApp.auth().currentUser
    const dispatch = useDispatch()
    const userFromRedux = useSelector((store: { user: any }) => store.user)
    const lastLogin = 4

    useEffect(() => {
        console.log(SplashScreen)
        async function getUser() {
            if (currentUser) {
                await dispatch(getCurrentUser({ userId: currentUser.uid }))
                await dispatch(getLeagues({ userId: currentUser.uid }))
                await dispatch(getCurrentGameWeekInfo())
                SplashScreen.hide()

                setUserLeaguesFetchComplete(true)
            } else if (lastLogin > 3) {
                logUserInAndSetUserInRedux()
            } else {
                const successfullyAuthenticatedWithFaceId = await canLoginWithFaceId()
                if (successfullyAuthenticatedWithFaceId) {
                    logUserInAndSetUserInRedux()
                }
            }
        }
        getUser()
    }, [currentUser])

    const logUserInAndSetUserInRedux = async () => {
        const { emailFromSecureStorage, passwordFromSecureStorage } = await retrieveCredentialsToSecureStorage()
        const user = await logUserInToApplication({
            email: emailFromSecureStorage,
            password: passwordFromSecureStorage,
        })

        if (user && user.user) {
            await dispatch(getCurrentUser(user.user.uid))
        }

        SplashScreen.hide()

        setUserLeaguesFetchComplete(true)
    }

    return userFromRedux && Object.values(userFromRedux).length ? (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" screenOptions={{ animationEnabled: true }} mode="modal">
                <Stack.Screen name="TabScreen">
                    {(props: any) => (
                        <TabNavigation userLeaguesFetchComplete={userLeaguesFetchComplete} user={userFromRedux} />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Account">{(props: any) => <ModalStacks />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    ) : (
        <AuthenticateUserScreen />
    )
}
