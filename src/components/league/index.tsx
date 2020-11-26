import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, View } from 'react-native'

import { LeagueInfo } from './screen-views/info'
import { CurrentGame } from './screen-views/current'
import { PreviousGames } from './screen-views/previous'
import { ScreenSelection } from './screen-selection'

import { firebaseApp } from '../../config.js'
import { PREMIER_LEAGUE_TEAMS } from '../../teams'

import { H1, H2 } from '../../ui-components/headings'

const LeagueNameAndLeagueTypeImage = styled.View`
    background: #827ee6;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    padding-top: 15px;
    width: 100%;
`

const LeagueTypeImage = styled.Image`
    resize-mode: contain;
    height: 30px;
    width: 100px;
`

export const League = ({ currentUserId, leagueId }: any) => {
    const [currentScreenView, setCurrentScreenView] = useState('game')
    const [currentGame, setCurrentGame] = useState<any>({})
    const [currentGameweek, setCurrentGameweek] = useState<any>({})
    const [currentPlayer, setCurrentPlayer] = useState<any>({})
    const [currentViewedGame, setCurrentViewedGame] = useState<any>({})
    const [league, setLeague] = useState<any>({ name: '', games: [] })
    const [gamesInLeague, setAllGamesInCurrentLeague] = useState<any>({})
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const [loaded, setLoaded] = useState<any>(false)
    const [selectionTimeEnded, setSelectionTimeEnded] = useState(false)
    const [refreshing, setRefreshing] = useState(false)

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

    const determineScreenToRender = () => {
        if (currentScreenView === 'info') {
            return <LeagueInfo league={league} />
        } else if (currentScreenView === 'previous') {
            return <PreviousGames />
        }
        return (
            <CurrentGame
                currentUserId={currentUserId}
                leagueId={leagueId}
                currentGame={currentGame}
                currentGameweek={currentGameweek}
                currentPlayer={currentPlayer}
                currentViewedGame={currentViewedGame}
                league={league}
                gamesInLeague={gamesInLeague}
                listOfExpandedPrevious={listOfExpandedPrevious}
                loaded={loaded}
                selectionTimeEnded={selectionTimeEnded}
                currentScreenView={currentScreenView}
                refreshing={refreshing}
                pullLatestLeagueData={pullLatestLeagueData}
                setRefreshing={setRefreshing}
                setCurrentScreenView={setCurrentScreenView}
                calculateTeamsAllowedToPickForCurrentRound={calculateTeamsAllowedToPickForCurrentRound}
                setListOfExpandedPrevious={setListOfExpandedPrevious}
            />
        )
    }
    return (
        <View>
            <LeagueNameAndLeagueTypeImage>
                <H2 style={{ color: '#fff', fontSize: 30, marginBottom: 5 }}>{league.name}</H2>
                <LeagueTypeImage
                    source={require('../../images/other/premier-league.png')}
                    style={{ marginBottom: 20 }}
                />
            </LeagueNameAndLeagueTypeImage>

            <View
                style={{
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
            <ScreenSelection currentScreenView={currentScreenView} setCurrentScreenView={setCurrentScreenView} />
            <View>{determineScreenToRender()}</View>
        </View>
    )
}
