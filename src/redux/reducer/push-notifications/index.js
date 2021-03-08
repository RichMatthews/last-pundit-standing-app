import { createSlice } from '@reduxjs/toolkit'

const pushNotificationsSlice = createSlice({
    name: 'league',
    initialState: {
        status: -1,
    },
    reducers: {
        pushNotificationsRejected: () => ({
            status: 0,
        }),
        pushNotificationsAccepted: () => ({
            status: 1,
        }),
        pushNotificationsProvisional: () => ({
            status: 2,
        }),
    },
    extraReducers: {},
})

const { actions, reducer } = pushNotificationsSlice
export const { pushNotificationsRejected, pushNotificationsAccepted, pushNotificationsProvisional } = actions
export default reducer
