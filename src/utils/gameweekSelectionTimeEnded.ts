import { firebaseApp } from 'src/config'
// import getTime from 'date-fns/get_time'

export const gameweekSelectionTimeEnded = () => {
    // console.log("TIME:", getTime)
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
