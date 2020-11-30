import { configureStore } from '@reduxjs/toolkit'
import { createStore, compose } from 'redux'
import devToolsEnhancer from 'remote-redux-devtools'
import { composeWithDevTools } from 'redux-devtools-extension'
import leaguesReducer from '../reducer/leagues'
import userReducer from '../reducer/user'
import currentGameReducer from '../reducer/current-game'
import currentPlayerReducer from '../reducer/current-player'

// import { createDebugger } from 'react-native-debugger'

// const store = configureStore({
//     reducer: {
//         leagues: leaguesReducer,
//     },
//     devTools: true,
//     enhancers: [devToolsEnhancer({ realtime: true })],
// })

const enhancers = composeWithDevTools(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const store = configureStore({
    reducer: {
        currentGame: currentGameReducer,
        currentPlayer: currentPlayerReducer,
        leagues: leaguesReducer,
        user: userReducer,
    },
})
// const store = configureStore({leagues: leaguesReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
export default store
