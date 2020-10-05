import { View } from 'react-native'
import styled from 'styled-components'

export const Button = styled.View<any>`
    background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};
    border-radius: 3px;
    color: #fff;
    padding: 10px;
    text-align: center;
`
