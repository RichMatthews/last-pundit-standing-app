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

// export const canLoginWithFaceId = async () => {
//     console.log('CALLING biometricAuth func')
//     try {
//         const credentials = await Keychain.getGenericPassword()
//         console.log(credentials, 'creds')
//         if (!credentials) {
//             console.log('NO EMAIL OR PASSWORD')
//             SplashScreen.hide()
//             return
//         }
//     } catch (e) {
//         console.log(e, 'getting creds erros')
//     }

//     const compatible = await LocalAuthentication.hasHardwareAsync()
//     if (compatible) {
//         let biometricRecords = await LocalAuthentication.isEnrolledAsync()
//         if (!biometricRecords) {
//             console.log('no bio records')
//             SplashScreen.hide()
//             return false
//         } else {
//             let result = await LocalAuthentication.authenticateAsync()
//             if (result.success) {
//                 console.log('SUCCESSFULLY BIO AUTHED')
//                 return true
//             } else {
//                 console.log('FAILED BIO AUTH')
//                 SplashScreen.hide()
//                 return false
//             }
//         }
//     } else {
//         SplashScreen.hide()
//     }
// }
