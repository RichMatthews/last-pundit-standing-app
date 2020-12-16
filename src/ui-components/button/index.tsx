import React from 'react'
import styled from 'styled-components'
import { View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

const APP_BRAND_COLOR = '#827ee6'
const APP_BACKGROUND_COLOR = '#F2F1F7'

// background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};

export const ButtonText = styled.Text`
    align-items: center;
    color: #fff;
    display: flex;
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    align-self: center;
`

export const InvertedButtonText = styled(ButtonText)`
    color: #827ee6;
`

export const Button = ({ children, disabled }) => (
    <LinearGradient colors={['#a103fc', '#5055b3']} start={[0, 1]} end={[1, 0]} style={{ borderRadius: 5 }}>
        <View
            style={{
                alignSelf: 'center',
                padding: 10,
                width: 400,
            }}
        >
            {children}
        </View>
    </LinearGradient>
)

export const InvertedButton = ({ children, disabled }) => (
    <View
        style={{
            backgroundColor: disabled ? '#ccc' : '#fff',
            borderColor: '#827ee6',
            borderWidth: 1,
            borderRadius: 5,
            justifyContent: 'center',
            padding: 10,
            width: 300,
            zIndex: 100,
        }}
    >
        {children}
    </View>
)
