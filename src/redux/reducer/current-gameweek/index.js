import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getCurrentGameweekEndTime } from 'src/firebase-helpers'

export const getCurrentGameWeekInfo = createAsyncThunk('getCurrentGameWeekInfo', async () => {
    try {
        console.log('trying')
        const time = await getCurrentGameweekEndTime()
        console.log('after')
        console.log('tIME:', time)
        return time
    } catch (e) {
        console.log('errored getting time')
    }
})

const currentGameweekSlice = createSlice({
    name: 'currentGameweek',
    initialState: { ends: '' },
    reducers: {},
    extraReducers: {
        [getCurrentGameWeekInfo.pending]: (state, action) => {
            state = state
        },
        [getCurrentGameWeekInfo.fulfilled]: (state, action) => {
            console.log(action, 'the actyon')
            state = { ...state, ends: action.payload }
            return state
        },
        [getCurrentGameWeekInfo.rejected]: (state, action) => {
            return state
        },
    },
})

const { actions, reducer } = currentGameweekSlice
// export const { getCurrentGameweekInformation } = actions
export default reducer
