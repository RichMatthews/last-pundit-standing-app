import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserLeagues, signUserOutOfApplication } from 'src/firebase-helpers'

export const getLeagues = createAsyncThunk('getLeagues', async ({ setUserLeaguesFetchComplete, userId }) => {
    try {
        const leagues = await getUserLeagues({ setUserLeaguesFetchComplete, userId })
        return leagues
    } catch (e) {
        console.log('errored getting user')
    }
})

export const signUserOut = createAsyncThunk('signUserOut', async () => {
    try {
        const user = await signUserOutOfApplication()
        return user
    } catch (e) {
        console.log(e, 'e')
        console.log('errored logging out')
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

        [signUserOut.pending]: (state, action) => {
            console.log('pending!')
            state = state
        },
        [signUserOut.fulfilled]: (state, action) => {
            return []
        },
        [signUserOut.rejected]: (state, action) => {
            console.log('there was a rejection')
            return state
        },
    },
})

const { actions, reducer } = leagueSlice
// export const { getUserLeagues } = actions
export default reducer
