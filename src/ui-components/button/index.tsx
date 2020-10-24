import React from 'react'
import styled from 'styled-components'
import LinearGradient from 'react-native-linear-gradient'
import { View } from 'react-native'

const APP_BRAND_COLOR = '#289960'
const APP_BACKGROUND_COLOR = '#F2F1F7'

// background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};

export const ButtonText = styled.Text`
    color: #fff;
    font-size: 20;
    text-align: center;
`

export const Button = ({
    bottom,
    children,
    disabled,
    height,
    marginTop,
    padding = 10,
    position = 'relative',
    right,
    width,
}) => (
    <View
        style={{
            backgroundColor: disabled ? '#ccc' : '#827ee6',
            borderRadius: 5,
            bottom,
            height,
            marginTop,
            right,
            padding,
            position,
            width,
        }}
    >
        {children}
    </View>
)
