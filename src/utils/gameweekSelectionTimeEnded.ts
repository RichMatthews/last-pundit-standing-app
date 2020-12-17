import { firebaseApp } from 'src/config'

export const gameweekSelectionTimeEnded = () => {
    return firebaseApp
        .database()
        .ref(`information`)
        .once('value')
        .then((snapshot) => {
            console.log('NOW:::', snapshot.val().gameweek.current.ends)
            if (Math.ceil(Date.now() / 1000) > snapshot.val().gameweek.current.ends) {
                return true
            }
            return false
        })
}
