import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, SafeAreaView, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import { CurrentRoundView } from './current-round'
import { LeagueRules } from './league-rules'
import { ChooseTeam } from '../choose-team'
import { PageNotFound } from '../404'
import { Fixtures } from '../fixtures'
import { firebaseApp } from '../../config.js'

import { PREMIER_LEAGUE_TEAMS } from '../../teams'
import { H1, H2 } from '../../ui-components/headings'
import { Container } from '../../ui-components/containers'

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
    display: flex;
    flex-direction: column;
    padding: 10px;
`

const SelectionWrapper = styled(Section)`
    border-bottom-width: 5px;
    border-bottom-color: #ccc;
`

const CurrentRoundSelectionWrapper = styled(Section)`
    background: transparent;
    padding: 0;
`

const LeagueInformationWrapper = styled(SelectionWrapper)`
    display: flex;
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
    height: 30px;
    width: 100px;
`

const TeamSelectionText = styled.Text`
    margin-top: 20px;
`

const LeagueNameAndLeagueTypeImage = styled.View`
    background: #827ee6;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-top: 35px;
    width: 100%;
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
    const [currentScreenView, setCurrentScreenView] = useState('game')

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
        if (currentGame.currentRound === 0) {
            return PREMIER_LEAGUE_TEAMS
        } else {
            const allTeamsForThisLeague = PREMIER_LEAGUE_TEAMS
            let teamsAlreadyChosen: any = []
            currentPlayer.rounds.forEach((round: any) => {
                if (round.choice.value) {
                    teamsAlreadyChosen.push(round.choice.value)
                }
            })
            return allTeamsForThisLeague.filter((team) => !teamsAlreadyChosen.includes(team.value))
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

    const sharePin = () => {
        const shareOptions = {
            title: 'Share league pin with friends',
            message: `Hi, I'm inviting you to join my Last Pundit Standing league. here is the league code: ${league.joinPin}`,
            url: 'www.example.com',
            subject: 'Subject',
        }
        Share.share(shareOptions)
    }

    if (loaded === 'league-found') {
        return (
            <ScrollView>
                <SafeAreaView style={{ flex: 0.5, backgroundColor: '#827ee6' }} />
                <SafeAreaView style={{ flex: 0, backgroundColor: 'transparent' }}>
                    <Container>
                        <LeagueNameAndLeagueTypeImage>
                            <H2 style={{ color: '#fff', fontSize: 30, marginBottom: 5 }}>{league.name}</H2>
                            <LeagueTypeImage
                                source={require('../../images/other/premier-league.png')}
                                style={{ marginBottom: 20 }}
                            />
                        </LeagueNameAndLeagueTypeImage>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                padding: 10,
                                width: 350,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: currentScreenView === 'game' ? '#827ee6' : 'transparent',
                                    borderTopLeftRadius: 5,
                                    borderColor: '#827ee6',
                                    borderWidth: 2,
                                    borderBottomLeftRadius: 5,
                                    borderRightWidth: 0,
                                    padding: 5,
                                    width: '30%',
                                }}
                            >
                                <TouchableOpacity onPress={() => setCurrentScreenView('game')}>
                                    <Text
                                        style={{
                                            color: currentScreenView === 'game' ? '#fff' : '#000',
                                            fontSize: 17,
                                            textAlign: 'center',
                                        }}
                                    >
                                        GAME
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    backgroundColor: currentScreenView === 'info' ? '#827ee6' : 'transparent',
                                    borderTopRightRadius: 5,
                                    borderColor: '#827ee6',
                                    borderWidth: 2,
                                    borderBottomRightRadius: 5,
                                    borderLeftWidth: 0,
                                    padding: 5,
                                    width: '30%',
                                }}
                            >
                                <TouchableOpacity onPress={() => setCurrentScreenView('info')}>
                                    <Text
                                        style={{
                                            color: currentScreenView === 'info' ? '#fff' : '#000',
                                            fontSize: 17,
                                            textAlign: 'center',
                                        }}
                                    >
                                        INFO
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{
                                // borderTopWidth: 1,
                                // borderBottomWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                width: '100%',
                            }}
                        >
                            <Text style={{ fontSize: 17, fontWeight: '700', textAlign: 'center' }}>
                                <Text style={{ fontWeight: '400' }}>Round closes: </Text>
                                {currentGameweek.endsReadable}
                            </Text>
                        </View>
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
                            </SelectionWrapper>
                            <SelectionWrapper>
                                <Fixtures />
                            </SelectionWrapper>
                            <LeagueInformationWrapper>
                                <TextContainer>
                                    <View>
                                        <Text style={{ marginBottom: 10 }}>
                                            Increase your jackpot now by inviting others to join this league!
                                        </Text>
                                        <Text style={{ marginBottom: 20 }}>
                                            Share this pin {league.joinPin} or simply click one of the apps below
                                        </Text>
                                        <TouchableOpacity onPress={() => sharePin()}>
                                            <Image
                                                source={require('../../images/other/whatsapp.png')}
                                                style={{ width: 40, height: 40 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </TextContainer>
                            </LeagueInformationWrapper>
                            <SelectionWrapper>
                                <LeagueRules />
                            </SelectionWrapper>
                        </Wrapper>
                    </Container>
                </SafeAreaView>
            </ScrollView>
        )
    }

    if (loaded === 'no-league-found') {
        return <PageNotFound />
    }

    return (
        <Container style={{ marginTop: 100 }}>
            <ActivityIndicator size="large" color="#827ee6" />
            <Text style={{ fontSize: 20 }}>Retrieving League information...</Text>
        </Container>
    )
}
