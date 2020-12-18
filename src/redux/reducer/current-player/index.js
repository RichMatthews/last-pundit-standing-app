import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues } from 'src/firebase-helpers'

const currentPlayerSlice = createSlice({
    name: 'currentPlayer',
    initialState: {},
    reducers: {
        setCurrentPlayer: (state, action) => {
            state = { ...state, ...action.payload.currentPlayer }
            return state
        },
    },
    extraReducers: {},
})

const { actions, reducer } = currentPlayerSlice
export const { setCurrentPlayer } = actions
export default reducer
