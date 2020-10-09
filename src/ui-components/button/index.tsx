import React from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components'

const APP_BRAND_COLOR = '#289960'

const StyledButton = styled.View<any>`
    background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};
    border-radius: 3px;
    padding: 10px;
`

export const ButtonText = styled.Text`
    color: #fff;
    text-align: center;
`

export const Button = ({ children }) => <StyledButton>{children}</StyledButton>
