import React from 'react'
import { AppRegistry } from 'react-native'
import { Routing } from './src/routing'
import { name as appName } from './app.json'
import { Provider, useDispatch } from 'react-redux'
import store from 'src/redux/store'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast, { BaseToast } from 'react-native-toast-message'

import { firebaseMessaging } from './firebase'

firebaseMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
    alert('Message handled in the background!')
})

const toastConfig = {
    success: ({ text1, text2, ...rest }) => (
        <BaseToast
            {...rest}
            style={{ borderLeftColor: 'pink', height: 80 }}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            text1Style={{
                fontSize: 17,
                fontFamily: 'Hind',
            }}
            text2Style={{
                fontSize: 15,
                fontFamily: 'Hind',
                lineHeight: 22,
            }}
            text1={text1}
            text2={text2}
        />
    ),
}

const WrappedInRedux = () => {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <Routing />
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaProvider>
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => WrappedInRedux)
