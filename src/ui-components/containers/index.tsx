import { Dimensions } from 'react-native'
import styled from 'styled-components'

var height = Dimensions.get('window').height
var width = Dimensions.get('window').width

export const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: ${height}px;
    padding: 20px;
    margin-top: 50px;
    width: ${width}px;
`
