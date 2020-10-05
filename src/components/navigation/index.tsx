import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Link } from 'react-router-native'
import styled from 'styled-components'

import { signUserOutOfApplication } from '../../firebase-helpers'

const Container = styled.View`
    color: #289960;
    display: flex;
    justify-content: space-between;
    margin: 0;
    padding: 15px;

    @media (max-width: 900px) {
        align-items: center;
        border-bottom: 5px solid #289960;
        height: 20px;
    }
`

const StyledLink = styled(Link)`
    color: #289960;
    text-decoration: none;

    @media (max-width: 900px) {
        border-bottom: 1px solid #ccc;
        color: #2f2f2f;
        padding: 20px;
    }
`

const StyledSignOut = styled.View`
    color: #289960;
    text-decoration: none;

    @media (max-width: 900px) {
        border-bottom: 1px solid #ccc;
        color: #2f2f2f;
        padding: 20px;
    }
`

const NonMobileRightHandSideSection = styled.View<any>`
    display: flex;
    justify-content: space-between;
    width: ${({ currentUserId }: any) => (currentUserId ? '500px' : '400px')};

    @media (max-width: 900px) {
        display: none;
    }
`

const MobileRightHandSideSection = styled.View`
    display: none;
    @media (max-width: 900px) {
        display: flex;
        flex-direction: column;
    }
`
const HiddenInitially = styled.View`
    background: #ccc;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    right: 5px;
    top: 50px;
    width: 150px;
    z-index: 1;

    @media (max-width: 900px) {
        background: #fff;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`

const StyledLastPunditStandingLink = styled(StyledLink)`
    @media (max-width: 900px) {
        border: none;
        color: #289960;
        padding: 0;
    }
`

export const Navigation = ({ currentUserId }: any) => {
    const [showDropdown, setShowDropdown] = useState(false)

    return (
        <Container>
            <StyledLastPunditStandingLink to={'/'}>Last Pundit Standing</StyledLastPunditStandingLink>
            <MobileRightHandSideSection>
                {showDropdown && (
                    <HiddenInitially>
                        <StyledLink to={'/leagues'} onClick={() => setShowDropdown(false)}>
                            My Leagues
                        </StyledLink>
                        <StyledLink to={'/create'} onClick={() => setShowDropdown(false)}>
                            Create League
                        </StyledLink>
                        <StyledLink to={'/join'} onClick={() => setShowDropdown(false)}>
                            Join League
                        </StyledLink>
                        {currentUserId ? (
                            <>
                                <StyledSignOut onClick={() => signUserOutOfApplication()}>Sign Out</StyledSignOut>
                            </>
                        ) : null}
                    </HiddenInitially>
                )}
                <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
                    <View>
                        <Text>Menu</Text>
                    </View>
                </TouchableOpacity>
            </MobileRightHandSideSection>
        </Container>
    )
}
