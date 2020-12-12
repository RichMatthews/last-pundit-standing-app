import React from 'react'
import styled from 'styled-components'
import { Platform, Text, TouchableOpacity, TouchableNativeFeedback, View } from 'react-native'
import AntIcon from 'react-native-vector-icons/AntDesign'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch, useSelector } from 'react-redux'
import { canLoginWithFaceIdAndUpdateKeyChain } from 'src/utils/canLoginWithFaceId'

import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'
import { signUserOut } from 'src/redux/reducer/leagues'

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

export const Account = ({ navigation }: any) => {
    const user = useSelector((store: { user: any }) => store.user)
    const dispatch = useDispatch()

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
                    height: Platform.OS === 'ios' ? 300 : 200,
                    paddingTop: Platform.OS === 'ios' ? 150 : 100,
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
                        <MaterialCommIcon
                            name="email-edit-outline"
                            size={Platform.OS === 'ios' ? 30 : 20}
                            style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: Platform.OS === 'ios' ? 20 : 15, marginBottom: 5 }}>Update Email</Text>
                    </Section>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changePasswordHelper()}>
                    <Section>
                        <MaterialCommIcon
                            name="lock-outline"
                            size={Platform.OS === 'ios' ? 30 : 20}
                            style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: Platform.OS === 'ios' ? 20 : 15, marginBottom: 5 }}>
                            Change Password
                        </Text>
                    </Section>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => await canLoginWithFaceIdAndUpdateKeyChain()}>
                    <Section>
                        <MaterialCommIcon
                            name="lock-outline"
                            size={Platform.OS === 'ios' ? 30 : 20}
                            style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: Platform.OS === 'ios' ? 20 : 15, marginBottom: 5 }}>
                            Authenticate with FaceID
                        </Text>
                    </Section>
                </TouchableOpacity>
                <TouchableNativeFeedback onPress={() => dispatch(signUserOut({ navigation }))}>
                    <Section
                        style={{
                            // borderBottomWidth: 0,
                            position: 'absolute',
                            bottom: Platform.OS === 'ios' ? 450 : -150,
                            display: 'flex',
                            alignSelf: 'center',
                            zIndex: 1,
                        }}
                    >
                        <MaterialIcon
                            name="exit-to-app"
                            size={Platform.OS === 'ios' ? 30 : 20}
                            style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: Platform.OS === 'ios' ? 20 : 15, marginBottom: 5 }}>Sign out</Text>
                    </Section>
                </TouchableNativeFeedback>
            </Container>
        </View>
    )
}
