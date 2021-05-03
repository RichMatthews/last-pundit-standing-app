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
  // .ref('information/gameweeks')
  return firebaseDatabase
    .ref('/information/gameweek/current/matches')
    .once('value')
    .then((snapshot: any) => {
      return snapshot.val()
      // return Object.values(snapshot.val()).find((gw) => gw.current).matches
    })
}

export const getFutureGameweekInformation = () => {
  return firebaseDatabase
    .ref('information/gameweek/future')
    .once('value')
    .then((snapshot: any) => {
      return snapshot.val()
    })
}
