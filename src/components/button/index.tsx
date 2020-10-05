import styled from 'styled-components'

export const Button = styled.div<any>`
    background: ${({ disabled }) => (disabled ? 'grey' : '#289960')};
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
    padding: 10px;
    text-align: center;
`
