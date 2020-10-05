import React from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import { Image, View } from 'react-native'
import { PreviousRound } from '../../previous-round'

const Section = styled.View`
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(41, 51, 57, 0.3);
    display: flex;
    flex-direction: column;
    @media (max-width: 900px) {
        margin-bottom: 10px;
    }
`

const CurrentRoundContainer = styled(Section)`
    height: 100%;
    margin: 0 10px;
    @media (max-width: 900px) {
        background: transparent;
        border: none;
        margin: 0 0 10px 0;
    }
`

const CurrentRound = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const CurrentSelection = styled.View<any>`
    background: ${({ isCurrentLoggedInPlayer }: any) => (isCurrentLoggedInPlayer ? '#d8ede2' : '#fff')};
    border-radius: 3px;
    padding: 10px;
    margin: 10px;
    width: inherit;
`

const customReactSelectStyles = {
    control: (base: any) => ({
        ...base,
        background: '#fff',
        fontSize: 12,
        margin: 10,
        marginLeft: 0,
        marginBottom: 0,
        width: 150,
    }),
    placeholder: (base: any) => ({
        ...base,
        fontSize: 12,
        color: '#9393A8',
    }),
    option: (base: any) => ({
        ...base,
        fontSize: 12,
        width: 150,
    }),
    menu: (base: any) => ({
        ...base,
        fontSize: 12,
        width: 150,
    }),
    menuList: (base: any) => ({
        ...base,
        fontSize: 12,
        width: 150,
    }),
}

const ExpandImage = styled.Image<any>`
    height: 10px;
    width: 10px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};

    @media (max-width: 900px) {
        width: 30px;
    }
`

const HistoricalRounds = styled.View<any>`
    display: ${({ expand }) => (expand ? 'block' : 'none')};
    transition: 2.5s;
    margin: 15px;
`

const PlayerName = styled.View`
    font-size: 15px;
    margin-right: 10px;
`

const SelectContainer = styled.View`
    display: flex;
    justify-content: flex-end;
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
            <View>
                {Object.values(gamesInLeague[currentViewedGame].players).map((player: any, index: any) => (
                    <CurrentSelection
                        isCurrentLoggedInPlayer={player.id === currentUserId}
                        onClick={() => setListOfExpandedPreviousHelper(index)}
                        value="Current Round"
                    >
                        <CurrentRound>
                            <PlayerName>{player.name}</PlayerName>
                            <View
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <View style={{ display: 'flex', marginRight: '10px' }}>
                                    {showImageForPlayerChoice(
                                        player.id === currentUserId,
                                        player,
                                        selectionTimeEnded, // change this at some point
                                    )}
                                </View>
                                <ExpandImage
                                    src={'/images/other/down-arrow.svg'}
                                    expand={listOfExpandedPrevious.includes(index)}
                                />
                            </View>
                        </CurrentRound>
                        <HistoricalRounds expand={listOfExpandedPrevious.includes(index)}>
                            {player.rounds
                                .filter((round: any) => round.choice.value && round.choice.result !== 'pending')
                                .map((round: any) => (
                                    <PreviousRound choice={round.choice} />
                                ))}
                        </HistoricalRounds>
                    </CurrentSelection>
                ))}
            </View>
        </CurrentRoundContainer>
    )
}
