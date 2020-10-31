import { Dimensions } from 'react-native'
import styled from 'styled-components'

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export const Container = styled.View`
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    height: ${height}px;
    width: ${width}px;
`
