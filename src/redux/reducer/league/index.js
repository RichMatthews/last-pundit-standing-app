import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues } from 'src/firebase-helpers'

const leagueSlice = createSlice({
    name: 'league',
    initialState: {},
    reducers: {
        setViewedLeague: (state, action) => {
            state = { ...state, ...action.payload }
            return state
        },
    },
    extraReducers: {},
})

const { actions, reducer } = leagueSlice
export const { setViewedLeague } = actions
export default reducer
