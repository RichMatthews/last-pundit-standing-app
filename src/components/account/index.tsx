import React from 'react'
import styled from 'styled-components'
import { Text, TouchableOpacity, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'

import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'
import { signUserOutOfApplication } from '../../firebase-helpers'

const Section = styled.View`
    border-bottom-color: #ccc;
    border-bottom-width: 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    width: 350px;
`

export const Account = ({ navigation, setUserExists, user }) => {
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
                colors={['#827ee6', '#b4b3e8']}
                style={{
                    backgroundColor: '#B972FE',
                    borderBottomRightRadius: 250,
                    height: 300,
                    paddingTop: 150,
                }}
            >
                <View>
                    <Text
                        style={{
                            borderColor: '#fff',
                            borderWidth: 4,
                            borderRadius: 85 / 2,
                            alignSelf: 'center',
                            lineHeight: 80,
                            height: 85,
                            fontSize: 40,
                            textAlign: 'center',
                            width: 85,
                        }}
                    >
                        {user.name.split('')[0]}
                        {user.surname.split('')[0]}
                    </Text>
                </View>
                <TouchableOpacity onPress={() => closeModalHelper()}>
                    <AntIcon
                        name="close"
                        color="#fff"
                        size={30}
                        style={{ position: 'absolute', right: 30, top: -150 }}
                    />
                </TouchableOpacity>
            </LinearGradient>
            <H1 style={{ marginTop: 50, marginBottom: 50, textAlign: 'center' }}> Your Account </H1>
            <Container>
                <TouchableOpacity onPress={() => updateEmailHelper()}>
                    <Section>
                        <MaterialCommIcon name="email-edit-outline" size={30} style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 20, marginBottom: 5 }}>Update Email</Text>
                    </Section>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changePasswordHelper()}>
                    <Section>
                        <MaterialCommIcon name="lock-outline" size={30} style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 20, marginBottom: 5 }}>Change Password</Text>
                    </Section>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => signUserOutOfApplication({ navigation, setUserExists })}>
                    <Section
                        style={{
                            position: 'absolute',
                            bottom: -300,
                            display: 'flex',
                            // justifyContent: 'center',
                            alignSelf: 'center',
                        }}
                    >
                        <MaterialIcon name="exit-to-app" size={30} style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 20, marginBottom: 5 }}>Sign out</Text>
                    </Section>
                </TouchableOpacity>
            </Container>
        </View>
    )
}
