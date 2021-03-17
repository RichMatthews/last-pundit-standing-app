import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { MyLeagues } from 'src/screens/MyLeagues'
import { League } from 'src/screens/League'

export const Stack = createStackNavigator()

export const LeagueStack = ({ leagueId, navigation, theme }: any) => {
  useEffect(() => {
    if (leagueId) {
      navigation.navigate('League', { leagueId })
    }
  }, [leagueId, navigation])

  return (
    <Stack.Navigator>
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
        {(props: any) => {
          return <League leagueId={props.route.params.leagueId} theme={theme} />
        }}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
