import React from 'react'
import { AppRegistry } from 'react-native'
import { Routing } from './src/routing'
import { name as appName } from './app.json'
import { Provider, useDispatch } from 'react-redux'
import store from 'src/redux/store'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { firebaseMessaging } from './firebase'

firebaseMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
    alert('Message handled in the background!')
})

const WrappedInRedux = () => {
    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <Routing />
            </SafeAreaProvider>
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => WrappedInRedux)
