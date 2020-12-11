import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Text } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'

import { PreviousRound } from '../../previous-round'
import { ShowImageForPlayerChoice } from '../show-image-for-player-choice'

const Section = styled.View`
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    width: 350px;
`

const CurrentRound = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const PlayerRow = styled.View<any>`
    border-radius: 5px;
    background-color: #f7f7ff;
    padding: 10px;
    margin: 10px;
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

const PlayerAndDownArrow = styled.View`
    display: flex;
    flex-direction: row;
`

export const CurrentRoundView = ({ listOfExpandedPrevious, setListOfExpandedPreviousHelper }: any) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)

    return (
        <Section>
            <Container>
                {Object.values(currentGame.players).map((player: any, index: any) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <PlayerRow
                            key={player.id}
                            value="Current Round"
                            style={{
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                shadowColor: '#ddd',
                                shadowOffset: { height: 2, width: 0 },
                            }}
                        >
                            <CurrentRound>
                                <PlayerName isCurrentLoggedInPlayer={player.id === user.id}>{player.name}</PlayerName>
                                <PlayerAndDownArrow>
                                    <ShowImageForPlayerChoice
                                        currentGame={currentGame}
                                        isCurrentLoggedInPlayer={player.id === user.id}
                                        player={player}
                                    />

                                    <ExpandImage
                                        source={require('../../../images/other/down-arrow.png')}
                                        expand={listOfExpandedPrevious.includes(index)}
                                    />
                                </PlayerAndDownArrow>
                            </CurrentRound>
                            <Collapsible collapsed={!listOfExpandedPrevious.includes(index)} duration={250}>
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
        </Section>
    )
}
