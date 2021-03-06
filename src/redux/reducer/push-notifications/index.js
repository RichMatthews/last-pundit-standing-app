import { createSlice } from '@reduxjs/toolkit'

const pushNotificationsSlice = createSlice({
    name: 'league',
    initialState: {
        status: -1,
    },
    reducers: {
        acceptPushNotifications: () => ({
            status: 1,
        }),
        rejectPushNotifications: () => ({
            status: 3,
        }),
        setDeviceRegistered: () => ({
            status: 2,
        }),
    },
    extraReducers: {},
})

const { actions, reducer } = pushNotificationsSlice
export const { setViewedLeague } = actions
export default reducer
