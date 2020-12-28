import { firebaseApp } from 'src/config'

export const gameweekSelectionTimeEnded = () => {
    return firebaseApp
        .database()
        .ref(`information`)
        .once('value')
        .then((snapshot) => {
            if (Math.ceil(Date.now()) > snapshot.val().gameweek.current.ends) {
                return true
            }
            return false
        })
}
