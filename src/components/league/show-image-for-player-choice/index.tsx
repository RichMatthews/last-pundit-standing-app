import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import styled from 'styled-components'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'

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

const playerStatus = {
    eliminated: {
        bgColor: '#F8D7DA',
        color: '#721C25',
        text: 'Eliminated',
    },
    pending: {
        bgColor: '#FFF3CD',
        color: '#856404',
        text: 'Pending',
    },
    submitted: {
        bgColor: '#D4EDDA',
        color: '#155725',
        text: ' Submitted',
    },
    currentPending: {
        bgColor: '#FFF3CD',
        color: '#856404',
        text: 'Awaiting your prediction',
    },
    champion: {
        bgColor: '#FFF3CD',
        color: '#856404',
        text: 'Champion',
    },
}

const GameStatusIndicatorComponent = (status: string) => (
    <GameStatusIndicator>
        <Label bgColor={playerStatus[status].bgColor}>
            <LabelText color={playerStatus[status].color}>{playerStatus[status].text}</LabelText>
        </Label>
    </GameStatusIndicator>
)

export const MemoizedShowImageForPlayerChoice = ({ currentGame, isCurrentLoggedInPlayer, player }: any) => {
    const [gameSelectionTimeEnded, setGameSelectionTimeEnded] = useState(false)
    const currentGameweek = useSelector((store: { currentGameweek: any }) => store.currentGameweek)

    useEffect(() => {
        checkIfTimeEnded()
    }, [])

    const checkIfTimeEnded = async () => {
        const timeHasEnded = await gameweekSelectionTimeEnded(currentGameweek.ends)

        if (timeHasEnded) {
            setGameSelectionTimeEnded(true)
        }
    }
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

    if (ALL_OTHER_PLAYERS_ELIMINATED && ALL_PLAYERS_IN_CURRENT_GAME.length > 1) {
        return GameStatusIndicatorComponent('champion')
    }

    if (
        PLAYER_CURRENT_ROUND === undefined ||
        (gameSelectionTimeEnded && !PLAYER_CURRENT_ROUND.choice.hasMadeChoice) ||
        (!gameSelectionTimeEnded && PLAYER_OUT_OF_CURRENT_GAME.length)
    ) {
        return GameStatusIndicatorComponent('eliminated')
    }

    if (isCurrentLoggedInPlayer) {
        if (PLAYER_CURRENT_ROUND.choice.hasMadeChoice) {
            return (
                <FastImage
                    style={{ width: 25, height: 25, marginRight: 10 }}
                    source={Images[PLAYER_CURRENT_ROUND.choice.value.replace(/\s/g, '').toLowerCase()]}
                />
            )
        } else {
            return GameStatusIndicatorComponent('currentPending')
        }
    }

    if (PLAYER_CURRENT_ROUND.choice.hasMadeChoice) {
        if (ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE) {
            return (
                <FastImage
                    style={{ width: 25, height: 25, marginRight: 10 }}
                    source={Images[PLAYER_CURRENT_ROUND.choice.value.replace(/\s/g, '').toLowerCase()]}
                />
            )
        } else {
            return GameStatusIndicatorComponent('submitted')
        }
    } else {
        return GameStatusIndicatorComponent('pending')
    }
}
