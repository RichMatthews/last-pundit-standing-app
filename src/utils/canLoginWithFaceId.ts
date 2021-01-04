import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Keychain from 'react-native-keychain'

const checkIfUserDeviceSupportsFaceID = async () => {
    const bioType = await Keychain.getSupportedBiometryType()
    if (bioType === 'FaceID') {
        return true
    }
    return false
}

export const checkFaceIDEnabled = async () => {
    const faceIdEnabled = await AsyncStorage.getItem('faceIdStatus')

    if (faceIdEnabled === 'active') {
        return true
    }

    return false
}

export const turnOnFaceIDAuthentication = async () => {
    const canUseFaceID = await checkIfUserDeviceSupportsFaceID()

    if (!canUseFaceID) {
        return false
    }

    const username = 'random'
    const password = 'random'

    await Keychain.setGenericPassword(username, password, {
        service: 'com.live.lastpunditstanding',
        accessControl: 'BiometryAny' as any,
        accessible: 'AccessibleWhenPasscodeSetThisDeviceOnly' as any,
    })

    try {
        const credentials = await Keychain.getGenericPassword()
        if (credentials) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

export const getInternetCredentialsForFirebase = async () => {
    const credentials = await Keychain.getInternetCredentials('firebase')
    return credentials
}

export const attemptFaceIDAuthentication = async () => {
    try {
        const result = await Keychain.getGenericPassword({
            service: 'com.live.lastpunditstanding',
        })

        if (result) {
            return true
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}
