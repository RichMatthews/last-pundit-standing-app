import React from 'react'
import Toast from 'react-native-toast-message'

export const ToastMessage = () => {
    return <Toast ref={(ref) => Toast.setRef(ref)} />
}
