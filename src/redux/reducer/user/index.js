import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserInformation } from 'src/firebase-helpers'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { signUserOut } from '../leagues'

export const getCurrentUser = createAsyncThunk('getCurrentUser', async (user) => {
    try {
        const userInfo = await getUserInformation({ userId: user.uid })
        await AsyncStorage.setItem('lastLogin', Date.now().toString())
        return userInfo
    } catch (e) {
        console.log('errored getting user')
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {},
    extraReducers: {
        [getCurrentUser.fulfilled]: (state, action) => {
            state = { ...state, ...action.payload }
            return state
        },

        [signUserOut.fulfilled]: (state, action) => {
            return {}
        },
    },
})

const { actions, reducer } = userSlice
// export const { getUserLeagues2 } = actions
export default reducer
