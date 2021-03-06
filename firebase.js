import database, { firebase } from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging'
import firebases from '@react-native-firebase/app'

const firebaseConfig = {
    apiKey: 'AIzaSyDGstYWa2DI7Y9V6LIEjZ14l3Tvb3PdA2M',
    authDomain: 'last-pundit-standing.firebaseapp.com',
    databaseURL: 'https://last-pundit-standing.firebaseio.com',
    projectId: 'last-pundit-standing',
    storageBucket: 'last-pundit-standing.appspot.com',
    messagingSenderId: '571433706213',
    appId: '1:571433706213:web:b1b3f66bbbaae27a3b2a0c',
    measurementId: 'G-6NMKP6QLFC',
}

let config
if (process.env.NODE_ENV === 'production') {
    config = database
} else {
    config = firebase.app().database('https://last-pundit-standing-dev.firebaseio.com/')
    console.log(config.ref(), 'con')
    console.log(database, 'dat')
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const firebaseAuth = auth
export const firebaseMessaging = messaging
export const firebaseDatabase = config
export default firebases