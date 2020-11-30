import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues } from 'src/firebase-helpers'

export const getCurrentGame = createAsyncThunk('getCurrentGame', async ({ setUserLeaguesFetchComplete, userId }) => {
    try {
        const leagues = await getUserLeagues({ setUserLeaguesFetchComplete, userId })
        return leagues
    } catch (e) {
        console.log('errored getting user')
    }
})

const viewingLeagueSlice = createSlice({
    name: 'currentGame',
    initialState: { league: {} },
    reducers: {},
    extraReducers: {
        [getCurrentGame.pending]: (state, action) => {
            console.log('pending!')
            state = state
        },
        [getCurrentGame.fulfilled]: (state, action) => {
            console.log(action.payload, 'act?')
            state.push(...action.payload)
        },
        [getCurrentGame.rejected]: (state, action) => {
            console.log('there was a rejection')
            return state
        },
    },
})

const { actions, reducer } = viewingLeagueSlice
// export const { getUserLeagues } = actions
export default reducer
