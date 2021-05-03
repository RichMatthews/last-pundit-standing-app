import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { firebaseDatabase } from '../../../../firebase.js'

const getCurrentGameweekInfo = () => {
  return firebaseDatabase
    .ref('information')
    .once('value')
    .then((snapshot) => {
      return {
        all: Object.values(snapshot.val().gameweeks),
        current: Object.values(snapshot.val().gameweeks).find((gw) => gw.week === snapshot.val().current),
        viewing: Object.values(snapshot.val().gameweeks).find((gw) => gw.week === snapshot.val().current),
      }
    })
}

export const getCurrentGameWeekInfo = createAsyncThunk('getCurrentGameWeekInfo', async () => {
  try {
    const gameweekInformation = await getCurrentGameweekInfo()
    return gameweekInformation
  } catch (e) {
    console.error('errored getting time', e)
  }
})

const currentGameweekSlice = createSlice({
  name: 'currentGameweek',
  initialState: {},
  reducers: {
    setViewedFixtures: (state, action) => {
      state = { ...state, viewing: action.payload }
      return state
    },
  },
  extraReducers: {
    [getCurrentGameWeekInfo.pending]: (state, action) => {
      state = state
    },
    [getCurrentGameWeekInfo.fulfilled]: (state, action) => {
      state = { ...state, ...action.payload }
      return state
    },
    [getCurrentGameWeekInfo.rejected]: (state, action) => {
      return state
    },
  },
})

const { actions, reducer } = currentGameweekSlice
export const { setViewedFixtures } = actions
export default reducer
