import styled from 'styled-components'

export const Container = styled.View`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 100px;
`

export const ContainerWithHeaderShown = styled(Container)`
    margin-top: 20px;
`

export const Inner = styled.View`
    margin-top: 50px;
    width: 300px;
`

export const InnerWithHeaderShown = styled(Inner)`
    margin-top: 20px;
    width: 370px;
`
