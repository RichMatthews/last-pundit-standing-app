import { firebaseMessaging, firebaseDatabase } from 'app/firebase'
import { Linking } from 'react-native'

const requestPermission = async () => {
  const status = await firebaseMessaging().requestPermission()
  return (
    status === firebaseMessaging.AuthorizationStatus.AUTHORIZED ||
    status === firebaseMessaging.AuthorizationStatus.PROVISIONAL
  )
}

const getToken = async (currentUser) => {
  let fcmToken = await firebaseMessaging().getToken()
  console.log(fcmToken, 'fct?')
  if (fcmToken) {
    if (currentUser) {
      await firebaseDatabase.ref(`users/${currentUser.id}`).update({ token: fcmToken })
    }
  } else {
    alert("We couldn't complete this action at this time. Please try again later")
  }
}

export const checkIfUserHasEnabledPNs = async (currentUser) => {
  const enabled = await firebaseMessaging().hasPermission()
  // 0 === denied
  if (enabled === 0) {
    Linking.openURL('app-settings:')
    return true
  }
  // 1 === AUTHORIZED, 2 === PROVISIONAL
  if (enabled === 1 || enabled === 2) {
    getToken(currentUser)
  } else {
    const requestPermissionGranted = await requestPermission()
    if (requestPermissionGranted) {
      getToken(currentUser)
    }
  }
}
