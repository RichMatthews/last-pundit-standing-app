import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import LinearGradient from 'react-native-linear-gradient'

import { ContainerWithHeaderShown, InnerWithHeaderShown } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'
import { signUserOutOfApplication } from '../../firebase-helpers'

export const Account = ({ navigation, setUserExists }) => {
    const closeModalHelper = () => {
        navigation.goBack()
    }

    const changePasswordHelper = () => {
        navigation.navigate('Home', { screen: 'Reset Password', resetPassword: true })
    }

    const updateEmailHelper = () => {
        navigation.navigate('Home', { screen: 'Update Email', resetPassword: false, updateEmail: true })
    }

    return (
        <View>
            <LinearGradient
                colors={['#3eb94e', '#3eb9b4']}
                style={{
                    borderRadius: 10,
                    backgroundColor: '#B972FE',
                    borderBottomRightRadius: 250,
                    height: 300,
                    paddingTop: 150,
                }}
            >
                <Text style={{ fontSize: 20, textAlign: 'center' }}>Rich Matthews</Text>
                <TouchableOpacity onPress={() => closeModalHelper()}>
                    <AntIcon
                        name="close"
                        color="#fff"
                        size={30}
                        style={{ position: 'absolute', right: 30, top: -100 }}
                    />
                </TouchableOpacity>
            </LinearGradient>

            <ContainerWithHeaderShown>
                <InnerWithHeaderShown>
                    <H1 style={{ marginBottom: 40, textAlign: 'center' }}> Your Account </H1>
                    <TouchableOpacity onPress={() => updateEmailHelper()}>
                        <View
                            style={{
                                borderBottomColor: '#ccc',
                                borderBottomWidth: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}
                        >
                            <MaterialCommIcon name="email-edit-outline" size={30} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 20, marginBottom: 5 }}>Update Email</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => changePasswordHelper()}>
                        <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 100 }}>
                            <Text style={{ fontSize: 20, marginBottom: 5 }}>Change Password</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => signUserOutOfApplication({ navigation, setUserExists })}>
                        <View
                            style={{
                                borderBottomColor: '#ccc',
                                borderBottomWidth: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <MaterialIcon name="exit-to-app" size={30} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 20, marginBottom: 5 }}>Sign out</Text>
                        </View>
                    </TouchableOpacity>
                </InnerWithHeaderShown>
            </ContainerWithHeaderShown>
        </View>
    )
}
