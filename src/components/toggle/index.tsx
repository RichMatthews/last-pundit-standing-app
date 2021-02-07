import React from 'react'
import { Switch, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

type ToggleProps = {
    value: boolean
    onValueChange: () => void
}

export const Toggle = ({ value, onValueChange }: ToggleProps) => {
    const mode = useSelector((store: { theme: any }) => store.theme)

    return (
        <Switch
            style={styles.switch}
            trackColor={{ false: '#767577', true: mode === 'dark' ? '#767577' : '#FFCFFF' }}
            thumbColor={value ? '#a103fc' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => onValueChange()}
            value={value}
        />
    )
}

const styles = StyleSheet.create({
    switch: {
        transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }],
    },
})
