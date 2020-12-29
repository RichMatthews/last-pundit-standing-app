import { configureStore } from '@reduxjs/toolkit'

import currentGameweekReducer from '../reducer/current-gameweek'
import currentGameReducer from '../reducer/current-game'
import currentPlayerReducer from '../reducer/current-player'
import themeReducer from '../reducer/theme'
import userLeaguesReducer from '../reducer/leagues'
import userReducer from '../reducer/user'
import viewingLeagueReducer from '../reducer/league'

const store = configureStore({
    reducer: {
        currentGame: currentGameReducer,
        currentGameweek: currentGameweekReducer,
        currentPlayer: currentPlayerReducer,
        theme: themeReducer,
        league: viewingLeagueReducer,
        user: userReducer,
        userLeagues: userLeaguesReducer,
    },
})

export default store
