import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getCurrentGameweekEndTime } from 'src/firebase-helpers'

export const getCurrentGameWeekInfo = createAsyncThunk('getCurrentGameWeekInfo', async () => {
    try {
        const time = await getCurrentGameweekEndTime()
        console.log(time, 't i m e')
        return time
    } catch (e) {
        console.log('errored getting time')
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
            console.log(action, ' the act is this')
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
