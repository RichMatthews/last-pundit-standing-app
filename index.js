import React from 'react'
import { AppRegistry, Platform, Text, TouchableOpacity, View } from 'react-native'
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
    success: ({ text1, text2, props, ...rest }) => (
        <TouchableOpacity activeOpacity={0.8} onPress={props.onPress}>
            <View
                style={{
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    height: 80,
                    flexDirection: 'row',
                    margin: 10,
                    width: '85%',
                    shadowOpacity: 1,
                    shadowRadius: 3,
                    shadowColor: '#ccc',
                    shadowOffset: { height: 2, width: 0 },
                }}
            >
                <View
                    style={{
                        width: 10,
                        height: '100%',
                        backgroundColor: 'red',
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                    }}
                />
                <View style={{ justifyContent: 'center', marginLeft: 15 }}>
                    <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold', fontWeight: '600' }}>
                        {text1}
                    </Text>
                    <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold' }}>{text2}</Text>
                </View>
                <TouchableOpacity onPress={props.onHide}>
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
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
