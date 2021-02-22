import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export const RenderCorrectIcon = ({ focused, route, size, theme }) => {
    let iconName

    if (route.name === 'Home') {
        iconName = 'ios-home-outline'
    } else if (route.name === 'Create') {
        iconName = 'ios-create-outline'
    } else if (route.name === 'Join') {
        iconName = 'ios-add'
    } else if (route.name === 'Leagues') {
        iconName = 'ios-trophy-outline'
    } else if (route.name === 'My Account') {
        return (
            <MaterialIcons
                name={'account-circle-outline'}
                size={size}
                color={focused ? theme.tint.active : theme.tint.inactive}
            />
        )
    }

    return <Ionicons name={iconName} size={size} color={focused ? theme.tint.active : theme.tint.inactive} />
}
