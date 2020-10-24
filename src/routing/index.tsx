import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { Account } from '../components/account'
import { CreateLeague } from '../components/create-league'
import { ChooseTeam } from '../components/choose-team'
import { Home } from '../components/home'
import { JoinLeague } from '../components/join-league'
import { MyLeagues } from '../components/my-leagues'
import { League } from '../components/league'
import { AuthenticateUserScreen } from '../components/authenticate-user'
import { ResetPassword } from '../components/reset-password'
import { UpdateEmail } from '../components/update-email'

import { getUserLeagues, getUserInformation } from '../firebase-helpers'
import { firebaseApp } from '../config.js'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const AuthStack = ({ resetPassword, updateEmail }: any) => (
    <Stack.Navigator
        screenOptions={{
            animationEnabled: false,
            cardStyle: { backgroundColor: '#F2F1F7' },
            headerShown: false,
            headerTitle: '',
        }}
    >
        <Stack.Screen name="Reset Password">{(props: any) => <ResetPassword />}</Stack.Screen>
        <Stack.Screen name="Update Email">{(props: any) => <UpdateEmail />}</Stack.Screen>
        <Stack.Screen name="Home">{(props: any) => <Home />}</Stack.Screen>
    </Stack.Navigator>
)

const Stacks = ({ isSignedIn, setUserExists, userLeagues, userLeaguesFetchComplete, userId }: any) => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: '#F2F1F7' },
            headerShown: false,
            headerTitle: '',
        }}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen name="My Leagues">
                    {(props: any) => (
                        <MyLeagues
                            navigation={props.navigation}
                            userLeagues={userLeagues}
                            userLeaguesFetchComplete={userLeaguesFetchComplete}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="League">
                    {(props: any) => (
                        <League
                            currentUserId={userId}
                            leagueId={props.route.params.leagueId}
                            navigation={props.navigation}
                        />
                    )}
                </Stack.Screen>
            </>
        ) : (
            <>
                <Stack.Screen name="Sign In">
                    {(props: any) => (
                        <AuthenticateUserScreen navigation={props.navigation} setUserExists={setUserExists} />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Sign Up">
                    {(props: any) => (
                        <AuthenticateUserScreen navigation={props.navigation} setUserExists={setUserExists} />
                    )}
                </Stack.Screen>
            </>
        )}
    </Stack.Navigator>
)

const CreateStack = ({ isSignedIn, setUserExists, userId }) => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: '#F2F1F7' },
            headerShown: false,
            headerTitle: '',
        }}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen name="My Leagues">
                    {(props: any) => <CreateLeague navigation={props.navigation} currentUserId={userId} />}
                </Stack.Screen>
            </>
        ) : (
            <>
                <Stack.Screen name="Sign In">
                    {(props: any) => (
                        <AuthenticateUserScreen navigation={props.navigation} setUserExists={setUserExists} />
                    )}
                </Stack.Screen>
            </>
        )}
    </Stack.Navigator>
)

const ModalStacks = ({ setUserExists, user }) => (
    <Stack.Navigator headerMode="none" screenOptions={{ animationEnabled: true }} mode="modal">
        <Stack.Screen name="Account" options={{ animationEnabled: true }}>
            {(props: any) => {
                return <Account navigation={props.navigation} setUserExists={setUserExists} user={user} />
            }}
        </Stack.Screen>
    </Stack.Navigator>
)

const TabNavigation = ({ setUserExists, userExists, userLeagues, userLeaguesFetchComplete, userId }: any) => {
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
            <Tab.Screen
                name="Home"
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        console.log('press')
                        event.preventDefault()
                        console.log(userExists)
                        navigation.navigate('Home', { screen: 'Home', resetPassword: false, updateEmail: false })
                    },
                })}
            >
                {(props: any) => {
                    return <AuthStack />
                }}
            </Tab.Screen>
            {userExists && (
                <Tab.Screen name="Create">
                    {(props: any) => {
                        return <CreateStack isSignedIn={userExists} setUserExists={setUserExists} userId={userId} />
                    }}
                </Tab.Screen>
            )}
            {userExists && (
                <Tab.Screen name="Join">
                    {(props: any) => {
                        return <JoinLeague navigation={props.navigation} currentUserId={userId} />
                    }}
                </Tab.Screen>
            )}
            <Tab.Screen name="Leagues">
                {(props: any) => {
                    return (
                        <Stacks
                            isSignedIn={userExists}
                            userLeaguesFetchComplete={userLeaguesFetchComplete}
                            userLeagues={userLeagues}
                            userId={userId}
                            setUserExists={setUserExists}
                        />
                    )
                }}
            </Tab.Screen>
            {userExists && (
                <Tab.Screen
                    name="My Account"
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            event.preventDefault()
                            console.log(userExists)
                            navigation.navigate('Account')
                        },
                    })}
                >
                    {(props: any) => {
                        return <Account />
                    }}
                </Tab.Screen>
            )}
        </Tab.Navigator>
    )
}

export const Routing = () => {
    const [userLeagues, setUserLeagues] = useState([])
    const [userExists, setUserExists] = useState(false)
    const [user, setUser] = useState({ name: '' })
    const [userLeaguesFetchComplete, setUserLeaguesFetchComplete] = useState(false)
    const currentUser = firebaseApp.auth().currentUser

    useEffect(() => {
        async function getUser() {
            if (currentUser) {
                const userInfo = await getUserInformation(currentUser.uid)
                fetchUserLeagues(userInfo.id)
                setUserExists(true)
                setUser(userInfo)
            }
        }

        getUser()
    }, [currentUser])

    const fetchUserLeagues = async (userId: any) => {
        const userLeagues: any = await getUserLeagues({ setUserLeaguesFetchComplete, userId })
        setUserLeagues(userLeagues)
    }

    return (
        <NavigationContainer>
            <Stack.Navigator headerMode="none" screenOptions={{ animationEnabled: true }} mode="modal">
                <Stack.Screen name="TabScreen">
                    {(props: any) => (
                        <TabNavigation
                            setUserExists={setUserExists}
                            userExists={userExists}
                            userLeagues={userLeagues}
                            userLeaguesFetchComplete={userLeaguesFetchComplete}
                            userId={user && user.id}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Account">
                    {(props: any) => <ModalStacks setUserExists={setUserExists} user={user} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}
