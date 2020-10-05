import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { Button } from '../button'

import { logUserInToApplication, signUserUpToApplication } from '../../firebase-helpers'

const Container = styled.div`
    display: flex;
    justify-content: center;
`

const Inner = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
`

const Input = styled.input`
    box-sizing: border-box;
    font-size: 15px;
    padding: 10px;
    width: 100%;
`

const SectionDivider = styled.div`
    margin: 15px 0 0 0;
`

const Error = styled.div`
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
    cursor: pointer;
    padding: 10px;
    margin: 15px 0 0 0;
    text-align: center;
    text-decoration: none;
`

export const AuthenticateUserScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [error, setError] = useState<any>(null)

    const logUserIn = () => {
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

    const isSignUpPage = window.location.pathname.includes('sign-up')

    return (
        <Container>
            <Inner>
                <SectionDivider>
                    <div>Last Punding Standing requires you to be logged in</div>
                    {error ? <Error>{error}</Error> : null}
                </SectionDivider>
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
                    <Button onClick={isSignUpPage ? signUserUp : logUserIn}>
                        {isSignUpPage ? 'Sign Up' : 'Login'}
                    </Button>
                </SectionDivider>
                {!isSignUpPage && (
                    <>
                        <SectionDivider>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>or</div>
                        </SectionDivider>
                        <StyledLink to={'/sign-up'}> {!isSignUpPage ? 'Sign up now' : 'Login'} </StyledLink>
                    </>
                )}
            </Inner>
        </Container>
    )
}
