import React from 'react'
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg'

export const SvgBackground = () => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 50 50">
            <Defs>
                <LinearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#42ceed" stopOpacity="1" />
                    <Stop offset="20%" stopColor="#2de39d" stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Path fill="url(#gradient)" d="M0 32l1440 256V0H0z" />
        </Svg>
    )
}
