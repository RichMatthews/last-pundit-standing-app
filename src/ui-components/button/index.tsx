import React from 'react'
import styled from 'styled-components'
import LinearGradient from 'react-native-linear-gradient'

const APP_BRAND_COLOR = '#289960'
const APP_BACKGROUND_COLOR = '#F2F1F7'

// background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};

export const ButtonText = styled.Text`
    color: #fff;
    font-size: 17;
    font-weight: bold;
    text-align: center;
`

export const Button = ({ children, disabled }) => (
    <LinearGradient
        colors={disabled ? ['#ccc', '#ccc'] : ['#3eb94e', '#3eb9b4']}
        style={{ borderRadius: 10, padding: 12 }}
    >
        {children}
    </LinearGradient>
)
