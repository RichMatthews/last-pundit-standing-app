import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import styled from 'styled-components'

import { CurrentRoundView } from './current-round'
import { ChooseTeam } from '../choose-team'
import { PageNotFound } from '../404'
import * as Images from '../../images'
import { Fixtures } from '../fixtures'
import { firebaseApp } from '../../config.js'

import { PREMIER_LEAGUE_TEAMS } from '../../teams'
import { H1, H2 } from '../../ui-components/headings'
import { ContainerWithHeaderShown } from '../../ui-components/containers'

interface LeagueProps {
    currentUserId: string
    navigation: any
}
interface ImageStyled {
    lost?: boolean
}

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
    padding: 0;
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

const LeagueTypeImage = styled.Image`
    resize-mode: contain;
    flex: 1;
    margin-right: 10px;
    height: undefined;
    width: 100px;
`

const TeamSelectionText = styled.Text`
    margin-top: 20px;
`

const LeagueNameAndLeagueTypeImage = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const League = ({ currentUserId, navigation }: LeagueProps) => {
    const [currentGame, setCurrentGame] = useState<any>({})
    const [currentGameweek, setCurrentGameweek] = useState<any>({})
    const [currentPlayer, setCurrentPlayer] = useState<any>({})
    const [currentViewedGame, setCurrentViewedGame] = useState<any>({})
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
        if (league.currentRound === 0) {
            return PREMIER_LEAGUE_TEAMS
        } else {
            const allTeamsForThisLeague = PREMIER_LEAGUE_TEAMS
            const teamsAlreadyChosen = Object.values(currentGame.players).filter(
                (player: any) => player.id === currentPlayer.id,
            )
            return allTeamsForThisLeague.filter((el) => {
                return !teamsAlreadyChosen.find((team: any) => team.choice.value === el.value)
            })
        }
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
                        const currentGame: any = Object.values(snapshot.val().games).find((game: any) => !game.complete)
                        setCurrentGame(currentGame)
                        setAllGamesInCurrentLeague(transformPayloadIntoUsableObject.games)
                        setLeague(transformPayloadIntoUsableObject)
                        setCurrentViewedGame(currentGame)
                        const players = Object.values(currentGame.players)
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

    const showTeamSelectionPage = () => {
        const currentGameRound = currentGame.currentGameRound
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
                    currentRound={currentGame.currentGameRound}
                    currentUserId={currentUserId}
                    gameId={currentGame.gameId}
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
        if (listOfExpandedPrevious.includes(index)) {
            setListOfExpandedPrevious(listOfExpandedPrevious.filter((x: number) => x !== index))
        } else {
            setListOfExpandedPrevious(listOfExpandedPrevious.concat(index))
        }
    }

    if (loaded === 'league-found') {
        return (
            <ContainerWithHeaderShown>
                <ScrollView>
                    <LeagueNameAndLeagueTypeImage>
                        <H1>{league.name}</H1>
                        <View>
                            <LeagueTypeImage source={require('../../images/other/premier-league.png')} />
                        </View>
                    </LeagueNameAndLeagueTypeImage>
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
                            />
                        </CurrentRoundSelectionWrapper>
                        <SelectionWrapper>
                            <H2>Team Selection</H2>
                            <TeamSelectionText>{showTeamSelectionPage()}</TeamSelectionText>
                            <Text>Round closes on {currentGameweek.endsReadable}</Text>
                        </SelectionWrapper>
                        <SelectionWrapper>
                            <Fixtures />
                        </SelectionWrapper>
                        <LeagueInformationWrapper>
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
            </ContainerWithHeaderShown>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return (
        <ContainerWithHeaderShown>
            <Text>Retrieving League information...</Text>
        </ContainerWithHeaderShown>
    )
}
