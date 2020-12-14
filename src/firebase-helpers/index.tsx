import * as RootNavigation from 'src/root-navigation'
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
    return firebaseApp
        .database()
        .ref(`information/gameweek/current`)
        .once('value')
        .then((snapshot) => {
            return snapshot.val().endsReadable
        })
}

export const getUserInformation = ({ userId }) => {
    return firebaseApp
        .database()
        .ref(`users/${userId}`)
        .once('value')
        .then((snapshot) => {
            return snapshot.val()
        })
}

export const updateUserGamweekChoice = ({ choice, currentRound, currentGame, league, userId }: any) => {
    return firebaseApp
        .database()
        .ref(`leagues/${league.id}/games/${currentGame.id}/players/${userId}/rounds/${currentRound}`)
        .update({ choice }, (error) => {
            if (error) {
                alert('Oops something went wrong. Please try again or contact admin')
            }
        })
}

export const getUserLeagues = ({ userId }: any) => {
    return firebaseApp
        .database()
        .ref(`users/${userId}/leagues`)
        .once('value')
        .then((snapshot) => {
            if (snapshot.val()) {
                return Object.values(snapshot.val())
            }
            return []
        })
        .catch((e) => console.log('ERROR:', e))
}

export const logUserInToApplication = async ({ email, password }: any) => {
    const res = await firebaseApp.auth().signInWithEmailAndPassword(email, password)
    return res
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
    return firebaseApp
        .auth()
        .signOut()
        .then(() => {
            RootNavigation.navigate('Leagues', { userInitiatedSignOut: true })
        })
        .catch((e) => e)
}

export const getLeagueCreatorInformation = (userId: string) => {
    try {
        return firebaseApp
            .database()
            .ref(`/users/${userId}`)
            .once('value')
            .then((snapshot) => {
                const playerName: any = snapshot.val().name.trim() + ' ' + snapshot.val().surname.trim()
                return {
                    id: userId,
                    name: playerName,
                }
            })
    } catch (e) {
        console.error('EEEE:', e)
    }
}

export const joinLeagueAndAddLeagueToListOfUserLeagues = ({ league, leagueAndUserData, navigation }) => {
    return firebaseApp
        .database()
        .ref()
        .update(leagueAndUserData, (error) => {
            if (error) {
                alert('Failed to join league, please try again.')
            } else {
                navigation.navigate('My Leagues', { id: league.id })
            }
        })
}

export const attemptToJoinLeaugeIfItExists = ({ currentUserId, leaguePin }: any) => {
    return firebaseApp
        .database()
        .ref(`users/${currentUserId}`)
        .once('value')
        .then((snapshot) => {
            const { name, surname } = snapshot.val()
            return firebaseApp
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
        })
}

export const pullLeagueData = ({ leagueId }) => {
    return firebaseApp
        .database()
        .ref(`leagues/${leagueId}`)
        .once('value')
        .then((snapshot) => {
            return snapshot.val()
        })
        .catch((e) => {
            console.log(e)
            console.log('error somewhere pulling', e)
        })
}
