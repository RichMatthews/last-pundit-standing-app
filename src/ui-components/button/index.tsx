import React from 'react'
import styled from 'styled-components'

const APP_BRAND_COLOR = '#289960'
const APP_BACKGROUND_COLOR = '#F2F1F7'

const StyledButton = styled.View<any>`
    background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};
    border-radius: 3px;
    padding: 10px;
`

export const ButtonText = styled.Text`
    color: #fff;
    text-align: center;
`

export const Button = ({ children, disabled }) => <StyledButton disabled={disabled}>{children}</StyledButton>
