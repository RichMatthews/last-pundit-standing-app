import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import styled from 'styled-components'

import { CurrentRoundView } from './current-round'
import { LeagueRules } from './league-rules'
import { ChooseTeam } from '../choose-team'
import { PageNotFound } from '../404'
import * as Images from '../../images'
import { Fixtures } from '../fixtures'
import { firebaseApp } from '../../config.js'

import { PREMIER_LEAGUE_TEAMS } from '../../teams'
import { H1, H2 } from '../../ui-components/headings'
import { ContainerWithHeaderShown, InnerWithHeaderShown } from '../../ui-components/containers'

interface LeagueProps {
    currentUserId: string
    leagueId: string
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

const Wrapper = styled.View`
    display: flex;
    flex-direction: column;
`

const TextContainer = styled.View`
    margin: 10px;
    text-align: center;
`

const LeagueTypeImage = styled.Image`
    resize-mode: contain;
    flex: 1;
    margin-right: 10px;
    height: 35px;
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
    margin-bottom: 15px;
    margin-left: 10px;
`

export const League = ({ currentUserId, leagueId, navigation }: LeagueProps) => {
    const [currentGame, setCurrentGame] = useState<any>({})
    const [currentGameweek, setCurrentGameweek] = useState<any>({})
    const [currentPlayer, setCurrentPlayer] = useState<any>({})
    const [currentViewedGame, setCurrentViewedGame] = useState<any>({})
    const [league, setLeague] = useState<any>({ name: '', games: [] })
    const [gamesInLeague, setAllGamesInCurrentLeague] = useState<any>({})
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const [loaded, setLoaded] = useState<any>(false)
    const [selectionTimeEnded, setSelectionTimeEnded] = useState(false)

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
                console.log(league, 'lea')
                console.log(snapshot.val(), 'a 123')
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
                    currentRound={currentGameRound}
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
            <ScrollView>
                <ContainerWithHeaderShown>
                    <InnerWithHeaderShown>
                        <LeagueNameAndLeagueTypeImage>
                            <H2>{league.name}</H2>
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
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <Text>Game Jackpot</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 45, fontWeight: 'bold' }}>£20</Text>
                                        </View>
                                    </View>
                                </TextContainer>
                                <TextContainer>
                                    <View>
                                        <Text style={{ marginBottom: 10 }}>
                                            Increase your jackpot now by inviting others to join this league!
                                        </Text>
                                        <Text style={{ marginBottom: 20 }}>
                                            Share this pin {league.joinPin} or simply click one of the apps below
                                        </Text>
                                        <Image
                                            source={require('../../images/other/whatsapp.png')}
                                            style={{ width: 40, height: 40 }}
                                        />
                                    </View>
                                </TextContainer>
                            </LeagueInformationWrapper>
                            <SelectionWrapper>
                                <LeagueRules />
                            </SelectionWrapper>
                        </Wrapper>
                    </InnerWithHeaderShown>
                </ContainerWithHeaderShown>
            </ScrollView>
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
