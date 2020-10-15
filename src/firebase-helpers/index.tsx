import { firebaseApp } from '../config.js'

export const getCurrentGameweekFixtures = () => {
    return new Promise((res, rej) => {
        res(
            firebaseApp
                .database()
                .ref(`information/gameweek/current/matches`)
                .once('value')
                .then((snapshot: any) => {
                    return snapshot.val()
                }),
        )
    })
}

export const getCurrentGameweekEndTime = () => {
    firebaseApp
        .database()
        .ref(`information/gameweek/current`)
        .once('value')
        .then((snapshot) => {
            return snapshot.val().ends
        })
}

export const updateUserGamweekChoice = ({
    choice,
    currentRound,
    currentUserId,
    gameId,
    leagueId,
    pullLatestLeagueData,
}: any) => {
    firebaseApp
        .database()
        .ref(`leagues/${leagueId}/games/${gameId}/players/${currentUserId}/rounds/${currentRound}`)
        .update({ choice }, (error) => {
            if (error) {
                alert('Oops something went wrong. Please try again or contact admin')
            } else {
                pullLatestLeagueData()
            }
        })
}

export const getUserLeagues = ({ userId }: any) => {
    return new Promise((res: any, rej: any) => {
        res(
            firebaseApp
                .database()
                .ref(`users/${userId}/leagues`)
                .once('value')
                .then((snapshot) => {
                    if (snapshot.val()) {
                        return Object.values(snapshot.val())
                    }
                    return []
                }),
        )
    })
}

export const logUserInToApplication = ({ email, password, navigation, setError, setUserExists }: any) => {
    firebaseApp
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
            // navigation.navigate('Leagues', { screen: 'My Leagues' })
            setUserExists(true)
        })
        .catch((error) => {
            setError(error.message)
        })
}

export const signUserUpToApplication = (
    email: string,
    password: string,
    name: string,
    setError: any,
    surname: string,
) => {
    firebaseApp
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res: any) => {
            localStorage.setItem('authUser', JSON.stringify(res))
            firebaseApp
                .database()
                .ref(`users/${res.user.uid}`)
                .update({ name, surname, id: res.user.uid }, (error) => {
                    if (error) {
                        alert('Failed to sign up, please try again.')
                    } else {
                        window.location.reload()
                    }
                })
        })
        .catch((error) => {
            setError(error.message)
        })
}

export const signUserOutOfApplication = () => {
    firebaseApp
        .auth()
        .signOut()
        .then(() => {
            window.localStorage.removeItem('authUser')
            window.location.reload()
        })
        .catch((e) => console.log(e))
}

export const getLeagueCreatorInformation = (userId: string) => {
    return new Promise((res, rej) => {
        res(
            firebaseApp
                .database()
                .ref(`/users/${userId}`)
                .once('value')
                .then((snapshot) => {
                    const playerName: any = snapshot.val().name + ' ' + snapshot.val().surname
                    return {
                        id: userId,
                        name: playerName,
                    }
                }),
        )
    })
}

export const joinLeagueAndAddLeagueToListOfUserLeagues = (history: any, league: any, leagueAndUserData: any) => {
    firebaseApp
        .database()
        .ref()
        .update(leagueAndUserData, (error) => {
            if (error) {
                alert('Failed to join league, please try again.')
            } else {
                history.push(`/leagues/${league.id}`)
            }
        })
}

export const attemptToJoinLeaugeIfItExists = ({ currentUserId, leaguePin }: any) => {
    return new Promise((res, rej) => {
        res(
            firebaseApp
                .database()
                .ref(`users/${currentUserId}`)
                .once('value')
                .then((snapshot) => {
                    const { name, surname } = snapshot.val()
                    firebaseApp
                        .database()
                        .ref(`leagues`)
                        .once('value')
                        .then((snapshot) => {
                            const allLeagues = Object.values(snapshot.val())
                            const foundLeague = allLeagues.filter((league: any) => league.joinPin === leaguePin)
                            if (foundLeague.length) {
                                return {
                                    league: foundLeague[0],
                                    name,
                                    surname,
                                }
                            } else {
                                alert('League not found, please try again or contact league admin')
                            }
                        })
                }),
        )
    })
}
