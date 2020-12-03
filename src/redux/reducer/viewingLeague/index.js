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
            state = state
        },
        [getCurrentGame.fulfilled]: (state, action) => {
            state.push(...action.payload)
        },
        [getCurrentGame.rejected]: (state, action) => {
            return state
        },
    },
})

const { actions, reducer } = viewingLeagueSlice
// export const { getUserLeagues } = actions
export default reducer
