import React, { useEffect, useState } from 'react'
import { Platform, Text, TouchableOpacity, TouchableNativeFeedback, Switch, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { Container } from 'src/ui-components/containers'
import { H1 } from 'src/ui-components/headings'
import { signUserOut } from 'src/redux/reducer/leagues'
import { setTheme } from 'src/redux/reducer/theme'

import { styles } from './styles'
const iconSize = Platform.OS === 'ios' ? 20 : 20

export const Account = ({ navigation, theme }: any) => {
    const [faceIdActivated, setFaceIdActivated] = useState(false)
    const [darkModeActivated, setDarkModeActivated] = useState(false)
    const mode = useSelector((store: { theme: any }) => store.theme)
    const user = useSelector((store: { user: any }) => store.user)
    const dispatch = useDispatch()

    useEffect(() => {
        getFaceIdStatus()
    }, [])

    const getFaceIdStatus = async () => {
        const x = await AsyncStorage.getItem('faceIdStatus')

        if (x === 'active') {
            setFaceIdActivated(true)
        } else {
            setFaceIdActivated(false)
        }
    }

    const toggleFaceIdActivated = async (activated: boolean) => {
        if (activated) {
            await AsyncStorage.setItem('faceIdStatus', 'active')
            setFaceIdActivated(true)
        } else {
            await AsyncStorage.setItem('faceIdStatus', '')
            setFaceIdActivated(false)
        }
    }

    const closeModalHelper = () => {
        navigation.goBack()
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
        <View style={{ backgroundColor: theme.background.primary }}>
            <LinearGradient
                colors={['#a103fc', '#5055b3']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles(theme).topSection}
            >
                <View>
                    <Text style={styles(theme).username}>
                        {user.name.split('')[0]}
                        {user.surname.split('')[0]}
                    </Text>
                </View>
                <TouchableOpacity onPressIn={() => closeModalHelper()}>
                    <AntIcon
                        name="close"
                        color={theme.text.inverse}
                        size={30}
                        style={{ position: 'absolute', right: 30, top: -150 }}
                    />
                </TouchableOpacity>
            </LinearGradient>
            <H1 style={styles(theme).heading}> Your Account </H1>
            <Container>
                <TouchableOpacity onPress={() => updateEmailHelper()}>
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).text}>Update Email</Text>
                        <MaterialCommIcon name="email-edit-outline" size={iconSize} color={theme.icons.primary} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => resetPasswordHelper()}>
                    <View style={styles(theme).section}>
                        <Text style={styles(theme).text}>Reset Password</Text>
                        <MaterialCommIcon name="lock-outline" size={iconSize} color={theme.icons.primary} />
                    </View>
                </TouchableOpacity>

                <View style={styles(theme).section}>
                    <Text style={styles(theme).text}>Authenticate with FaceID</Text>
                    <Switch
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                        trackColor={{ false: '#767577', true: '#FFCFFF' }}
                        thumbColor={faceIdActivated ? '#a103fc' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => toggleFaceIdActivated(!faceIdActivated)}
                        value={faceIdActivated}
                    />
                </View>

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
                <TouchableNativeFeedback onPress={() => dispatch(signUserOut({ navigation }))}>
                    <View style={[styles(theme).section, styles(theme).signOut]}>
                        <Text style={styles(theme).text}>Sign out</Text>
                        <MaterialIcon name="exit-to-app" size={iconSize} color={theme.icons.primary} />
                    </View>
                </TouchableNativeFeedback>
            </Container>
        </View>
    )
}
