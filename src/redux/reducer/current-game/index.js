import { createSlice } from '@reduxjs/toolkit'

const currentGameSlice = createSlice({
  name: 'currentGame',
  initialState: {},
  reducers: {
    getCurrentGame: (state, action) => {
      return { ...state, ...action.payload.currentGame }
    },
  },
  extraReducers: {},
})

const { actions, reducer } = currentGameSlice
export const { getCurrentGame } = actions
export default reducer
