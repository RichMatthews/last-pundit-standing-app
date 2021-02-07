import React from 'react'
import { Dimensions, Platform, Text, View, StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { Toggle } from '../toggle'

type RowProps = {
    text: string
    theme: string
    icon?: React.ReactNode
    togglePress?: () => void
    toggleValue?: boolean
    rightArrow?: boolean
}

const isIos = Platform.OS === 'ios'
const iconSize = isIos ? 20 : 20
const width = Dimensions.get('window').width

export const SettingsRow = ({ text, theme, icon, togglePress, toggleValue, rightArrow }: RowProps) => {
    const renderRightOption = () => {
        if (togglePress) {
            return <Toggle onValueChange={togglePress} value={toggleValue} />
        } else if (rightArrow) {
            return <AntDesign name="right" size={iconSize * 0.75} color={'grey'} />
        }
    }

    return (
        <View style={styles(theme).sectionRow}>
            <View style={styles(theme).rowText}>
                {icon && icon}
                <Text style={styles(theme).text}>{text}</Text>
            </View>
            {renderRightOption()}
        </View>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        sectionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            width: width * 0.9,
        },
        rowText: {
            flexDirection: 'row',
        },
        text: {
            color: theme.text.primary,
            fontSize: isIos ? 18 : 15,
        },
    })
