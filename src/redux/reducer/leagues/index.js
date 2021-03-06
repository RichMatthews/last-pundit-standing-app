import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Keychain from 'react-native-keychain'

import { getUserLeagues, signUserOutOfApplication } from 'src/firebase-helpers'

export const getLeagues = createAsyncThunk('getLeagues', async (userId) => {
    try {
        const leagues = await getUserLeagues({ userId })
        return leagues
    } catch (e) {
        console.error('errored getting user in leagues')
    }
})

export const signUserOut = createAsyncThunk('signUserOut', async () => {
    try {
        await AsyncStorage.setItem('signOutTimeStamp', Date.now().toString())
        await AsyncStorage.setItem('faceIdStatus', '')
        await Keychain.resetInternetCredentials('firebase')
        const user = await signUserOutOfApplication()
        return user
    } catch (e) {
        console.error('errored logging out')
    }
})

const leagueSlice = createSlice({
    name: 'leagues',
    initialState: {
        loading: false,
        leagues: [],
    },
    reducers: {},
    extraReducers: {
        [getLeagues.pending]: (state, action) => {
            state = {
                ...state,
                loading: true,
            }
            return state
        },
        [getLeagues.fulfilled]: (state, action) => {
            state = {
                loading: false,
                leagues: action.payload,
            }
            return state
        },
        [getLeagues.rejected]: (state, action) => {
            return state
        },

        [signUserOut.pending]: (state, action) => {
            state = {
                ...state,
                loading: true,
            }
        },
        [signUserOut.fulfilled]: (state, action) => {
            state = {
                loading: false,
                leagues: [],
            }
            return state
        },
        [signUserOut.rejected]: (state, action) => {
            return state
        },
    },
})

const { actions, reducer } = leagueSlice
// export const { getUserLeagues } = actions
export default reducer
