import React, { useEffect, useState } from 'react'
import { NativeRouter, Redirect, Route, Link } from 'react-router-native'
import { AsyncStorage } from 'react-native'

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

export const Routing = () => {
    // const userExists: any = async () => await AsyncStorage.getItem('authUser')
    // let userId: string | null = null
    // if (userExists) {
    //     userId = JSON.parse(userExists()).user.uid
    // }
    const userExists = true
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
        <NativeRouter>
            <Navigation currentUserId={userId} />
            <Route exact={true} path="/" component={Home} />
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
            <ProtectedRoute path="*" component={PageNotFound} />
        </NativeRouter>
    )
}
