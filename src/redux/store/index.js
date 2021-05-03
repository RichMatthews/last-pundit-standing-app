import { configureStore } from '@reduxjs/toolkit'

import currentGameweekReducer from '../reducer/current-gameweek'
import currentGameReducer from '../reducer/current-game'
import currentPlayerReducer from '../reducer/current-player'
import themeReducer from '../reducer/theme'
import userLeaguesReducer from '../reducer/leagues'
import userReducer from '../reducer/user'
import viewingLeagueReducer from '../reducer/league'
import pushNotificationsReducer from '../reducer/push-notifications'

const store = configureStore({
  reducer: {
    currentGame: currentGameReducer,
    game: currentGameweekReducer,
    currentPlayer: currentPlayerReducer,
    theme: themeReducer,
    league: viewingLeagueReducer,
    pushNotifications: pushNotificationsReducer,
    user: userReducer,
    userLeagues: userLeaguesReducer,
  },
})

export default store
