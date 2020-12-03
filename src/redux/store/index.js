import { configureStore } from '@reduxjs/toolkit'

import currentGameweekReducer from '../reducer/current-gameweek'
import currentGameReducer from '../reducer/current-game'
import currentPlayerReducer from '../reducer/current-player'
import userLeaguesReducer from '../reducer/leagues'
import userReducer from '../reducer/user'
import viewingLeagueReducer from '../reducer/league'

const store = configureStore({
    reducer: {
        currentGame: currentGameReducer,
        currentGameweek: currentGameweekReducer,
        currentPlayer: currentPlayerReducer,
        league: viewingLeagueReducer,
        user: userReducer,
        userLeagues: userLeaguesReducer,
    },
})

export default store
