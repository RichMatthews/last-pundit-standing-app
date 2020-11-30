import React, { useState } from 'react'
import styled from 'styled-components'
import { Dimensions, TouchableOpacity, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'

import { PreviousRound } from '../../previous-round'
import { ShowImageForPlayerChoice } from '../show-image-for-player-choice'
import { H2 } from '../../../ui-components/headings'
import { Button, ButtonText } from '../../../ui-components/button'

const Section = styled.View`
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    width: 350px;
`

const CurrentRoundContainer = styled(Section)`
    border-bottom-width: 5px;
    border-bottom-color: #ccc;
`

const CurrentRound = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const PlayerRow = styled.View<any>`
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
    padding: 15px;
`

const Container = styled.View`
    background: transparent;
`

const ExpandImage = styled.Image<any>`
    align-self: center;
    height: 10px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};
    width: 10px;
`

// display: ${({ expand }) => (expand ? 'flex' : 'none')};
const HistoricalRounds = styled.View<any>`
    display: flex;
    margin: 15px;
`

const PlayerName = styled.Text`
    color: ${({ isCurrentLoggedInPlayer }: any) => (isCurrentLoggedInPlayer ? '#827ee6' : 'black')};
    font-size: 15px;
    font-weight: 700;
`

const SelectContainer = styled.View`
    display: flex;
    justify-content: flex-end;
`

const PlayerAndDownArrow = styled.View`
    display: flex;
    flex-direction: row;
`

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

export const CurrentRoundView = ({ currentUserId, listOfExpandedPrevious, setListOfExpandedPreviousHelper }: any) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)

    return (
        <CurrentRoundContainer>
            <Container>
                {Object.values(currentGame.players).map((player: any, index: any) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <PlayerRow key={player.id} value="Current Round">
                            <CurrentRound>
                                <PlayerName isCurrentLoggedInPlayer={player.id === currentUserId}>
                                    {player.name}
                                </PlayerName>
                                <PlayerAndDownArrow>
                                    <ShowImageForPlayerChoice
                                        currentGame={currentGame}
                                        isCurrentLoggedInPlayer={player.id === currentUserId}
                                        player={player}
                                    />

                                    <ExpandImage
                                        source={require('../../../images/other/down-arrow.png')}
                                        expand={listOfExpandedPrevious.includes(index)}
                                    />
                                </PlayerAndDownArrow>
                            </CurrentRound>
                            <Collapsible collapsed={!listOfExpandedPrevious.includes(index)} duration={500}>
                                <HistoricalRounds>
                                    {player.rounds.length > 0 ? (
                                        <>
                                            {player.rounds
                                                .filter(
                                                    (round: any) =>
                                                        round.choice.value && round.choice.result !== 'pending',
                                                )
                                                .map((round: any) => (
                                                    <PreviousRound choice={round.choice} />
                                                ))}
                                        </>
                                    ) : (
                                        <Text>Previous results will show here</Text>
                                    )}
                                </HistoricalRounds>
                            </Collapsible>
                        </PlayerRow>
                    </TouchableOpacity>
                ))}
            </Container>
        </CurrentRoundContainer>
    )
}
