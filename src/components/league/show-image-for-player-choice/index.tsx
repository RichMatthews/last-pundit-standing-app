import React from 'react'
import styled from 'styled-components'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import EntypoIcon from 'react-native-vector-icons/Entypo'


import * as Images from '../../../images'

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
        (playa: any) => playa.rounds.length === CURRENT_ROUND_WITHIN_CURRENT_GAME + 1,
    )
    const ALL_REMAINING_PLAYERS_HAVE_MADE_CHOICE = REMAINING_PLAYERS_IN_CURRENT_GAME.every(
        (playa: any) => playa.rounds[CURRENT_ROUND_WITHIN_CURRENT_GAME].choice.hasMadeChoice,
    )

    if (ALL_OTHER_PLAYERS_ELIMINATED) {
        return (
            <GameStatusIndicator>
               <EntypoIcon name={'trophy'} size={25} color={'gold'} />
            </GameStatusIndicator>
        )
    }

    if (PLAYER_OUT_OF_CURRENT_GAME.length) {
        return (
            <GameStatusIndicator> 
                <EntypoIcon name={'cross'} size={25} color={'red'} />
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
                    <EntypoIcon name={'time-slot'} size={25} color={'orange'} />
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
                     <AntDesignIcon name={'checkcircleo'} size={25} color={'green'} />
                </GameStatusIndicator>
            )
        }
    }

    if (playersStillAbleToSelectTeams) {
        return (
            <GameStatusIndicator>
                 <EntypoIcon name={'time-slot'} size={25} color={'orange'} />
            </GameStatusIndicator>
        )
    }

    return (
        <GameStatusIndicator>
            <EntypoIcon name={'cross'} size={25} color={'red'} />
        </GameStatusIndicator>
    )
}
