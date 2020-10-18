import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Account } from '../components/account'
import { CreateLeague } from '../components/create-league'
import { ChooseTeam } from '../components/choose-team'
import { Home } from '../components/home'
import { JoinLeague } from '../components/join-league'
import { MyLeagues } from '../components/my-leagues'
import { League } from '../components/league'
import { AuthenticateUserScreen } from '../components/authenticate-user'
import { PageNotFound } from '../components/404'
import { AdminView } from '../admin/view'
import { ForgotPassword } from '../components/forgot-password'
import { ResetPassword } from '../components/reset-password'

import { getUserLeagues } from '../firebase-helpers'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()
const RootStack = createStackNavigator()

const AuthStack = ({ resetPassword }: any) => (
    <Stack.Navigator>
        {resetPassword ? (
            <Stack.Screen name="Reset Password">{(props: any) => <ResetPassword />}</Stack.Screen>
        ) : (
            <Stack.Screen name="Home">{(props: any) => <Home />}</Stack.Screen>
        )}
    </Stack.Navigator>
)

const Stacks = ({ isSignedIn, setUserExists, userLeagues, userId }: any) => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: '#F2F1F7' },
            headerShown: true,
            headerTitle: '',
        }}
    >
        {isSignedIn ? (
            <>
                <Stack.Screen name="My Leagues">
                    {(props: any) => <MyLeagues userLeagues={userLeagues} navigation={props.navigation} />}
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

const ModalStacks = () => (
    <Stack.Navigator headerMode="none" screenOptions={{ animationEnabled: true }} mode="modal">
        <Stack.Screen name="My Account" component={Account} options={{ animationEnabled: true }} />
    </Stack.Navigator>
)

// const RootStack = () => <Stack.Screen name="Account" component={Account} options={{ animationEnabled: true }} />

const CreatePlaceholder = () => <View style={{ flex: 1, backgroundColor: 'blue' }} />

const TabNavigation = ({ setUserExists, userExists, userLeagues, userId }: any) => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#289960',
                labelStyle: { fontSize: 13 },
            }}
        >
            <Tab.Screen name="Home">
                {(props: any) => {
                    return <AuthStack resetPassword={props.route.params && props.route.params.resetPassword} />
                }}
            </Tab.Screen>
            <Tab.Screen name="Create" children={() => <CreateLeague currentUserId={userId} />} />
            <Tab.Screen name="Join" component={JoinLeague} />
            <Tab.Screen name="Leagues">
                {(props: any) => {
                    return (
                        <Stacks
                            isSignedIn={userExists}
                            userLeagues={userLeagues}
                            userId={userId}
                            setUserExists={setUserExists}
                        />
                    )
                }}
            </Tab.Screen>
            <Tab.Screen
                name="My Account"
                component={Account}
                listeners={({ navigation }) => ({
                    tabPress: (event) => {
                        event.preventDefault()
                        navigation.navigate('Account')
                    },
                })}
            />
        </Tab.Navigator>
    )
}

export const Routing = () => {
    const userId = 'L6WkWV0bSPN8a0NIQ0wdTAiGokj2'
    const [userLeagues, setUserLeagues] = useState([])
    const [userExists, setUserExists] = useState(false)

    useEffect(() => {
        if (userId) {
            getUserLeagues2(userId)
        }
    }, [])

    const getUserLeagues2 = async (userId: any) => {
        const userLeagues: any = await getUserLeagues({ userId })
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
                            userId={userId}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Account">{(props: any) => <ModalStacks />}</Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

{
    /* <Route exact={true} path="/" component={Home} />
<PublicRoute exact={true} path="/login" component={AuthenticateUserScreen} />
<PublicRoute exact={true} path="/sign-up" component={AuthenticateUserScreen} />
<PublicRoute exact={true} path="/forgot" component={ForgotPassword} />
<ProtectedRoute exact={true} path="/create" component={CreateLeague} currentUserId={userId} />
<ProtectedRoute exact={true} path="/join" component={JoinLeague} currentUserId={userId} />
<ProtectedRoute
    exact={true}
    path="/leagues"
    component={MyLeagues}
    currentUserId={userId}
    userLeagues={userLeagues}
/>
<ProtectedRoute exact={true} path="/leagues/:leagueId" component={League} currentUserId={userId} />
<ProtectedRoute exact={true} path="/leagues/:leagueId/current-round" component={Home} />
<ProtectedRoute exact={true} path="/leagues/:leagueId/:roundId" component={Home} />
<ProtectedRoute exact={true} path="/choose-team" component={ChooseTeam} />
<ProtectedRoute exact={true} path="/leagues/:leagueId/:roundId/choose-team" component={ChooseTeam} />
<ProtectedRoute exact={true} path="/admin" component={AdminView} />
<ProtectedRoute path="*" component={PageNotFound} /> */
}
