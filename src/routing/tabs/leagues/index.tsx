import React from 'react'

import { Stack } from 'src/routing'
import { MyLeagues } from 'src/components/my-leagues'
import { League } from 'src/components/league'

export const LeagueStack = ({ theme }: any) => (
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
            {(props: any) => <League leagueId={props.route.params.leagueId} theme={theme} />}
        </Stack.Screen>
    </Stack.Navigator>
)
