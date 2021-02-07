import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

export const ScreenComponent = ({ children, theme }: any) => {
    console.log(theme.dark)
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            {children}
        </SafeAreaView>
    )
}
