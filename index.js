import React from 'react'
import { AppRegistry, Platform, Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { Routing } from './src/routing'
import { name as appName } from './app.json'
import { Provider } from 'react-redux'
import store from 'src/redux/store'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/EvilIcons'

import { firebaseMessaging } from './firebase'

firebaseMessaging().setBackgroundMessageHandler(async (remoteMessage) => {
  alert('Message handled in the background!')
})

const toastConfig = {
  success: ({ text1, text2, props, ...rest }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={props.onPress} style={[styles.toastContainer, styles.leftBorder]}>
      <View style={styles.content}>
        <View style={styles.topContent}>
          <Text style={styles.heading}>{text1}</Text>
          <TouchableOpacity onPress={props.onHide}>
            <Icon name="close" size={20} color={'grey'} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>{text2}</Text>
      </View>
    </TouchableOpacity>
  ),
}

const styles = StyleSheet.create({
  toastContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    width: '95%',
    minHeight: 65,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  leftBorder: {
    borderLeftWidth: 10,
    borderLeftColor: '#390d40',
  },
  content: {
    flexDirection: 'column',
    width: '100%',
  },
  heading: {
    fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
    fontWeight: '500',
    fontSize: 17,
  },
  subText: {
    color: '#8f8f8f',
    fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular',
    lineHeight: 18,
    paddingTop: 5,
  },
  topContent: {
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
})

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
