import React from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'

import * as Images from '../../../images'
import { gameweekSelectionTimeEnded } from 'src/utils/gameweekSelectionTimeEnded'

interface ImageStyled {
    lost?: boolean
}

const GameStatusIndicator = styled.View`
    margin-right: 10px;
`

const Image = styled.Image<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    height: 25px;
    margin-right: 10px;
    width: 25px;
`

const Label = styled.View`
    background-color: ${({ bgColor }) => bgColor};
    border-radius: 5px;
`

const LabelText = styled.Text`
    color: ${({ color }) => color};
    font-size: 10px;
    padding: 5px;
`

export const ShowImageForPlayerChoice = ({ currentGame, isCurrentLoggedInPlayer, player }: any) => {
    const PLAYER_OUT_OF_CURRENT_GAME = player.rounds.filter((round: any) => round.choice.result === 'lost')
    const ALL_PLAYERS_IN_CURRENT_GAME = Object.values(currentGame.players)
    const CURRENT_ROUND_WITHIN_CURRENT_GAME = currentGame.currentGameRound

    const OTHER_PLAYERS_EXCEPT_CURRENT_LOGGED_IN_PLAYER = ALL_PLAYERS_IN_CURRENT_GAME.filter(
        (play: any) => play.id !== player.id,
    )
    const ALL_OTHER_PLAYERS_ELIMINATED = OTHER_PLAYERS_EXCEPT_CURRENT_LOGGED_IN_PLAYER.every(
        (playa: any) => playa.hasBeenEliminated,
    )
    const PLAYER_CURRENT_ROUND = player.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME]
    const REMAINING_PLAYERS_IN_CURRENT_GAME: any = ALL_PLAYERS_IN_CURRENT_GAME.filter(
        (playa: any) => playa.rounds.length === CURRENT_ROUND_WITHIN_CURRENT_GAME + 1,
    )
    const ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE = REMAINING_PLAYERS_IN_CURRENT_GAME.every(
        (playa: any) => playa.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME].choice.hasMadeChoice,
    )

    if (ALL_OTHER_PLAYERS_ELIMINATED) {
        return (
            <GameStatusIndicator>
                <Label bgColor="#ff6b6b">
                    <LabelText color="#6b0707">CHAMPION</LabelText>
                </Label>
            </GameStatusIndicator>
        )
    }

    if (PLAYER_OUT_OF_CURRENT_GAME.length) {
        return (
            <GameStatusIndicator>
                <Label bgColor="#F8D7DA">
                    <LabelText color="#721C25">Eliminated</LabelText>
                </Label>
            </GameStatusIndicator>
        )
    }

    if (isCurrentLoggedInPlayer) {
        if (PLAYER_CURRENT_ROUND.choice.hasMadeChoice) {
            return (
                <Image
                    source={Images[PLAYER_CURRENT_ROUND.choice.value.replace(/\s/g, '').toLowerCase()]}
                    lost={false}
                />
            )
        } else {
            return (
                <GameStatusIndicator>
                    <Label bgColor="#ff6b6b">
                        <LabelText color="#6b0707">Pending</LabelText>
                    </Label>
                </GameStatusIndicator>
            )
        }
    }

    if (PLAYER_CURRENT_ROUND.choice.hasMadeChoice) {
        if (ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE) {
            return (
                <Image
                    source={Images[PLAYER_CURRENT_ROUND.choice.value.replace(/\s/g, '').toLowerCase()]}
                    lost={false}
                />
            )
        } else {
            return (
                <GameStatusIndicator>
                    <Label bgColor="#D4EDDA">
                        <LabelText color="#155725">Submitted</LabelText>
                    </Label>
                </GameStatusIndicator>
            )
        }
    }

    if (gameweekSelectionTimeEnded()) {
        return (
            <GameStatusIndicator>
                <Label bgColor="#FFF3CD">
                    <LabelText color="#856404">Pending</LabelText>
                </Label>
            </GameStatusIndicator>
        )
    }

    return (
        <GameStatusIndicator>
            <View>
                <Text>Eliminated</Text>
            </View>
        </GameStatusIndicator>
    )
}
