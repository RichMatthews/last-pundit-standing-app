import React from 'react'
import styled from 'styled-components'
import { Image, TouchableOpacity, Text } from 'react-native'

import { PreviousRound } from '../../previous-round'
import { ShowImageForPlayerChoice } from '../show-image-for-player-choice'

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

export const CurrentRoundView = ({
    currentViewedGame,
    currentUserId,
    gamesInLeague,
    listOfExpandedPrevious,
    selectionTimeEnded,
    setCurrentViewedGame,
    setListOfExpandedPreviousHelper,
}: any) => {
    const calculateOptionsForGameSelection = () => {
        let arr: any = []
        gamesInLeague.forEach((game: any, index: any) => {
            if (game.complete) {
                arr.push({ value: index, label: `Game ${index + 1}` })
            } else {
                arr.push({ value: index, label: `Current Game` })
            }
        })
        return arr
    }

    return (
        <CurrentRoundContainer>
            {/* <SelectContainer>
                <Select
                    options={calculateOptionsForGameSelection()}
                    isSearchable={false}
                    placeholder="Select a game"
                    onChange={({ value }: any) => setCurrentViewedGame(value)}
                    styles={customReactSelectStyles}
                    value={{
                        value:
                            currentViewedGame === gamesInLeague.length - 1
                                ? gamesInLeague.length - 1
                                : currentViewedGame,
                        label:
                            currentViewedGame === gamesInLeague.length - 1
                                ? 'Current Game'
                                : `Game ${currentViewedGame + 1}`,
                    }}
                />
            </SelectContainer> */}
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
