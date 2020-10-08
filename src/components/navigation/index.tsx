import React, { useState } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { Link } from 'react-router-native'
import styled from 'styled-components'

import { signUserOutOfApplication } from '../../firebase-helpers'

const Container = styled.View`
    align-items: center;
    color: #289960;
    display: flex;
    height: 20px;
    justify-content: space-between;
    margin-top: 100px;
    padding: 15px;
`

const StyledLink = styled(Link)`
    color: #289960;
    text-decoration: none;
    color: #2f2f2f;
    padding: 20px;
`

const StyledSignOut = styled.View`
    color: #289960;
    text-decoration: none;
    padding: 20px;
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
    display: flex;
    flex-direction: column;
`
const HiddenInitially = styled.View`
    background: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
    right: 5px;
    top: 50px;
    width: 150px;
    z-index: 1;
`

const StyledLastPunditStandingLink = styled(StyledLink)`
    border: none;
    color: #289960;
    padding: 0;
`

const Menu = styled.Text`
    color: #000;
    margin-top: 100px;
`
export const Navigation = ({ currentUserId }: any) => {
    const [showDropdown, setShowDropdown] = useState(true)

    return (
        <Container>
            {/* <StyledLastPunditStandingLink to={'/'}>Last Pundit Standing</StyledLastPunditStandingLink> */}
            <MobileRightHandSideSection>
                {showDropdown && (
                    <HiddenInitially>
                        <StyledLink to={'/leagues'} onClick={() => setShowDropdown(false)}>
                            <Text>My Leagues</Text>
                        </StyledLink>
                        <StyledLink to={'/create'} onClick={() => setShowDropdown(false)}>
                            <Text>Create League</Text>
                        </StyledLink>
                        <StyledLink to={'/join'} onClick={() => setShowDropdown(false)}>
                            <Text>Join League</Text>
                        </StyledLink>
                        {currentUserId ? (
                            <>
                                <StyledSignOut onClick={() => signUserOutOfApplication()}>
                                    <Text>Sign Out</Text>
                                </StyledSignOut>
                            </>
                        ) : null}
                    </HiddenInitially>
                )}
                <TouchableHighlight onPress={() => setShowDropdown(!showDropdown)}>
                    <View>
                        <Menu>Menu</Menu>
                    </View>
                </TouchableHighlight>
            </MobileRightHandSideSection>
        </Container>
    )
}
