import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getCurrentGameweekEndTime } from 'src/firebase-helpers'

export const getCurrentGameWeekInfo = createAsyncThunk('getCurrentGameWeekInfo', async () => {
    try {
        const time = await getCurrentGameweekEndTime()
        return time
    } catch (e) {
        console.error('errored getting time')
    }
})

const currentGameweekSlice = createSlice({
    name: 'currentGameweek',
    initialState: { ends: '', endsReadable: '' },
    reducers: {},
    extraReducers: {
        [getCurrentGameWeekInfo.pending]: (state, action) => {
            state = state
        },
        [getCurrentGameWeekInfo.fulfilled]: (state, action) => {
            state = { ...state, ends: action.payload.ends, endsReadable: action.payload.endsReadable }
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
