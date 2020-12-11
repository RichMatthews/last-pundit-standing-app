import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues } from 'src/firebase-helpers'

const currentGameSlice = createSlice({
    name: 'currentGame',
    initialState: {},
    reducers: {
        getCurrentGame: (state, action) => {
            return { ...state, ...action.payload.currentGame }
        },
    },
    extraReducers: {
        // [getCurrentGame.pending]: (state, action) => {
        //     console.log('pending!')
        //     state = state
        // },
        // [getCurrentGame.fulfilled]: (state, action) => {
        //     state.push(...action.payload)
        // },
        // [getCurrentGame.rejected]: (state, action) => {
        //     console.log('there was a rejection')
        //     return state
        // },
    },
})

const { actions, reducer } = currentGameSlice
export const { getCurrentGame } = actions
export default reducer
