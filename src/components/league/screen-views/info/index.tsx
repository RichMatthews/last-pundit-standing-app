import React from 'react'
import styled from 'styled-components'
import { Image, Share, Text, TouchableOpacity, View } from 'react-native'

import { Fixtures } from '../../../fixtures'
import { LeagueRules } from '../../league-rules'

const SelectionWrapper = styled.View`
    background: transparent;
    display: flex;
    flex-direction: column;
    align-self: center;
    margin: 10px;
    width: 90%;
`

// const sharePin = () => {
//     const shareOptions = {
//         title: 'Share league pin with friends',
//         message: `Hi, I'm inviting you to join my Last Pundit Standing league. here is the league code: ${league.joinPin}`,
//         url: 'www.example.com',
//         subject: 'Subject',
//     }
//     Share.share(shareOptions)
// }

export const LeagueInfo = () => {
    return (
        <View>
            <SelectionWrapper>
                <Fixtures />
            </SelectionWrapper>
            <SelectionWrapper>
                <LeagueRules />
            </SelectionWrapper>
            <SelectionWrapper></SelectionWrapper>
        </View>
    )
}
