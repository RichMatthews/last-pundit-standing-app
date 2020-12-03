import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getUserInformation } from 'src/firebase-helpers'

export const getCurrentUser = createAsyncThunk('getCurrentUser', async ({ userId }) => {
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
    },
})

const { actions, reducer } = userSlice
// export const { getUserLeagues2 } = actions
export default reducer
