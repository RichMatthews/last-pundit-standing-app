import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import { useRoute } from '@react-navigation/native'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialCommIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Button } from '../../ui-components/button'
import { Container } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

import { logUserInToApplication, signUserUpToApplication } from '../../firebase-helpers'
import { firebaseApp } from '../../config.js'

const Input = styled.TextInput`
    font-size: 17px;
    margin: 10px;
    width: 80%;
`

const SectionDivider = styled.View`
    border-bottom-width: 1px;
    border-color: #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px;
    margin-top: 20px;
    margin-bottom: 0;
`

const Error = styled.View`
    background: #eb3455;
    border-radius: 5px;
    margin-bottom: 10px;
    padding: 10px;
`

const StyledLogInSection = styled.View`
    border-color: #ccc;
    border-width: 1px;
`

// box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.24);
export const AuthenticateUserScreen = ({ navigation, setUserExists }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserExists(true)
            }
        })
    }, [])

    const setEmailHelper = (e: any) => {
        setError(null)
        setEmail(e.nativeEvent.text)
    }

    const setPasswordHelper = (e: any) => {
        setError(null)
        setPassword(e.nativeEvent.text)
    }

    const isSignUpPage = useRoute().name.includes('Sign Up')

    return isSignUpPage ? (
        <SignUpScreen
            email={email}
            navigation={navigation}
            password={password}
            setEmailHelper={setEmailHelper}
            setPasswordHelper={setPasswordHelper}
            name={name}
            setName={setName}
            surname={surname}
            setSurname={setSurname}
        />
    ) : (
        <LoginScreen
            email={email}
            error={error}
            navigation={navigation}
            password={password}
            setEmailHelper={setEmailHelper}
            setPasswordHelper={setPasswordHelper}
            setError={setError}
            setUserExists={setUserExists}
        />
    )
}

const LoginScreen = ({
    email,
    error,
    navigation,
    password,
    setEmailHelper,
    setError,
    setPasswordHelper,
    setUserExists,
}) => {
    const logUserIn = () => {
        logUserInToApplication({ email, password, navigation, setError, setUserExists })
    }

    return (
        <Container>
            <H1>Login</H1>

            <View>
                {error ? (
                    <Error>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{error}</Text>
                    </Error>
                ) : null}
            </View>
            <StyledLogInSection
                style={{
                    backgroundColor: '#F2F1F7',
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                <SectionDivider>
                    <MaterialIcons
                        name={'email-outline'}
                        size={20}
                        color={'#000'}
                        style={{ textAlign: 'center', alignSelf: 'center' }}
                    />
                    <Input
                        autoCapitalize="none"
                        placeholder="email"
                        placeholderTextColor="#666464"
                        onChange={(e: any) => setEmailHelper(e)}
                    />
                </SectionDivider>
                <SectionDivider style={{ marginBottom: 70 }}>
                    <MaterialCommIcon name="lock-outline" size={20} />
                    <Input
                        placeholder="password"
                        placeholderTextColor="#666464"
                        secureTextEntry={true}
                        onChange={(e: any) => setPasswordHelper(e)}
                        required
                    />
                </SectionDivider>
                <View>
                    <TouchableOpacity onPress={logUserIn}>
                        <Button bottom={-20} height={40} right={90} padding={0} position={'absolute'} width={100}>
                            <FontAwesomeIcons
                                name={'long-arrow-right'}
                                size={40}
                                color={'#fff'}
                                style={{ textAlign: 'center', alignSelf: 'center' }}
                            />
                        </Button>
                    </TouchableOpacity>
                </View>
            </StyledLogInSection>
        </Container>
    )
}

const SignUpScreen = ({
    email,
    error,
    navigation,
    password,
    name,
    setEmailHelper,
    setError,
    setName,
    setSurname,
    surname,
    setPasswordHelper,
}) => {
    const signUserUp = () => {
        signUserUpToApplication(email, password, name, setError, surname)
    }

    return (
        <Container>
            <H1>Login</H1>
            <View>
                {error ? (
                    <Error>
                        <Text style={{ color: '#fff' }}>{error}</Text>
                    </Error>
                ) : null}
            </View>
            <>
                <SectionDivider>
                    <Input placeholder="name" onChange={(e: any) => setName(e.target.value)} />
                </SectionDivider>
                <SectionDivider>
                    <Input
                        placeholder="surname"
                        placeholderTextColor="#666464"
                        onChange={(e: any) => setSurname(e.target.value)}
                    />
                </SectionDivider>
            </>
            <StyledLogInSection
                style={{
                    backgroundColor: '#F2F1F7',
                    borderRadius: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.2,
                    shadowRadius: 10,
                    elevation: 5,
                }}
            >
                <SectionDivider
                    style={{
                        borderBottomWidth: 1,
                        borderColor: '#ccc',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 10,
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                >
                    <MaterialIcons
                        name={'email-outline'}
                        size={20}
                        color={'#000'}
                        style={{ textAlign: 'center', alignSelf: 'center' }}
                    />
                    <Input
                        placeholder="email"
                        placeholderTextColor="#666464"
                        onChange={(e: any) => setEmailHelper(e)}
                    />
                </SectionDivider>
                <SectionDivider style={{ marginBottom: 40 }}>
                    <Input
                        placeholder="password"
                        placeholderTextColor="#666464"
                        secureTextEntry={true}
                        onChange={(e: any) => setPasswordHelper(e)}
                        required
                    />
                </SectionDivider>
                <SectionDivider>
                    <TouchableOpacity onPress={signUserUp}>
                        <Button position={'absolute'} width={100}>
                            <FontAwesomeIcons
                                name={'long-arrow-right'}
                                size={40}
                                color={'#fff'}
                                style={{ textAlign: 'center', alignSelf: 'center' }}
                            />
                        </Button>
                    </TouchableOpacity>
                </SectionDivider>
            </StyledLogInSection>
        </Container>
    )
}
