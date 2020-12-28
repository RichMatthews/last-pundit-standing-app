import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Text, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'

import { PreviousRound } from '../../previous-round'
import { ShowImageForPlayerChoice } from '../show-image-for-player-choice'

const CurrentRound = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const Container = styled.View`
    background: #fff;
`

const ExpandImage = styled.Image<any>`
    align-self: center;
    height: 10px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};
    width: 10px;
`

const HistoricalRounds = styled.View<any>`
    display: flex;
    margin: 15px;
`

const PlayerName = styled.Text`
    color: ${({ isCurrentLoggedInPlayer }: any) => (isCurrentLoggedInPlayer ? '#827ee6' : '#2C3E50')};
    font-size: 15px;
`

const PlayerAndDownArrow = styled.View`
    display: flex;
    flex-direction: row;
`

export const CurrentRoundView = ({ listOfExpandedPrevious, setListOfExpandedPreviousHelper }: any) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)

    return (
        <View>
            <Container>
                {Object.values(currentGame.players).map((player: any, index: any) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <View
                            key={player.id}
                            value="Current Round"
                            style={{
                                borderBottomWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                paddingLeft: 0,
                                paddingRight: 0,
                                margin: 10,
                            }}
                        >
                            <CurrentRound style={{ width: 380 }}>
                                <PlayerName
                                    isCurrentLoggedInPlayer={player.id === user.id}
                                    style={{
                                        fontSize: 18,
                                    }}
                                >
                                    {player.name}
                                </PlayerName>
                                <PlayerAndDownArrow
                                    style={{
                                        borderRadius: 5,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <ShowImageForPlayerChoice
                                        currentGame={currentGame}
                                        isCurrentLoggedInPlayer={player.id === user.id}
                                        player={player}
                                    />

                                    <ExpandImage
                                        source={require('src/images/other/down-arrow.png')}
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
                                        <Text style={{ marginLeft: -15 }}>
                                            Previous results will show here after Round 1
                                        </Text>
                                    )}
                                </HistoricalRounds>
                            </Collapsible>
                        </View>
                    </TouchableOpacity>
                ))}
            </Container>
        </View>
    )
}
