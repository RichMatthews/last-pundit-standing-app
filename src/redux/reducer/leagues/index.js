import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues } from 'src/firebase-helpers'

export const getLeagues = createAsyncThunk('getLeagues', async ({ setUserLeaguesFetchComplete, userId }) => {
    try {
        const leagues = await getUserLeagues({ setUserLeaguesFetchComplete, userId })
        return leagues
    } catch (e) {
        console.log('errored getting user')
    }
})

const leagueSlice = createSlice({
    name: 'league',
    initialState: [],
    reducers: {},
    extraReducers: {
        [getLeagues.pending]: (state, action) => {
            console.log('pending!')
            state = state
        },
        [getLeagues.fulfilled]: (state, action) => {
            console.log(action.payload, 'act?')
            state.push(...action.payload)
        },
        [getLeagues.rejected]: (state, action) => {
            console.log('there was a rejection')
            return state
        },
    },
})

const { actions, reducer } = leagueSlice
// export const { getUserLeagues } = actions
export default reducer
