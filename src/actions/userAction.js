import { constant } from '../common/index';
export const setUser = (user) => {
    return {
        type: constant.SET_USER,
        payload: user
    }
}

export const setOtp = (otp) => {
    return {
        type: constant.SET_OTP,
        payload: otp
    }
}

export const setDeviceToken = (token) => {
    return {
        type: constant.SET_DEVICE_TOKEN,
        payload: token
    }
}
export const setUserType = (user) => {
    return {
        type: constant.SET_USER_TYPE,
        payload: user
    }
}

export const setUserData = (user) => {
    return {
        type: constant.SET_USER_DATA,
        payload: user
    }
}

export const removeUser = () => {
    return {
        type: constant.REMOVE_USER,
    }
}

export const setLocation = (location) => {
    return {
        type: constant.SETLOCATION,
        payload: location
    }
}

export const setAppVersion = (version) => {
    return {
        type: constant.SET_APPVERSION,
        payload: version
    }
}
    // export const counterClear = () => {
    //     return {
    //         type: CLEAR_COUNTER
    //     }
    // }


// export const counterSet = (receive_number) => {
//     return {
//         type: SET_COUNTER,
//         payload: receive_number
//     }
// }