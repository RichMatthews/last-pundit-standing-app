import React from 'react'
import { Dimensions, View } from 'react-native'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export const Container = ({ children, stylesOverride }) => <View style={[styles, stylesOverride]}>{children}</View>

const styles = { alignItems: 'center', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', height, width }
