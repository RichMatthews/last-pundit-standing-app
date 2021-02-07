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

const isIos = Platform.OS === 'ios'
const iconSize = isIos ? 20 : 20
const width = Dimensions.get('window').width

export const Account = ({ navigation, theme }: any) => {
    const [faceIdActivated, setFaceIdActivated] = useState(false)
    const mode = useSelector((store: { theme: any }) => store.theme)
    const user = useSelector((store: { user: any }) => store.user)
    const dispatch = useDispatch()

    useEffect(() => {
        getFaceIdStatus()
    }, [])

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
        navigation.navigate('Home', { screen: 'Reset Password', resetPassword: true })
    }

    const updateEmailHelper = () => {
        navigation.navigate('Home', { screen: 'Update Email', resetPassword: false, updateEmail: true })
    }

    const setModeAndAppendToStorage = async () => {
        const newMode = mode === 'light' ? 'dark' : 'light'
        dispatch(setTheme(newMode))
        await AsyncStorage.setItem('theme', newMode)
    }

    return (
        <View style={styles(theme).container}>
            <View style={{ flex: 1 }}>
                <Text style={styles(theme).heading}>Name</Text>
                <View style={styles(theme).section}>
                    <SettingsRow text={`${user.name} ${user.surname}`} theme={theme} />
                </View>
                <Text style={styles(theme).heading}>Security</Text>
                <View style={styles(theme).section}>
                    <TouchableOpacity onPress={() => updateEmailHelper()}>
                        <SettingsRow
                            text="Update Email"
                            theme={theme}
                            icon={
                                <MaterialCommIcon
                                    name="email-edit-outline"
                                    size={iconSize}
                                    color={styles(theme).icon.color}
                                    style={styles(theme).icon}
                                />
                            }
                            rightArrow
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => resetPasswordHelper()}>
                        <SettingsRow
                            text="Reset Password"
                            theme={theme}
                            icon={
                                <MaterialCommIcon
                                    name="lock-outline"
                                    size={iconSize}
                                    color={styles(theme).icon.color}
                                    style={styles(theme).icon}
                                />
                            }
                            rightArrow
                        />
                    </TouchableOpacity>
                    <SettingsRow
                        text="Authenticate with FaceID"
                        theme={theme}
                        icon={
                            <Image
                                source={require('./face-recognition.png')}
                                style={[styles(theme).icon, { width: iconSize, height: iconSize }]}
                            />
                        }
                        togglePress={() => toggleFaceIdActivated(!faceIdActivated)}
                        toggleValue={faceIdActivated}
                    />
                </View>
                <Text style={styles(theme).heading}>Theme</Text>
                <View style={styles(theme).section}>
                    <SettingsRow
                        text="Dark Mode"
                        theme={theme}
                        togglePress={setModeAndAppendToStorage}
                        toggleValue={mode === 'dark'}
                    />
                </View>
            </View>
            <TouchableNativeFeedback onPress={() => dispatch(signUserOut({ navigation }))}>
                <Text style={styles(theme).signOut}>Sign out</Text>
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
            padding: 10,
            width: width * 0.9,
        },
        signOut: {
            color: 'red',
            textAlign: 'center',
            marginBottom: 50,
            fontSize: isIos ? 18 : 15,
        },
    })
