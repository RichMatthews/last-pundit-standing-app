import React from 'react'
import styled from 'styled-components'
import { TouchableOpacity, Text, View } from 'react-native'
import Collapsible from 'react-native-collapsible'
import { useSelector } from 'react-redux'

import { PreviousRound } from '../../previous-round'
import { MemoizedShowImageForPlayerChoice } from '../show-image-for-player-choice'

const CurrentRound = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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

const PlayerAndDownArrow = styled.View`
    display: flex;
    flex-direction: row;
`

export const CurrentRoundView = ({ listOfExpandedPrevious, setListOfExpandedPreviousHelper, theme }: any) => {
    const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
    const user = useSelector((store: { user: any }) => store.user)

    return (
        <View>
            {Object.values(currentGame.players).map((player: any, index: any) => (
                <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                    <View
                        key={player.id}
                        style={{
                            backgroundColor: theme.background.primary,
                            borderRadius: theme.borders.radius,
                            padding: 10,
                            margin: 12,
                            shadowColor: 'black',
                            shadowOffset: { width: 0, height: 3 },
                            shadowRadius: 4,
                            shadowOpacity: 0.09,
                            elevation: 4,
                        }}
                    >
                        <CurrentRound style={{ width: 380 }}>
                            <Text
                                style={{
                                    color: player.id === user.id ? theme.tint.active : theme.text.primary,
                                    fontSize: theme.text.large,
                                }}
                            >
                                {player.name}
                            </Text>
                            <PlayerAndDownArrow
                                style={{
                                    borderRadius: 5,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <MemoizedShowImageForPlayerChoice
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
                                                (round: any) => round.choice.value && round.choice.result !== 'pending',
                                            )
                                            .map((round: any) => (
                                                <PreviousRound choice={round.choice} theme={theme} />
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
        </View>
    )
}
