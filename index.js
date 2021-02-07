import { AppRegistry } from 'react-native'
import { Routing } from './src/routing'
import { name as appName } from './app.json'
import { Provider, useDispatch } from 'react-redux'
import store from 'src/redux/store'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

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
