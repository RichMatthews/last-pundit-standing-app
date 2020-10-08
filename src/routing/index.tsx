import 'react-native-gesture-handler'
import React, { useEffect, useState } from 'react'
import { NativeRouter, Redirect, Route } from 'react-router-native'
import { View } from 'react-native'
import { AsyncStorage } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { CreateLeague } from '../components/create-league'
import { ChooseTeam } from '../components/choose-team'
import { Home } from '../components/home'
import { JoinLeague } from '../components/join-league'
import { MyLeagues } from '../components/my-leagues'
import { League } from '../components/league'
import { Navigation } from '../components/navigation'
import { AuthenticateUserScreen } from '../components/authenticate-user'
import { PageNotFound } from '../components/404'
import { AdminView } from '../admin/view'
import { ForgotPassword } from '../components/forgot-password'

import { getUserLeagues } from '../firebase-helpers'

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

const Stacks = ({ userLeagues, userId }: any) => (
    <Stack.Navigator>
        <Stack.Screen name="My Leagues">
            {(props: any) => <MyLeagues userLeagues={userLeagues} navigation={props.navigation} />}
        </Stack.Screen>
        <Stack.Screen name="League">
            {(props: any) => <League currentUserId={userId} navigation={props.navigation} />}
        </Stack.Screen>
    </Stack.Navigator>
)

export const Routing = () => {
    let userExists = false
    AsyncStorage.getItem('authUser').then((value) => {
        if (value) {
            userExists = true
        }
    })

    // let userId: string | null = null
    // if (userExists) {
    //     userId = JSON.parse(userExists()).user.uid
    // }

    const userId = 'L6WkWV0bSPN8a0NIQ0wdTAiGokj2'
    const ProtectedRoute = ({ component: Component, ...rest }: any) => {
        return userExists ? <Component {...rest} /> : <Redirect to="/login" />
    }
    const PublicRoute = ({ component: Component, ...rest }: any) => {
        return userExists ? <Redirect to="/leagues" /> : <Component {...rest} />
    }
    const [userLeagues, setUserLeagues] = useState([])

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
            <Tab.Navigator>
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Sign Up" component={AuthenticateUserScreen} />
                <Tab.Screen name="Create League" component={CreateLeague} />
                <Tab.Screen name="Join League" component={JoinLeague} />
                <Tab.Screen name="Leagues">
                    {(props: any) => <Stacks userLeagues={userLeagues} userId={userId} />}
                </Tab.Screen>
            </Tab.Navigator>
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
