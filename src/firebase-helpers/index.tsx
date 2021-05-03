import * as RootNavigation from 'src/root-navigation'
import { firebaseAuth, firebaseDatabase } from '../../firebase.js'

export const getCurrentGameweekFixtures = () => {
  return firebaseDatabase
    .ref(`information/gameweek/current/matches`)
    .once('value')
    .then((snapshot: any) => {
      return snapshot.val()
    })
}

export const getUserInformation = ({ userId }) => {
  return firebaseDatabase
    .ref(`users/${userId}`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val()
    })
}

export const getUserLeagues = ({ userId }: any) => {
  return firebaseDatabase
    .ref(`users/${userId}/leagues`)
    .once('value')
    .then((snapshot) => {
      if (snapshot.val()) {
        return Object.values(snapshot.val())
      }
      return []
    })
    .catch((e) => console.error('ERROR:', e))
}

export const logUserInToApplication = async ({ email, password }: any) => {
  const res = await firebaseAuth().signInWithEmailAndPassword(email, password)
  return res
}

export const signUserUpToApplication = async ({ email, password, name, surname }: any) => {
  const r = await firebaseAuth().createUserWithEmailAndPassword(email, password)
  return r
}

export const writeUserToDatabase = async ({ name, surname, user }) => {
  const result = await firebaseDatabase.ref(`users/${user.uid}`).update({ name, surname, id: user.uid })
  return result
}

export const signUserOutOfApplication = () => {
  return firebaseAuth()
    .signOut()
    .then(() => {
      RootNavigation.navigate('Leagues', { userInitiatedSignOut: true })
    })
    .catch((e) => e)
}

export const getLeagueCreatorInformation = (userId: string) => {
  try {
    return firebaseDatabase
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
  return firebaseDatabase.ref().update(leagueAndUserData, (error) => {
    if (error) {
      alert('Failed to join league, please try again.')
    } else {
      navigation.navigate('League', { leagueId: league.id })
    }
  })
}

export const attemptToJoinLeaugeIfItExists = ({ currentUserId, leaguePin }: any) => {
  return firebaseDatabase
    .ref(`users/${currentUserId}`)
    .once('value')
    .then((snapshot) => {
      const { name, surname } = snapshot.val()
      return firebaseDatabase
        .ref(`leagues`)
        .once('value')
        .then((snapshot) => {
          const allLeagues = Object.values(snapshot.val())
          const foundLeague = allLeagues.find((league: any) => league.joinPin === leaguePin)
          if (foundLeague) {
            return {
              league: foundLeague,
              name,
              surname,
            }
          } else {
            alert('League not found, please try again or contact league admin')
          }
        })
    })
}
