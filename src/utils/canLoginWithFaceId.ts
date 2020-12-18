import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Keychain from 'react-native-keychain'
import * as LocalAuthentication from 'expo-local-authentication'

export const retrieveCredentialsToSecureStorage: any = async () => {
    const credentials: any = await Keychain.getGenericPassword()

    return {
        emailFromSecureStorage: credentials.username,
        passwordFromSecureStorage: credentials.password,
    }
}

export const canLoginWithFaceIdAndUpdateKeyChain = async () => {
    console.log('CALLING biometricAuth func')
    const faceIdTurnedOn = await AsyncStorage.getItem('faceIdStatus')
    console.log(faceIdTurnedOn, 'turned on!')
    if (faceIdTurnedOn !== 'active') {
        return
    }
    const creds = await retrieveCredentialsToSecureStorage()
    Keychain.getSupportedBiometryType().then((bioType) => {
        switch (bioType) {
            case 'FaceID':
                setCredentialsInKeyChain(creds.emailFromSecureStorage, creds.passwordFromSecureStorage)
        }
    })
}

const setCredentialsInKeyChain = (email: string, password: string) => {
    Keychain.setGenericPassword(email, password, {
        service: 'org.reactjs.native.example.LastPunditStanding',
        accessControl: 'BiometryAny' as any,
        accessible: 'AccessibleWhenPasscodeSetThisDeviceOnly' as any,
    })
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
}

export const attemptFaceIDAuthentication = async () => {
    const faceIdTurnedOn = await AsyncStorage.getItem('faceIdStatus')
    console.log(faceIdTurnedOn, 'turned on!')
    if (faceIdTurnedOn !== 'active') {
        return
    }
    try {
        const result = await Keychain.getGenericPassword({
            service: 'org.reactjs.native.example.LastPunditStanding',
        })
        if (!result) {
            console.log('bio auth failed')
            return false
        } else {
            console.log('bio auth passed')
            let res = await LocalAuthentication.authenticateAsync()
            console.log(res, 'what happed?')
            if (res.success) {
                return true
            }
            return false
        }
    } catch (e) {
        console.log('ERRORED:', e)
        return false
    }
}
