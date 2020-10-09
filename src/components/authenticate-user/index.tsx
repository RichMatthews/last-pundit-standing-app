import React, { useState } from 'react'
import { TextInput, Text, TouchableOpacity, View } from 'react-native'
import { Link } from 'react-router-native'
import styled from 'styled-components'
import { useRoute } from '@react-navigation/native'

import { Button, ButtonText } from '../../ui-components/button'
import { Container, Inner } from '../../ui-components/containers'
import { H2 } from '../../ui-components/headings'

import { logUserInToApplication, signUserUpToApplication } from '../../firebase-helpers'

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

const StyledLink = styled(Link)`
    background: #289960;
    color: #fff;
    border-radius: 3px;
    padding: 10px;
    margin: 15px 0 0 0;
    text-align: center;
    text-decoration: none;
`

export const AuthenticateUserScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState<any>(null)

    const logUserIn = () => {
        console.log('called log')
        logUserInToApplication(email, password, setError)
    }

    const signUserUp = () => {
        signUserUpToApplication(email, password, name, setError, surname)
    }

    const setEmailHelper = (e: any) => {
        setError(null)
        setEmail(e.target.value)
    }

    const setPasswordHelper = (e: any) => {
        setError(null)
        setPassword(e.target.value)
    }

    const isSignUpPage = useRoute().name.includes('Sign Up')

    return (
        <Container>
            <H2>Sign Up</H2>
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
                        type="password"
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
                        <StyledLink to={'/sign-up'}>
                            {!isSignUpPage ? <ButtonText>Sign up now</ButtonText> : <ButtonText>Login</ButtonText>}
                        </StyledLink>
                    </>
                )}
            </Inner>
        </Container>
    )
}
