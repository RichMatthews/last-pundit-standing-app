import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { LeagueInfo } from 'src/components/league/screen-views/info'
import { CurrentGame } from 'src/components/league/screen-views/current'
import { PreviousGames } from 'src/components/league/screen-views/previous'
import { ScreenSelection } from 'src/components/league/screen-selection'

import { firebaseApp } from 'src/config.js'
import { PREMIER_LEAGUE_TEAMS } from 'src/teams'

import { H2 } from 'src/ui-components/headings'
import { getCurrentGame } from 'src/redux/reducer/current-game'
import { setCurrentPlayer } from 'src/redux/reducer/current-player'

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

export const League = ({ leagueId }: any) => {
    const [currentScreenView, setCurrentScreenView] = useState('game')
    const [currentGame, setCurrentGame] = useState<any>({})
    const [currentGameweek, setCurrentGameweek] = useState<any>({})
    const [league, setLeague] = useState<any>({ name: '', games: [] })
    const [gamesInLeague, setAllGamesInCurrentLeague] = useState<any>({})
    const [listOfExpandedPrevious, setListOfExpandedPrevious] = useState<any>([])
    const [loaded, setLoaded] = useState<any>(false)
    const [refreshing, setRefreshing] = useState(false)
    const dispatch = useDispatch()
    const currentUser = useSelector((store: { user: any }) => store.user)

    const pullLatestLeagueData = () => {
        return firebaseApp
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
                        const players = Object.values(currentGame.players)
                        const currentPlayer = players.find((player: any) => player.id === currentUser.id)

                        dispatch(getCurrentGame({ currentGame }))
                        setAllGamesInCurrentLeague(transformPayloadIntoUsableObject.games)
                        setLeague(transformPayloadIntoUsableObject)
                        console.log('CURRENTPLAYER:::', currentPlayer)
                        if (!currentPlayer) {
                            // return history.push('/home')
                            return
                        }
                        dispatch(setCurrentPlayer({ currentPlayer }))
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
            .catch((e) => {
                console.log(e)
                console.log('error somewhere pulling')
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
                league={league}
                listOfExpandedPrevious={listOfExpandedPrevious}
                setListOfExpandedPrevious={setListOfExpandedPrevious}
                pullLatestLeagueData={pullLatestLeagueData}
                //props to grab from redux instead
                currentGame={currentGame}
                currentGameweek={currentGameweek}
                gamesInLeague={gamesInLeague}
                loaded={loaded}
                currentScreenView={currentScreenView}
                refreshing={refreshing}
                setRefreshing={setRefreshing}
                setCurrentScreenView={setCurrentScreenView}
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
