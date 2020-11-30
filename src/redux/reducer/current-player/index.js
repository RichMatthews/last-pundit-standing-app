import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues } from 'src/firebase-helpers'

// export const getCurrentGame = createAsyncThunk('getCurrentGame', async ({ setUserLeaguesFetchComplete, userId }) => {
//     try {
//         const leagues = await getUserLeagues({ setUserLeaguesFetchComplete, userId })
//         return leagues
//     } catch (e) {
//         console.log('errored getting user')
//     }
// })

const currentPlayerSlice = createSlice({
    name: 'currentPlayer',
    initialState: {},
    reducers: {
        setCurrentPlayer: (state, action) => {
            console.log('ACTION HERE::::...:::', action.payload.currentPlayer)
            state = { ...state, ...action.payload.currentPlayer }
            return state
        },
    },
    extraReducers: {
        // [getCurrentGame.pending]: (state, action) => {
        //     console.log('pending!')
        //     state = state
        // },
        // [getCurrentGame.fulfilled]: (state, action) => {
        //     console.log(action.payload, 'act?')
        //     state.push(...action.payload)
        // },
        // [getCurrentGame.rejected]: (state, action) => {
        //     console.log('there was a rejection')
        //     return state
        // },
    },
})

const { actions, reducer } = currentPlayerSlice
export const { setCurrentPlayer } = actions
export default reducer
