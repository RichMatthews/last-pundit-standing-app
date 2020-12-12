import SplashScreen from 'react-native-splash-screen'
import * as LocalAuthentication from 'expo-local-authentication'
import * as Keychain from 'react-native-keychain'

export const retrieveCredentialsToSecureStorage: any = async () => {
    const credentials: any = await Keychain.getGenericPassword()

    return {
        emailFromSecureStorage: credentials.username,
        passwordFromSecureStorage: credentials.password,
    }
}

export const canLoginWithFaceIdAndUpdateKeyChain = async () => {
    console.log('CALLING biometricAuth func')
    const creds = await retrieveCredentialsToSecureStorage()
    Keychain.getSupportedBiometryType().then((bioType) => {
        switch (bioType) {
            case 'FaceID':
                setFaceId(creds.emailFromSecureStorage, creds.passwordFromSecureStorage)
        }
    })
}

const setFaceId = (email: string, password: string) => {
    console.log('hi?')
    Keychain.setGenericPassword(email, password, {
        service: 'org.reactjs.native.example.LastPunditStanding',
        accessControl: 'BiometryAny' as any,
        accessible: 'AccessibleWhenPasscodeSetThisDeviceOnly' as any,
    })
        .then((res) => console.log(res))
        .catch((e) => console.log(e))
}

export const faceIdAuthenticationSuccessful = async () => {
    try {
        const result = await Keychain.getGenericPassword({
            service: 'org.reactjs.native.example.LastPunditStanding',
        })
        if (!result) {
            console.log('bio auth failed')
        } else {
            console.log('bio auth passed')
            return true
        }
    } catch (e) {
        console.log('ERRORED:', e)
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
