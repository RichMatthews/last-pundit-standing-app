import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

import { CurrentRoundView } from './current-round'
import { ChooseTeam } from '../choose-team'
import { PageNotFound } from '../404'
import { PREMIER_LEAGUE_TEAMS } from '../../teams'
import { Fixtures } from '../fixtures'
import { firebaseApp } from '../../config.js'

export const fadeIn = keyframes`
    from {
       opacity: 0;
    }
    to {
        opacity: 1;
    }
`

interface LeagueProps {
    currentUserId: string
}
interface ImageStyled {
    lost?: boolean
}

const Container = styled.div`
    margin: 10px;
`

const Section = styled.div`
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(41, 51, 57, 0.3);
    display: flex;
    flex-direction: column;
    padding: 10px;
    @media (max-width: 900px) {
        margin-bottom: 10px;
    }
`

const SelectionWrapper = styled(Section)`
    margin: 0 10px 10px 10px;
    @media (max-width: 900px) {
        margin-right: 0;
    }
`

const LeagueInformationWrapper = styled(SelectionWrapper)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 390px;
    justify-content: space-between;
`

const BottomSection = styled.div`
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    @media (max-width: 900px) {
        flex-direction: row;
    }
`

const FixturesWrapper = styled(Section)`
    margin-right: 10px;

    @media (max-width: 900px) {
        width: 200px;
    }
`

const Image = styled.img<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    height: 30px;
    width: 30px;

    @media (max-width: 900px) {
        width: 30px;
    }
`

const H1 = styled.h1`
    color: #2f2f2f;
    font-size: 30px;
    font-weight: 400;
    margin-left: 10px;
    @media (max-width: 900px) {
        font-size: 20px;
    }
`

const H2 = styled.h2`
    display: flex;
    font-weight: 400;
    margin: 0;
    @media (max-width: 900px) {
        font-size: 16px;
    }
`

const Eliminated = styled.div`
    border: 1px solid red;
    border-radius: 3px;
    color: red;
    font-size: 13px;
    padding: 3px;
`

const AwaitingPrediction = styled(Eliminated)`
    border: 1px solid orange;
    color: orange;
`

const PredictionSubmitted = styled(Eliminated)`
    border: 1px solid green;
    color: green;
`

const RoundCloses = styled.div`
    margin-top: 20px;
    @media (max-width: 900px) {
        text-align: center;
    }
`

const Wrapper = styled.div`
    display: flex;
    @media (max-width: 900px) {
        display: block;
    }
`

const PrizeMoney = styled.div`
    font-size: 22px;
`

const TextContainer = styled.div`
    margin: 10px;
    text-align: center;
    width: 150px;
    & > span {
        font-size: 12px;
    }
`

export const League = ({ currentUserId }: LeagueProps) => {
    const [currentGame, setCurrentGame] = useState<any>({})
    const [currentGameweek, setCurrentGameweek] = useState<any>({})
    const [currentPlayer, setCurrentPlayer] = useState<any>({})
    const [currentViewedGame, setCurrentViewedGame] = useState<any>(0)
    const [league, setLeague] = useState<any>({ name: '', games: [] })
    const [gamesInLeague, setAllGamesInCurrentLeague] = useState<any>({})
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const [loaded, setLoaded] = useState<any>(false)
    const [selectionTimeEnded, setSelectionTimeEnded] = useState(false)

    const leagueId = window.location.pathname.split('/')[2]
    const history = useHistory()

    useEffect(() => {
        firebaseApp
            .database()
            .ref(`information`)
            .once('value')
            .then((snapshot) => {
                setCurrentGameweek(snapshot.val().gameweek.current)
                if (Math.ceil(Date.now() / 1000) < snapshot.val().gameweek.current.ends) {
                    setSelectionTimeEnded(true)
                }
            })
    }, [])

    const calculateTeamsAllowedToPickForCurrentRound = () => {
        if (league.currentRound < 0) {
            return PREMIER_LEAGUE_TEAMS
        } else {
            const allTeamsForThisLeague = PREMIER_LEAGUE_TEAMS
            const teamsAlreadyChosen = currentGame[0].players[currentPlayer.id].rounds

            return allTeamsForThisLeague.filter((el) => {
                return !teamsAlreadyChosen.find((team: any) => team.choice.value === el.value)
            })
        }
    }

    const pullLatestLeagueData = () => {
        firebaseApp
            .database()
            .ref(`leagues/${leagueId}`)
            .once('value')
            .then((snapshot) => {
                if (snapshot.val()) {
                    if (snapshot.val().games) {
                        const transformPayloadIntoUsableObject = {
                            ...snapshot.val(),
                            games: Object.values(snapshot.val().games),
                        }
                        const currentGame: any = Object.values(snapshot.val().games).filter(
                            (game: any) => !game.complete,
                        )
                        setCurrentGame(currentGame)
                        setAllGamesInCurrentLeague(transformPayloadIntoUsableObject.games)
                        setLeague(transformPayloadIntoUsableObject)
                        setCurrentViewedGame(transformPayloadIntoUsableObject.games.length - 1)
                        const players = Object.values(currentGame[0].players)
                        const foundPlayer = players.filter((player: any) => player.id === currentUserId)
                        if (!foundPlayer.length) {
                            return history.push('/home')
                        }
                        setCurrentPlayer(foundPlayer[0])
                        setLoaded('league-found')
                    } else {
                        setLeague(snapshot.val())
                        setLoaded('league-found')
                    }
                } else {
                    setLoaded('no-league-found')
                    return null
                }
            })
    }

    useEffect(() => {
        pullLatestLeagueData()
    }, [])

    const showImageForPlayerChoice = (
        isCurrentLoggedInPlayer: boolean,
        player: any,
        playersStillAbleToSelectTeams: boolean,
    ) => {
        const playerOutOfGame = player.rounds.filter((round: any) => round.choice.result === 'lost')
        const playerCurrentRound = player.rounds[gamesInLeague[currentViewedGame].currentGameRound]
        const currentGameRound = currentGame[0]['currentGameRound']
        const currentRound = currentPlayer.rounds[currentGameRound]
        const allPlayers = Object.values(currentGame[0].players)
        const otherPlayers = allPlayers.filter((play: any) => play.id !== player.id)
        const allOtherPlayersAreEliminated = otherPlayers.every((player: any) => player.hasBeenEliminated)
        const playerHasWon = player.hasBeenEliminated === false
        const remainingPlayers: any = allPlayers.filter((player: any) => player.rounds.length === 4)
        const allRemainingPlayersHaveSelected = remainingPlayers.every(
            (player: any) => player.rounds[3].choice.hasMadeChoice,
        )

        if (allOtherPlayersAreEliminated) {
            return <Eliminated>Champion!</Eliminated>
        }

        if (playerOutOfGame.length) {
            return <Eliminated>Eliminated</Eliminated>
        }

        if (isCurrentLoggedInPlayer) {
            if (currentRound.choice.hasMadeChoice) {
                return (
                    <Image
                        src={`/images/teams/${playerCurrentRound.choice.value.replace(/\s/g, '').toLowerCase()}.png`}
                        lost={false}
                    />
                )
            }
        }

        if (currentRound.choice.hasMadeChoice) {
            if (allRemainingPlayersHaveSelected) {
                return (
                    <Image
                        src={`/images/teams/${playerCurrentRound.choice.value.replace(/\s/g, '').toLowerCase()}.png`}
                        lost={false}
                    />
                )
            } else if (!playersStillAbleToSelectTeams) {
                return (
                    <Image
                        src={`/images/teams/${currentRound.choice.value.replace(/\s/g, '').toLowerCase()}.png`}
                        lost={false}
                    />
                )
            } else {
                return <PredictionSubmitted>Prediction Submitted</PredictionSubmitted>
            }
        }

        if (playersStillAbleToSelectTeams) {
            return <AwaitingPrediction>Awaiting Prediction</AwaitingPrediction>
        }

        return <Eliminated>Eliminated</Eliminated>
    }

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame[0]['currentGameRound']
        const currentRound = currentPlayer.rounds[currentGameRound]
        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.choice.result === 'lost')

        if (playerOutOfGame.length) {
            return <div>You are no longer in this game</div>
        } else if (currentRound && currentRound.choice.hasMadeChoice === false) {
            return (
                <ChooseTeam
                    pullLatestLeagueData={pullLatestLeagueData}
                    calculateTeamsAllowedToPickForCurrentRound={calculateTeamsAllowedToPickForCurrentRound}
                    currentRound={gamesInLeague[currentViewedGame].currentGameRound}
                    currentUserId={currentUserId}
                    gameId={gamesInLeague[currentViewedGame].gameId}
                    leagueId={league.id}
                    leagueOnly={true}
                />
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice) {
            return <div>You have made your choice for this week.</div>
        } else {
            return <div>You didn't select a team in time and are unfortunately now out of this game.</div>
        }
    }

    const setListOfExpandedPreviousHelper = (index: number) => {
        if (listOfExpandedPrevious.includes(index)) {
            setListOfExpandedPrevious(listOfExpandedPrevious.filter((x: number) => x !== index))
        } else {
            setListOfExpandedPrevious(listOfExpandedPrevious.concat(index))
        }
    }

    if (loaded === 'league-found') {
        return (
            <Container>
                <H1>{league.name}</H1>
                <Wrapper>
                    <CurrentRoundView
                        currentUserId={currentUserId}
                        currentViewedGame={currentViewedGame}
                        gamesInLeague={gamesInLeague}
                        listOfExpandedPrevious={listOfExpandedPrevious}
                        selectionTimeEnded={selectionTimeEnded}
                        setCurrentViewedGame={setCurrentViewedGame}
                        setListOfExpandedPreviousHelper={setListOfExpandedPreviousHelper}
                        showImageForPlayerChoice={showImageForPlayerChoice}
                    />
                    <BottomSection>
                        <FixturesWrapper>
                            <H2>Gameweek Fixtures</H2>
                            <Fixtures />
                        </FixturesWrapper>

                        <div>
                            <SelectionWrapper>
                                <H2>Team Selection</H2>
                                <div>{showTeamSelectionPage()}</div>
                                <RoundCloses>
                                    Round closes on <b>{currentGameweek.endsReadable}</b>
                                </RoundCloses>
                            </SelectionWrapper>
                            <LeagueInformationWrapper>
                                <TextContainer>
                                    <img src="/images/other/premier-league.png" width="100%" />
                                </TextContainer>
                                <TextContainer>
                                    <PrizeMoney>£20</PrizeMoney>
                                    <span>prize money</span>
                                </TextContainer>
                                <TextContainer>
                                    <PrizeMoney>{league.admin.name}</PrizeMoney>
                                    <span>(admin)</span>
                                </TextContainer>
                                <TextContainer>
                                    <PrizeMoney>123</PrizeMoney>
                                    <span>join pin</span>
                                </TextContainer>
                            </LeagueInformationWrapper>
                            <SelectionWrapper>
                                <H2>League Rules</H2>
                                <div>
                                    <li>Pick a different team every week</li>
                                    <li>Home team must win</li>
                                    <li>Away team must win or draw</li>
                                    <li>Last Pundit Standing wins jackpot</li>
                                    <li>Money rolls over if no winner</li>
                                </div>
                            </SelectionWrapper>
                        </div>
                    </BottomSection>
                </Wrapper>
            </Container>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return <Container> Retrieving League information... </Container>
}
