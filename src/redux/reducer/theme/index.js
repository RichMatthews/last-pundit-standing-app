import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
    name: 'theme',
    initialState: 'light',
    reducers: {
        setTheme: (state, action) => {
            state = action.payload
            return state
        },
    },
    extraReducers: {},
})

const { actions, reducer } = themeSlice
export const { setTheme } = actions
export default reducer
