import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserLeagues, signUserOutOfApplication } from 'src/firebase-helpers'

export const getLeagues = createAsyncThunk('getLeagues', async (userId) => {
    try {
        const leagues = await getUserLeagues({ userId })
        return leagues
    } catch (e) {
        console.log('errored getting user')
    }
})

export const signUserOut = createAsyncThunk('signUserOut', async () => {
    try {
        await AsyncStorage.setItem('signOutTimeStamp', Date.now().toString())
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
