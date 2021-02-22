import React from 'react'
import AntIcon from 'react-native-vector-icons/AntDesign'
import { Stack } from 'src/routing'

import { Account } from 'src/components/account'
import { ResetPassword } from 'src/components/reset-password'
import { UpdateEmail } from 'src/components/update-email'

export const SettingsStack = ({ theme }) => (
    <Stack.Navigator
        screenOptions={{
            headerTitle: 'Settings',
            headerTitleStyle: { color: theme.text.primary },
            headerBackImage: () => (
                <AntIcon name="close" color={theme.button.color} size={20} style={{ marginLeft: 20 }} />
            ),
            headerBackTitleVisible: false,
            animationEnabled: true,
            cardStyle: { backgroundColor: theme.background.primary },
        }}
        mode="modal"
    >
        <>
            <Stack.Screen name="Account" options={{ animationEnabled: true }}>
                {(props: any) => {
                    return <Account navigation={props.navigation} theme={theme} />
                }}
            </Stack.Screen>
            <Stack.Screen options={{ headerTitle: 'Update Email' }} name="Update Email">
                {(props: any) => <UpdateEmail theme={theme} />}
            </Stack.Screen>
            <Stack.Screen name="Reset Password">{(props: any) => <ResetPassword theme={theme} />}</Stack.Screen>
        </>
    </Stack.Navigator>
)
