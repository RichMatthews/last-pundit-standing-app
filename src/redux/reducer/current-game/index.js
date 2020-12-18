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
    extraReducers: {},
})

const { actions, reducer } = currentGameSlice
export const { getCurrentGame } = actions
export default reducer
