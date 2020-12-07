import SplashScreen from 'react-native-splash-screen'
import * as LocalAuthentication from 'expo-local-authentication'
import SecureStorage from 'react-native-secure-storage'

export const retrieveCredentialsToSecureStorage: any = async () => {
    const secureEmail = await SecureStorage.getItem('secureEmail')
    const securePassword = await SecureStorage.getItem('securePassword')

    return {
        emailFromSecureStorage: secureEmail,
        passwordFromSecureStorage: securePassword,
    }
}

export const canLoginWithFaceId = async () => {
    console.log('CALLING biometricAuth func')
    const { emailFromSecureStorage, passwordFromSecureStorage } = await retrieveCredentialsToSecureStorage()
    console.log(emailFromSecureStorage, 'emmm')
    if (!emailFromSecureStorage || !passwordFromSecureStorage) {
        console.log('NO EMAIL OR PASSWORD')
        SplashScreen.hide()
        return
    }

    const compatible = await LocalAuthentication.hasHardwareAsync()
    if (compatible) {
        let biometricRecords = await LocalAuthentication.isEnrolledAsync()
        if (!biometricRecords) {
            console.log('no bio records')
            SplashScreen.hide()
            return false
        } else {
            let result = await LocalAuthentication.authenticateAsync()
            if (result.success) {
                console.log('SUCCESSFULLY BIO AUTHED')
                return true
            } else {
                console.log('FAILED BIO AUTH')
                SplashScreen.hide()
                return false
            }
        }
    } else {
        SplashScreen.hide()
    }
}
