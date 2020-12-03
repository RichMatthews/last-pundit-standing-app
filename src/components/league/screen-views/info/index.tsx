import React from 'react'
import styled from 'styled-components'
import { Image, Share, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'

import { Fixtures } from '../../../fixtures'
import { LeagueRules } from '../../league-rules'

const TextContainer = styled.View`
    margin: 10px;
    text-align: center;
`

const SelectionWrapper = styled.View`
    background: transparent;
    border-bottom-width: 2px;
    border-bottom-color: #ccc;
    display: flex;
    flex-direction: column;
    align-self: center;
    padding: 5px;
    margin: 15px;
    width: 90%;
`

const sharePin = () => {
    const shareOptions = {
        title: 'Share league pin with friends',
        message: `Hi, I'm inviting you to join my Last Pundit Standing league. here is the league code: ${league.joinPin}`,
        url: 'www.example.com',
        subject: 'Subject',
    }
    Share.share(shareOptions)
}

export const LeagueInfo = () => {
    const league = useSelector((store: { league: any }) => store.league)
    return (
        <View>
            <SelectionWrapper>
                <Fixtures />
            </SelectionWrapper>
            <SelectionWrapper>
                <LeagueRules />
            </SelectionWrapper>
            <SelectionWrapper>
                <TextContainer>
                    <View>
                        <Text style={{ marginBottom: 20 }}>
                            Share this pin {league.joinPin} or simply click one of the apps below
                        </Text>
                        <TouchableOpacity onPress={() => sharePin()}>
                            <Image
                                source={require('../../../../images/other/whatsapp.png')}
                                style={{ width: 40, height: 40 }}
                            />
                        </TouchableOpacity>
                    </View>
                </TextContainer>
            </SelectionWrapper>
        </View>
    )
}
