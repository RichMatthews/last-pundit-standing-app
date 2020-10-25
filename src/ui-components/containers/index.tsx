import { Dimensions } from 'react-native'
import styled from 'styled-components'

var width = Dimensions.get('window').width //full width

export const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px;
    margin-top: 50px;
    width: ${width}px;
`
