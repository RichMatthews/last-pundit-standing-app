import database from '@react-native-firebase/database'
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging'
import firebase from '@react-native-firebase/app'

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

// let config
// // doing this in case we add a dev database further down the line
// if (process.env.NODE_ENV === 'production') {
//     config = Production_firebaseConfig
// } else {
//     config = Production_firebaseConfig
// }

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export const firebaseAuth = auth
export const firebaseMessaging = messaging
export const firebaseDatabase = database
export default firebase
