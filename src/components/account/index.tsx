import React, { useEffect, useState } from 'react'
import { Image, Platform, Text, TouchableOpacity, TouchableNativeFeedback, Switch, View } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { signUserOut } from 'src/redux/reducer/leagues'
import { setTheme } from 'src/redux/reducer/theme'
import { styles } from './styles'
import { checkFaceIDEnabled, turnOnFaceIDAuthentication } from 'src/utils/canLoginWithFaceId'
const iconSize = Platform.OS === 'ios' ? 20 : 20

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
        <View style={{ alignSelf: 'center', marginTop: 25 }}>
            <Text style={{ color: 'purple', marginLeft: 10 }}>Name</Text>
            <View style={styles(theme).section}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles(theme).text}>
                        {user.name + ''} {user.surname}
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: 'purple', marginLeft: 10 }}>Security</Text>
                <TouchableOpacity onPress={() => updateEmailHelper()}>
                    <View style={styles(theme).section}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommIcon name="email-edit-outline" size={iconSize} color={'grey'} />
                            <Text style={[styles(theme).text, { marginLeft: 10 }]}>Update Email</Text>
                        </View>
                        <AntDesign name="right" size={iconSize * 0.75} color={'grey'} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => resetPasswordHelper()}>
                    <View style={styles(theme).section}>
                        <View style={{ flexDirection: 'row' }}>
                            <MaterialCommIcon name="lock-outline" size={iconSize} color={'grey'} />
                            <Text style={[styles(theme).text, { marginLeft: 10 }]}>Reset Password</Text>
                        </View>
                        <AntDesign name="right" size={iconSize * 0.75} color={'grey'} />
                    </View>
                </TouchableOpacity>

                <View style={styles(theme).section}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image
                            source={require('./face-recognition.png')}
                            style={{ width: iconSize, height: iconSize }}
                        />
                        <Text style={[styles(theme).text, { marginLeft: 10 }]}>Authenticate with FaceID</Text>
                    </View>
                    <Switch
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                        trackColor={{ false: '#767577', true: '#FFCFFF' }}
                        thumbColor={faceIdActivated ? '#a103fc' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => toggleFaceIdActivated(!faceIdActivated)}
                        value={faceIdActivated}
                    />
                </View>

                <Text style={{ color: 'purple', marginLeft: 10 }}>Theme</Text>
                <View style={styles(theme).section}>
                    <Text style={styles(theme).text}>Dark Mode</Text>
                    <Switch
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                        trackColor={{ false: 'red', true: '#FFCFFF' }}
                        thumbColor={mode ? '#a103fc' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setModeAndAppendToStorage}
                        value={mode === 'dark'}
                    />
                </View>
            </View>
            <TouchableNativeFeedback onPress={() => dispatch(signUserOut({ navigation }))}>
                <Text style={[styles(theme).text, { color: 'red', textAlign: 'center', marginBottom: 50 }]}>
                    Sign out
                </Text>
            </TouchableNativeFeedback>
        </View>
    )
}
