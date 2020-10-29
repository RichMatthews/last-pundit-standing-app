import React, { useState } from 'react'
import styled from 'styled-components'
import { Dimensions, TouchableOpacity, Text, View } from 'react-native'
import Modal from 'react-native-modal'

import { PreviousRound } from '../../previous-round'
import { ShowImageForPlayerChoice } from '../show-image-for-player-choice'
import { H2 } from '../../../ui-components/headings'
import { Button, ButtonText } from '../../../ui-components/button'

const Section = styled.View`
    border-radius: 5px;
    display: flex;
    flex-direction: column;
`

const CurrentRoundContainer = styled(Section)``

const CurrentRound = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const PlayerRow = styled.View<any>`
    background: ${({ isCurrentLoggedInPlayer }: any) => (isCurrentLoggedInPlayer ? '#d8ede2' : '#fff')};
    border-radius: 5px;
    padding: 10px;
    margin: 0 10px 10px 10px;
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

const HistoricalRounds = styled.View<any>`
    display: ${({ expand }) => (expand ? 'flex' : 'none')};
    margin: 15px;
`

const PlayerName = styled.Text`
    font-size: 15px;
    margin-right: 10px;
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

export const CurrentRoundView = ({
    currentViewedGame,
    currentUserId,
    gamesInLeague,
    listOfExpandedPrevious,
    selectionTimeEnded,
    setCurrentViewedGame,
    setListOfExpandedPreviousHelper,
}: any) => {
    const [gameSelectModalOpen, setGameSelectModalOpen] = useState(false)

    return (
        <CurrentRoundContainer>
            <Modal
                animationIn={'zoomIn'}
                animationOut={'zoomOut'}
                animationInTiming={500}
                animationOutTiming={500}
                backdropTransitionOutTiming={0}
                onBackdropPress={() => setGameSelectModalOpen(false)}
                isVisible={gameSelectModalOpen}
            >
                <View
                    style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                        borderRadius: 5,
                        width: windowWidth * 0.8,
                        height: windowHeight * 0.5,
                        paddingTop: 50,
                        margin: 0,
                    }}
                >
                    <H2>Select a game to view</H2>

                    <View
                        style={{
                            alignItems: 'flex-start',
                            display: 'flex',
                            justifyContent: 'center',
                            width: '80%',
                        }}
                    >
                        {gamesInLeague
                            .sort((x: any, y: any) => y - x)
                            .map((game: any, index: number) => (
                                <View style={{ padding: 10, width: '100%' }}>
                                    <TouchableOpacity onPress={() => setCurrentViewedGame(game)}>
                                        {game.complete ? (
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text style={{ fontSize: 17 }}>Game {index} </Text>
                                                {currentViewedGame.gameId === game.gameId ? (
                                                    <View
                                                        style={{
                                                            height: 20,
                                                            width: 20,
                                                            borderRadius: 20,
                                                            borderWidth: 1,
                                                            borderColor: '#827ee6',
                                                            backgroundColor: '#827ee6',
                                                        }}
                                                    />
                                                ) : (
                                                    <View
                                                        style={{
                                                            height: 20,
                                                            width: 20,
                                                            borderRadius: 20,
                                                            borderWidth: 1,
                                                            borderColor: '#827ee6',
                                                            backgroundColor: '#fff',
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        ) : (
                                            <View
                                                style={{
                                                    alignItems: 'center',
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Text style={{ fontSize: 17 }}>Current Game</Text>
                                                {currentViewedGame.gameId === game.gameId ? (
                                                    <View
                                                        style={{
                                                            height: 20,
                                                            width: 20,
                                                            borderRadius: 20,
                                                            borderWidth: 1,
                                                            borderColor: '#827ee6',
                                                            backgroundColor: '#827ee6',
                                                        }}
                                                    />
                                                ) : (
                                                    <View
                                                        style={{
                                                            height: 20,
                                                            width: 20,
                                                            borderRadius: 20,
                                                            borderWidth: 1,
                                                            borderColor: '#827ee6',
                                                            backgroundColor: '#fff',
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </View>
                    <View style={{ bottom: 50, position: 'absolute' }}>
                        <TouchableOpacity onPress={() => setGameSelectModalOpen(false)}>
                            <Button>
                                <ButtonText>View game</ButtonText>
                            </Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity onPress={() => setGameSelectModalOpen(true)}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 5,
                        margin: 5,
                    }}
                >
                    <Text>You are viewing the current game</Text>
                </View>
            </TouchableOpacity>
            <Container>
                {Object.values(currentViewedGame.players).map((player: any, index: any) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <PlayerRow
                            key={player.id}
                            isCurrentLoggedInPlayer={player.id === currentUserId}
                            value="Current Round"
                        >
                            <CurrentRound>
                                <PlayerName>{player.name}</PlayerName>
                                <PlayerAndDownArrow>
                                    <ShowImageForPlayerChoice
                                        currentViewedGame={currentViewedGame}
                                        isCurrentLoggedInPlayer={player.id === currentUserId}
                                        player={player}
                                        playersStillAbleToSelectTeams={selectionTimeEnded}
                                    />

                                    <ExpandImage
                                        source={require('../../../images/other/down-arrow.png')}
                                        expand={listOfExpandedPrevious.includes(index)}
                                    />
                                </PlayerAndDownArrow>
                            </CurrentRound>
                            <HistoricalRounds expand={listOfExpandedPrevious.includes(index)}>
                                {player.rounds.length > 0 ? (
                                    <>
                                        {player.rounds
                                            .filter(
                                                (round: any) => round.choice.value && round.choice.result !== 'pending',
                                            )
                                            .map((round: any) => (
                                                <PreviousRound choice={round.choice} />
                                            ))}
                                    </>
                                ) : (
                                    <Text>Previous results will show here</Text>
                                )}
                            </HistoricalRounds>
                        </PlayerRow>
                    </TouchableOpacity>
                ))}
            </Container>
        </CurrentRoundContainer>
    )
}
