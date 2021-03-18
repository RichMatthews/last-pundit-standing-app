import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import AntIcon from 'react-native-vector-icons/AntDesign'

import { Account } from 'src/screens/MyAccount'
import { ResetPassword } from 'src/components/reset-password'
import { UpdateEmail } from 'src/components/update-email'

export const Stack = createStackNavigator()

export const SettingsStack = ({ theme }) => (
  <Stack.Navigator
    screenOptions={{
      headerTitle: 'Settings',
      headerTitleStyle: { color: theme.text.primary },
      headerBackImage: () => <AntIcon name="close" color={theme.button.color} size={20} style={{ marginLeft: 20 }} />,
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
        {(props: any) => <UpdateEmail theme={theme} navigation={props.navigation} />}
      </Stack.Screen>
      <Stack.Screen name="Reset Password">{(props: any) => <ResetPassword theme={theme} />}</Stack.Screen>
    </>
  </Stack.Navigator>
)
