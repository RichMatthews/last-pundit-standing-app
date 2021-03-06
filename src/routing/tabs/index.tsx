import React from 'react'
import { Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { CreateStack } from 'src/routing/tabs/create'
import { LeagueStack } from 'src/routing/tabs/leagues'
import { RenderCorrectIcon } from 'src/routing/utils'
import { Account } from 'src/screens/MyAccount'
import { JoinLeague } from 'src/screens/JoinLeague'

const Tab = createBottomTabNavigator()

export const TabNavigation = ({ leagueId, theme, user }: any) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => (
        <RenderCorrectIcon focused={focused} route={route} size={size} theme={theme} />
      ),
    })}
    tabBarOptions={{
      activeTintColor: theme.purple,
      inactiveTintColor: theme.text.primary,
      labelStyle: { fontSize: theme.text.small, fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular' },
      style: {
        borderTopColor: 'transparent',
        backgroundColor: theme.background.primary,
      },
    }}
  >
    <Tab.Screen name="Leagues">
      {(props) => {
        return <LeagueStack leagueId={leagueId} navigation={props.navigation} theme={theme} userId={user.id} />
      }}
    </Tab.Screen>

    <Tab.Screen name="Create">
      {() => {
        return <CreateStack theme={theme} userId={user.id} />
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
      {() => {
        return <Account />
      }}
    </Tab.Screen>
  </Tab.Navigator>
)
