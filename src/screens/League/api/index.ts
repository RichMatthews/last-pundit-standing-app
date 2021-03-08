import { firebaseAuth, firebaseDatabase } from '../../../../firebase.js'

export const pullLeagueData = ({ leagueId }) => {
  return firebaseDatabase
    .ref(`leagues/${leagueId}`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val()
    })
    .catch((e) => {
      console.error(e)
    })
}

export const getCurrentGameweekFixtures = () => {
  return firebaseDatabase
    .ref('information/gameweek/current/matches')
    .once('value')
    .then((snapshot: any) => {
      return snapshot.val()
    })
}
