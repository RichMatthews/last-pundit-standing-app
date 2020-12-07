import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import { useExpander } from 'src/custom-hooks/expander'
import { H2 } from '../../../ui-components/headings'

const Container = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

const Inner = styled.View`
    display: ${({ expand }) => (expand ? 'flex' : 'none')};
    margin-top: 20px;
    justify-content: center;
    width: 300px;
`

const ExpandImage = styled.Image<any>`
    align-self: center;
    height: 15px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};
    width: 15px;
`

export const LeagueRules = () => {
    const [showRules, setShowRules] = useState(false)

    return (
        <TouchableOpacity onPress={() => setShowRules(!showRules)} activeOpacity={1}>
            <View
                style={{
                    backgroundColor: '#fff',
                    padding: 15,
                    shadowOpacity: 1,
                    shadowRadius: 3.5,
                    shadowColor: '#ccc',
                    shadowOffset: { height: 2, width: 0 },
                }}
            >
                <Container>
                    <H2>League Rules</H2>
                    <ExpandImage expand={showRules} source={require('src/images/other/down-arrow.png')} />
                </Container>
                <View>
                    <Inner expand={showRules}>
                        <Text>Pick a different team every week</Text>
                        <Text>Home team must win</Text>
                        <Text>Away team must win or draw</Text>
                        <Text>Last Pundit Standing wins jackpot</Text>
                        <Text>Money rolls over if no winner</Text>
                    </Inner>
                </View>
            </View>
        </TouchableOpacity>
    )
}
