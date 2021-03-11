import { firebaseDatabase } from 'app/firebase'

export const updateUserGamweekChoice = ({ selection, leagueId, gameId, playerId, roundId }: any) => {
  return firebaseDatabase
    .ref(`leagues/${leagueId}/games/${gameId}/players/${playerId}/rounds/${roundId}`)
    .update({ selection }, (error) => {
      console.log('did it update?')
      if (error) {
        console.log('Error:', error)
      }
    })
}
