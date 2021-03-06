import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  TouchableNativeFeedback,
  View,
  StyleSheet,
} from 'react-native'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { signUserOut } from 'src/redux/reducer/leagues'
import { setTheme } from 'src/redux/reducer/theme'
import { checkFaceIDEnabled, turnOnFaceIDAuthentication } from 'src/utils/canLoginWithFaceId'
import { SettingsRow } from './settingsRow'
import { pushNotificationsAccepted, pushNotificationsRejected } from 'src/redux/reducer/push-notifications'
import { checkIfUserHasEnabledPNs } from 'src/utils/firebaseMessaging'
import { firebaseDatabase } from 'app/firebase'

const isIos = Platform.OS === 'ios'
const iconSize = isIos ? 20 : 20
const width = Dimensions.get('window').width

export const Account = ({ navigation, theme }: any) => {
  const [faceIdActivated, setFaceIdActivated] = useState(false)
  const mode = useSelector((store: { theme: any }) => store.theme)
  const user = useSelector((store: { user: any }) => store.user)
  const pushNotifications = useSelector((store: { pushNotifications: any }) => store.pushNotifications)
  const dispatch = useDispatch()

  useEffect(() => {
    getFaceIdStatus()
  }, [])

  const { container, settingsWrapper, heading, section, icon, signOut } = styles(theme)

  const getFaceIdStatus = async () => {
    const faceIDEnabled = await checkFaceIDEnabled()

    if (faceIDEnabled) {
      setFaceIdActivated(true)
    } else {
      setFaceIdActivated(false)
    }
  }

  const toggleFaceIdActivated = async (activated: boolean) => {
    if (activated) {
      const success = await turnOnFaceIDAuthentication()

      if (success) {
        await AsyncStorage.setItem('faceIdStatus', 'active')
        setFaceIdActivated(true)
      }
    } else {
      await AsyncStorage.setItem('faceIdStatus', '')
      setFaceIdActivated(false)
    }
  }

  const resetPasswordHelper = () => {
    navigation.navigate('Reset Password', { screen: 'Reset Password', resetPassword: true })
  }

  const updateEmailHelper = () => {
    navigation.navigate('Update Email', { screen: 'Update Email', resetPassword: false, updateEmail: true })
  }

  const setModeAndAppendToStorage = async () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newMode))
    await AsyncStorage.setItem('theme', newMode)
  }

  const togglePushNotifications = async () => {
    const currentStatus = pushNotifications.status
    if (currentStatus === 1) {
      await removeTokenOnServer()
    } else {
      await checkIfUserHasEnabledPNs(user)
      dispatch(pushNotificationsAccepted())
    }
  }

  const removeTokenOnServer = async () => {
    const ref = firebaseDatabase.ref(`users/${user.id}/token`)
    try {
      await ref.remove()
      dispatch(pushNotificationsRejected())
    } catch (error) {
      console.log('Remove failed: ' + error.message)
    }
  }

  return (
    <View style={container}>
      <View style={settingsWrapper}>
        <Text style={heading}>Name</Text>
        <View style={section}>
          <SettingsRow text={`${user.name} ${user.surname}`} theme={theme} />
        </View>
        <Text style={heading}>Security</Text>
        <View style={section}>
          <TouchableOpacity onPress={() => updateEmailHelper()} activeOpacity={0.7}>
            <SettingsRow
              text="Update Email"
              theme={theme}
              icon={<MaterialCommIcon name="email-edit-outline" size={iconSize} color={icon.color} style={icon} />}
              rightArrow
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => resetPasswordHelper()}>
            <SettingsRow
              text="Reset Password"
              theme={theme}
              icon={<MaterialCommIcon name="lock-outline" size={iconSize} color={icon.color} style={icon} />}
              rightArrow
            />
          </TouchableOpacity>
          <SettingsRow
            text="Authenticate with FaceID"
            theme={theme}
            icon={
              <Image source={require('./face-recognition.png')} style={[icon, { width: iconSize, height: iconSize }]} />
            }
            togglePress={() => toggleFaceIdActivated(!faceIdActivated)}
            toggleValue={faceIdActivated}
          />
          <SettingsRow
            text="Allow notifications"
            theme={theme}
            icon={
              <Image source={require('./face-recognition.png')} style={[icon, { width: iconSize, height: iconSize }]} />
            }
            togglePress={() => togglePushNotifications()}
            toggleValue={pushNotifications.status === 1}
          />
        </View>
        <Text style={heading}>Theme</Text>
        <View style={section}>
          <SettingsRow
            text="Dark Mode"
            theme={theme}
            togglePress={setModeAndAppendToStorage}
            toggleValue={mode === 'dark'}
          />
        </View>
      </View>
      <TouchableNativeFeedback onPress={() => dispatch(signUserOut({ navigation }))}>
        <Text style={signOut}>Sign out</Text>
      </TouchableNativeFeedback>
    </View>
  )
}

const styles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'center',
      marginTop: 25,
      backgroundColor: theme.background.primary,
    },
    settingsWrapper: {
      flex: 1,
    },
    heading: {
      color: theme.headings.accent,
    },
    icon: {
      color: theme.icons.primary,
      marginRight: 10,
      tintColor: theme.icons.primary,
    },
    section: {
      flexDirection: 'column',
      paddingVertical: 10,
      width: width * 0.9,
    },
    signOut: {
      color: 'red',
      textAlign: 'center',
      marginBottom: 50,
      fontSize: isIos ? 18 : 15,
    },
  })
