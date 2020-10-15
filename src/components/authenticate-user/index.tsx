import React, { useEffect, useState } from 'react'
import { TextInput, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import { useRoute } from '@react-navigation/native'

import { Button, ButtonText } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'
import { H1 } from '../../ui-components/headings'

import { logUserInToApplication, signUserUpToApplication } from '../../firebase-helpers'
import { firebaseApp } from '../../config.js'

const Input = styled.TextInput`
    font-size: 15px;
    padding: 10px;
    width: 100%;
`

const SectionDivider = styled.View`
    margin: 15px 0 0 0;
`

const Error = styled.View`
    background: #eb3455;
    border-radius: 3px;
    color: #fff;
    margin-top: 5px;
    padding: 5px;
`

const StyledLink = styled.View`
    background: #289960;
    color: #fff;
    border-radius: 3px;
    padding: 10px;
    margin: 15px 0 0 0;
    text-align: center;
    text-decoration: none;
`

export const AuthenticateUserScreen = ({ navigation, setUserExists }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        console.log('called dis')
        firebaseApp.auth().onAuthStateChanged((user) => {
            console.log('user?', user)
            if (user) {
                setUserExists(true)
            }
        })
    }, [])

    const logUserIn = () => {
        console.log('called log')
        logUserInToApplication({ email, password, navigation, setError, setUserExists })
    }

    const signUserUp = () => {
        signUserUpToApplication(email, password, name, setError, surname)
    }

    const setEmailHelper = (e: any) => {
        console.log(e.nativeEvent.text, 'e?')
        setError(null)
        setEmail(e.nativeEvent.text)
    }

    const setPasswordHelper = (e: any) => {
        setError(null)
        setPassword(e.nativeEvent.text)
    }

    const isSignUpPage = useRoute().name.includes('Sign Up')

    return (
        <Container>
            <H1>{isSignUpPage ? 'Sign Up' : 'Log in'}</H1>
            <Inner>
                <View>
                    <Text>Last Punding Standing requires you to be logged in</Text>
                    {error ? (
                        <Error>
                            <Text>{error}</Text>
                        </Error>
                    ) : null}
                </View>
                {isSignUpPage && (
                    <>
                        <SectionDivider>
                            <Input placeholder="name" onChange={(e: any) => setName(e.target.value)} />
                        </SectionDivider>
                        <SectionDivider>
                            <Input placeholder="surname" onChange={(e: any) => setSurname(e.target.value)} />
                        </SectionDivider>
                    </>
                )}
                <SectionDivider>
                    <Input placeholder="email" onChange={(e: any) => setEmailHelper(e)} />
                </SectionDivider>
                <SectionDivider>
                    <Input
                        placeholder="password"
                        secureTextEntry={true}
                        onChange={(e: any) => setPasswordHelper(e)}
                        required
                    />
                </SectionDivider>
                <SectionDivider>
                    <TouchableOpacity onPress={isSignUpPage ? signUserUp : logUserIn}>
                        <Button>
                            {isSignUpPage ? <ButtonText>Sign Up</ButtonText> : <ButtonText>Login</ButtonText>}
                        </Button>
                    </TouchableOpacity>
                </SectionDivider>
                {!isSignUpPage && (
                    <>
                        <SectionDivider>
                            <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Text>or</Text>
                            </View>
                        </SectionDivider>
                        <TouchableOpacity onPress={!isSignUpPage ? () => navigation.navigate('Sign Up') : logUserIn}>
                            <StyledLink>
                                {!isSignUpPage ? <ButtonText>Sign up now</ButtonText> : <ButtonText>Login</ButtonText>}
                            </StyledLink>
                        </TouchableOpacity>
                    </>
                )}
            </Inner>
        </Container>
    )
}
