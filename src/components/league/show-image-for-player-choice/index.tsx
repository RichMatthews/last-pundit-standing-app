import React from 'react'
import styled from 'styled-components'
import { Text } from 'react-native'

import * as Images from '../../../images'

interface ImageStyled {
    lost?: boolean
}

const Eliminated = styled.View`
    border: 1px solid red;
    border-radius: 3px;
    font-size: 13px;
    padding: 3px;
    margin-right: 10px;
`

const EliminatedText = styled.Text`
    color: red;
`
const AwaitingPrediction = styled(Eliminated)`
    border: 1px solid orange;
`

const AwaitingPredictionText = styled.Text`
    color: orange;
`

const PredictionSubmitted = styled(Eliminated)`
    border: 1px solid green;
`

const PredictionSubmittedText = styled.Text`
    color: green;
`

const Image = styled.Image<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    height: 30px;
    margin-right: 10px;
    width: 30px;
`

export const ShowImageForPlayerChoice = ({
    currentViewedGame,
    isCurrentLoggedInPlayer,
    player,
    playersStillAbleToSelectTeams,
}: any) => {
    const PLAYER_OUT_OF_CURRENT_GAME = player.rounds.filter((round: any) => round.choice.result === 'lost')
    const ALL_PLAYERS_IN_CURRENT_GAME = Object.values(currentViewedGame.players)
    const CURRENT_ROUND_WITHIN_CURRENT_GAME = currentViewedGame.currentGameRound

    const OTHER_PLAYERS_EXCEPT_CURRENT_LOGGED_IN_PLAYER = ALL_PLAYERS_IN_CURRENT_GAME.filter(
        (play: any) => play.id !== player.id,
    )
    const ALL_OTHER_PLAYERS_ELIMINATED = OTHER_PLAYERS_EXCEPT_CURRENT_LOGGED_IN_PLAYER.every(
        (playa: any) => playa.hasBeenEliminated,
    )
    const PLAYER_CURRENT_ROUND = player.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME]
    const REMAINING_PLAYERS_IN_CURRENT_GAME: any = ALL_PLAYERS_IN_CURRENT_GAME.filter(
        (playa: any) => playa.rounds.length === CURRENT_ROUND_WITHIN_CURRENT_GAME,
    )
    const ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE = REMAINING_PLAYERS_IN_CURRENT_GAME.every(
        (playa: any) => playa.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME - 1].choice.hasMadeChoice,
    )

    if (ALL_OTHER_PLAYERS_ELIMINATED) {
        return (
            <Eliminated>
                <EliminatedText>Champion!</EliminatedText>
            </Eliminated>
        )
    }

    if (PLAYER_OUT_OF_CURRENT_GAME.length) {
        return (
            <Eliminated>
                <EliminatedText>Eliminated</EliminatedText>
            </Eliminated>
        )
    }

    if (isCurrentLoggedInPlayer && PLAYER_CURRENT_ROUND.choice.hasMadeChoice) {
        return (
            <Image source={Images[PLAYER_CURRENT_ROUND.choice.value.replace(/\s/g, '').toLowerCase()]} lost={false} />
        )
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
                <PredictionSubmitted>
                    <PredictionSubmittedText>Prediction Submitted</PredictionSubmittedText>
                </PredictionSubmitted>
            )
        }
    }

    if (playersStillAbleToSelectTeams) {
        return (
            <AwaitingPrediction>
                <AwaitingPredictionText>Awaiting Prediction</AwaitingPredictionText>
            </AwaitingPrediction>
        )
    }

    return <Eliminated>Eliminated</Eliminated>
}
