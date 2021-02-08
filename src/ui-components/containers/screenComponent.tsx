import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'react-native'

export const ScreenComponent = ({ children, theme }: any) => {
    return (
        <SafeAreaView style={styles(theme).container}>
            <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
            {children}
        </SafeAreaView>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background.primary },
    })
