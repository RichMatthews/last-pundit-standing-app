import React, { useEffect, useState } from 'react'
import { Platform, Text, TouchableOpacity, TouchableNativeFeedback, StyleSheet, Switch, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { TouchableOpacity } from 'react-native-gesture-handler'

import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'
import { signUserOut } from 'src/redux/reducer/leagues'

const iconSize = Platform.OS === 'ios' ? 20 : 20

export const Account = ({ navigation }: any) => {
    const user = useSelector((store: { user: any }) => store.user)
    const [faceIdActivated, setFaceIdActivated] = useState(false)
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
        console.log(activated, 'act')
        if (activated) {
            await AsyncStorage.setItem('faceIdStatus', 'active')
            setFaceIdActivated(true)
        } else {
            await AsyncStorage.setItem('faceIdStatus', '')
            setFaceIdActivated(false)
        }
    }

    const closeModalHelper = () => {
        console.log(navigation, 'da nav')
        navigation.goBack()
    }

    const resetPasswordHelper = () => {
        navigation.navigate('Home', { screen: 'Reset Password', resetPassword: true })
    }

    const updateEmailHelper = () => {
        navigation.navigate('Home', { screen: 'Update Email', resetPassword: false, updateEmail: true })
    }

    return (
        <View>
            <LinearGradient colors={['#827ee6', '#b4b3e8']} style={styles.topSection}>
                <View>
                    <Text style={styles.username}>
                        {user.name.split('')[0]}
                        {user.surname.split('')[0]}
                    </Text>
                </View>
                <TouchableOpacity onPressIn={() => closeModalHelper()}>
                    <AntIcon
                        name="close"
                        color="#fff"
                        size={30}
                        style={{ position: 'absolute', right: 30, top: -150 }}
                    />
                </TouchableOpacity>
            </LinearGradient>
            <H1 style={styles.heading}> Your Account </H1>
            <Container>
                <TouchableOpacity onPress={() => updateEmailHelper()}>
                    <View style={styles.section}>
                        <Text style={styles.text}>Update Email</Text>
                        <MaterialCommIcon name="email-edit-outline" size={iconSize} style={{ marginRight: 10 }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => resetPasswordHelper()}>
                    <View style={styles.section}>
                        <Text style={styles.text}>Reset Password</Text>
                        <MaterialCommIcon name="lock-outline" size={iconSize} style={{ marginRight: 10 }} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => toggleFaceIdActivated(!faceIdActivated)}>
                    <View style={styles.section}>
                        <Text style={styles.text}>Authenticate with FaceID</Text>

                        <Switch
                            style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={faceIdActivated ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => toggleFaceIdActivated(!faceIdActivated)}
                            value={faceIdActivated}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableNativeFeedback onPress={() => dispatch(signUserOut({ navigation }))}>
                    <View style={[styles.section, styles.signOut]}>
                        <Text style={styles.text}>Sign out</Text>
                        <MaterialIcon name="exit-to-app" size={iconSize} style={{ marginRight: 10 }} />
                    </View>
                </TouchableNativeFeedback>
            </Container>
        </View>
    )
}

const styles = StyleSheet.create({
    heading: {
        marginTop: 50,
        marginBottom: 50,
        textAlign: 'center',
    },
    icon: {},
    section: {
        backgroundColor: '#fff',
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        maxHeight: 40,
        padding: 10,
        width: 350,
    },
    signOut: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 450 : 350,
        display: 'flex',
        alignSelf: 'center',
        zIndex: 1,
    },
    text: {
        display: 'flex',
        alignItems: 'center',
        fontSize: Platform.OS === 'ios' ? 15 : 15,
    },
    topSection: {
        backgroundColor: '#B972FE',
        borderBottomRightRadius: 250,
        height: Platform.OS === 'ios' ? 300 : 200,
        paddingTop: Platform.OS === 'ios' ? 150 : 100,
    },
    username: {
        borderColor: '#fff',
        borderWidth: 4,
        borderRadius: 85 / 2,
        alignSelf: 'center',
        lineHeight: 80,
        height: 85,
        fontSize: 40,
        textAlign: 'center',
        width: 85,
    },
})
