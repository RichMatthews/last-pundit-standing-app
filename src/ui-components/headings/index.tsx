import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components'

import { SvgBackground } from 'src/components/svg-background'

export const H1 = styled.Text`
    color: #2f2f2f;
    font-size: 30px;
    font-weight: 700;
`

export const H2 = styled.Text`
    color: #191f30;
    display: flex;
    font-weight: 700;
    margin: 0;
    font-size: 20px;
`

export const ScreenHeading = ({ title }) => (
    <>
        <View style={{ position: 'absolute', top: -410, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
            <SvgBackground />
        </View>

        <H1
            style={{
                color: '#fff',
                padding: 20,
                position: 'absolute',
                alignSelf: 'center',
                top: 150,
                zIndex: 1,
            }}
        >
            {title}
        </H1>
    </>
)
