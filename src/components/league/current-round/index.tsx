import React from 'react'
import styled from 'styled-components'
import { Image, TouchableOpacity, View } from 'react-native'
import { PreviousRound } from '../../previous-round'

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
    border-radius: 10px;
    border-bottom-color: #ccc;
    border-bottom-width: 1;
    padding: 10px;
    margin: 5px;
`

const Container = styled.View`
    background: transparent;
`

const ExpandImage = styled.Image<any>`
    height: 30px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};
    width: 30px;
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
    showImageForPlayerChoice,
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
                {Object.values(gamesInLeague[currentViewedGame].players).map((player: any, index: any) => (
                    <TouchableOpacity onPress={() => setListOfExpandedPreviousHelper(index)} activeOpacity={1}>
                        <PlayerRow
                            key={player.id}
                            isCurrentLoggedInPlayer={player.id === currentUserId}
                            value="Current Round"
                        >
                            <CurrentRound onPress={() => alert('tyoy')}>
                                <PlayerName>{player.name}</PlayerName>
                                <PlayerAndDownArrow>
                                    <View>
                                        {showImageForPlayerChoice(
                                            player.id === currentUserId,
                                            player,
                                            selectionTimeEnded, // change this at some point
                                        )}
                                    </View>
                                    <ExpandImage
                                        source={require('../../../images/other/down-arrow.svg')}
                                        expand={listOfExpandedPrevious.includes(index)}
                                    />
                                </PlayerAndDownArrow>
                            </CurrentRound>
                            <HistoricalRounds expand={listOfExpandedPrevious.includes(index)}>
                                {player.rounds
                                    .filter((round: any) => round.choice.value && round.choice.result !== 'pending')
                                    .map((round: any) => (
                                        <PreviousRound choice={round.choice} />
                                    ))}
                            </HistoricalRounds>
                        </PlayerRow>
                    </TouchableOpacity>
                ))}
            </Container>
        </CurrentRoundContainer>
    )
}
