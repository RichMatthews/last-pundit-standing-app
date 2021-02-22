import React from 'react'
import { Stack } from 'src/routing'
import { CreateLeague } from 'src/components/create-league'

export const CreateStack = ({ theme }: any) => (
    <Stack.Navigator
        screenOptions={{
            cardStyle: { backgroundColor: theme.background.primary },
            headerShown: false,
            headerTitle: '',
        }}
    >
        <Stack.Screen name="My Leagues">
            {(props: any) => <CreateLeague navigation={props.navigation} theme={theme} />}
        </Stack.Screen>
    </Stack.Navigator>
)
