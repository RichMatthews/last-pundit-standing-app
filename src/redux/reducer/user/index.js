import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserInformation, logUserInToApplication } from 'src/firebase-helpers'

import { signUserOut } from '../leagues'

export const getCurrentUser = createAsyncThunk('getCurrentUser', async (userId) => {
    console.log(userId, 'uid')
    try {
        const userInfo = await getUserInformation({ userId })
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
