import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import styled from 'styled-components'

import { CurrentRoundView } from './current-round'
import { ChooseTeam } from '../choose-team'
import { PageNotFound } from '../404'
import * as Images from '../../images'
import { Fixtures } from '../fixtures'
import { firebaseApp } from '../../config.js'

import { H1, H2 } from '../../ui-components/headings'

interface LeagueProps {
    currentUserId: string
    navigation: any
}
interface ImageStyled {
    lost?: boolean
}

const Container = styled.View`
    flex: 1;
    margin: 10px;
`

const Section = styled.View`
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 1px 4px rgba(41, 51, 57, 0.1);
    display: flex;
    flex-direction: column;
    padding: 10px;
    margin-bottom: 10px;
`

const SelectionWrapper = styled(Section)`
    margin: 10px 10px 10px 10px;
`

const CurrentRoundSelectionWrapper = styled(Section)`
    background: transparent;
`

const LeagueInformationWrapper = styled(SelectionWrapper)`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 390px;
    justify-content: space-between;
`

const TeamBadge = styled.Image<ImageStyled>`
    opacity: ${({ lost }) => (lost ? 0.2 : 1)};
    height: 30px;
    width: 30px;
`

const Eliminated = styled.View`
    border-radius: 3px;
    background: #de4949;

    padding: 5px;
`

const Champion = styled(Eliminated)`
    background: gold;
`

const AwaitingPrediction = styled(Eliminated)`
    background: #e89843;
`

const PredictionSubmitted = styled(Eliminated)`
    background: #2da63f;
`

const RoundStatus = styled.Text`
    color: #fff;
    font-weight: bold;
    font-size: 11px;
`

const RoundCloses = styled.View`
    margin-top: 20px;
`

const Wrapper = styled.View`
    display: flex;
    flex-direction: column;
`

const PrizeMoney = styled.View`
    font-size: 22px;
`

const TextContainer = styled.View`
    margin: 10px;
    text-align: center;
    width: 150px;
    & > span {
        font-size: 12px;
    }
`

const PremierLeagueImage = styled.Image`
    height: 70px;
    width: 150px;
`

const TeamSelectionText = styled.Text`
    margin-top: 20px;
`

export const League = ({ currentUserId, navigation }: LeagueProps) => {
    const [currentGame, setCurrentGame] = useState<any>({})
    const [currentGameweek, setCurrentGameweek] = useState<any>({})
    const [currentPlayer, setCurrentPlayer] = useState<any>({})
    const [currentViewedGame, setCurrentViewedGame] = useState<any>(0)
    const [league, setLeague] = useState<any>({ name: '', games: [] })
    const [gamesInLeague, setAllGamesInCurrentLeague] = useState<any>({})
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const [loaded, setLoaded] = useState<any>(false)
    const [selectionTimeEnded, setSelectionTimeEnded] = useState(false)

    const leagueId = '9hk0btr26u7'

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
        // if (league.currentRound < 0) {
        //     return PREMIER_LEAGUE_TEAMS
        // } else {
        //     const allTeamsForThisLeague = PREMIER_LEAGUE_TEAMS
        //     const teamsAlreadyChosen = currentGame[0].players[currentPlayer.id].rounds

        //     return allTeamsForThisLeague.filter((el) => {
        //         return !teamsAlreadyChosen.find((team: any) => team.choice.value === el.value)
        //     })
        // }
        return []
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
                            // return history.push('/home')
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
            return (
                <Champion>
                    <RoundStatus>Champion!</RoundStatus>
                </Champion>
            )
        }

        if (playerOutOfGame.length) {
            return (
                <Eliminated>
                    <RoundStatus>Eliminated</RoundStatus>
                </Eliminated>
            )
        }

        if (isCurrentLoggedInPlayer) {
            if (currentRound.choice.hasMadeChoice) {
                return (
                    <TeamBadge
                        source={Images[playerCurrentRound.choice.value.replace(/\s/g, '').toLowerCase()]}
                        lost={false}
                    />
                )
            }
        }

        if (currentRound.choice.hasMadeChoice) {
            if (allRemainingPlayersHaveSelected) {
                return (
                    <TeamBadge
                        source={Images[playerCurrentRound.choice.value.replace(/\s/g, '').toLowerCase()]}
                        lost={false}
                    />
                )
            } else if (!playersStillAbleToSelectTeams) {
                return (
                    <TeamBadge
                        source={Images[playerCurrentRound.choice.value.replace(/\s/g, '').toLowerCase()]}
                        lost={false}
                    />
                )
            } else {
                return (
                    <PredictionSubmitted>
                        <RoundStatus>Prediction Submitted</RoundStatus>
                    </PredictionSubmitted>
                )
            }
        }

        if (playersStillAbleToSelectTeams) {
            return (
                <AwaitingPrediction>
                    <RoundStatus>Awaiting Prediction</RoundStatus>
                </AwaitingPrediction>
            )
        }

        return (
            <Eliminated>
                <RoundStatus>Eliminated</RoundStatus>
            </Eliminated>
        )
    }

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame[0]['currentGameRound']
        const currentRound = currentPlayer.rounds[currentGameRound]
        const playerOutOfGame = currentPlayer.rounds.filter((round: any) => round.choice.result === 'lost')

        if (playerOutOfGame.length) {
            return (
                <View>
                    <Text>You are no longer in this game</Text>
                </View>
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice === false) {
            return (
                <ChooseTeam
                    calculateTeamsAllowedToPickForCurrentRound={calculateTeamsAllowedToPickForCurrentRound}
                    pullLatestLeagueData={pullLatestLeagueData}
                    currentRound={gamesInLeague[currentViewedGame].currentGameRound}
                    currentUserId={currentUserId}
                    gameId={gamesInLeague[currentViewedGame].gameId}
                    leagueId={league.id}
                    leagueOnly={true}
                />
            )
        } else if (currentRound && currentRound.choice.hasMadeChoice) {
            return (
                <View>
                    <Text>You have made your choice for this week.</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>You didn't select a team in time and are unfortunately now out of this game.</Text>
                </View>
            )
        }
    }

    const setListOfExpandedPreviousHelper = (index: number) => {
        console.debug('cllade')
        if (listOfExpandedPrevious.includes(index)) {
            setListOfExpandedPrevious(listOfExpandedPrevious.filter((x: number) => x !== index))
        } else {
            setListOfExpandedPrevious(listOfExpandedPrevious.concat(index))
        }
    }

    if (loaded === 'league-found') {
        return (
            <Container>
                <ScrollView>
                    <H1>{league.name}</H1>
                    <Wrapper>
                        <CurrentRoundSelectionWrapper>
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
                        </CurrentRoundSelectionWrapper>
                        <SelectionWrapper>
                            <H2>Team Selection</H2>
                            <TeamSelectionText>{showTeamSelectionPage()}</TeamSelectionText>
                            <RoundCloses>
                                <Text>Round closes on {currentGameweek.endsReadable}</Text>
                            </RoundCloses>
                        </SelectionWrapper>
                        <SelectionWrapper>
                            <Fixtures />
                        </SelectionWrapper>
                        <LeagueInformationWrapper>
                            <TextContainer>
                                <PremierLeagueImage source={require('../../images/other/premier-league.png')} />
                            </TextContainer>
                            <TextContainer>
                                <PrizeMoney>
                                    <Text>£20</Text>
                                </PrizeMoney>
                                <Text>prize money</Text>
                            </TextContainer>
                            <TextContainer>
                                <PrizeMoney>
                                    <Text>{league.admin.name}</Text>
                                </PrizeMoney>
                                <Text>(admin)</Text>
                            </TextContainer>
                            <TextContainer>
                                <PrizeMoney>
                                    <Text>123</Text>
                                </PrizeMoney>
                                <Text>join pin</Text>
                            </TextContainer>
                        </LeagueInformationWrapper>
                        <SelectionWrapper>
                            <H2>League Rules</H2>
                            <View>
                                <Text>Pick a different team every week</Text>
                                <Text>Home team must win</Text>
                                <Text>Away team must win or draw</Text>
                                <Text>Last Pundit Standing wins jackpot</Text>
                                <Text>Money rolls over if no winner</Text>
                            </View>
                        </SelectionWrapper>
                    </Wrapper>
                </ScrollView>
            </Container>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return (
        <Container>
            <Text>Retrieving League information...</Text>
        </Container>
    )
}
