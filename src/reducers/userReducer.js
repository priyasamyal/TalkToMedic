import { constant } from '../common/index';

import { getItem, setItem } from '../common/user';

// let user = JSON.parse(localStorage.getItem('user'));
// const initialState = user ? { loggedIn: true, user } : {};
const initialState = {
    vDeviceToken: '',
    vMobileNo: '',
    iCountryCode: '',
    vOtp: '',
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    address: '',
    profile_image: '',
    password: '',
    height: '',
    weight: '',
    zip_code: '',
    aadhaar_id: '',
    is_logged_in: false,
    is_registered: false,
    iRoleId: '',
    fLatitude: '30.7162',
    fLongitude: '76.7776',
    userData: {},
    app_version: ""
};

getItem(['user_details']).then(
    res => {
       // console.log("storage", res)
       // console.log(JSON.parse(res[0][1]), "json,,")
        if (res) {
            if (JSON.parse(res[0][1])) {
                initialState.userData = JSON.parse(res[0][1]);
            }

        }
    }, err => {
        console.log(err)
    })

// const INITIAL_STATE = {
//     isLoggedIn: false,
//     isLoading: false,
//     userData: {
//         vDeviceToken: '',
//         vMobileNo: '123',
//         vCountryCode: '',
//         vOtp: '',
//         first_name: '',
//         last_name: '',
//         gender: '',
//         dob: '',
//         address: '',
//         profile_image: '',
//         password: '',
//         height: '',
//         weight: '',
//         zip_code: '',
//         aadhaar_id: '',
//         iRoleId: ''
//     },
//     error: undefined
// }
export default (state = initialState, action) => {
   // console.log(action, "action...");
    switch (action.type) {
        case constant.SET_USER:
            return {
                ...state,
                iCountryCode: action.payload.iCountryCode,
                vMobileNo: action.payload.vMobileNo,
            };
        case constant.SET_OTP:
            return {
                ...state,
                vOtp: action.payload.otp,
            };
        case constant.SET_DEVICE_TOKEN:
           // console.log("in", action)
            return {
                ...state,
                vDeviceToken: action.payload,
            };
        case constant.SET_USER_TYPE:
            //console.log("in", action)
            return {
                ...state,
                iRoleId: action.payload,
            };

        case constant.SET_USER_DATA:
           // console.log("SET_USER_DATA", action);
            setItem('user_details', JSON.stringify(action.payload)).then(
                res => {
                    console.log(res, "Storage Set for User Data.....")
                    if (res) {
                        console.log(res, "setItem");
                    }
                },
                err => {
                    console.log(err, "set err")
                },
            );
            return {
                ...state,
                userData: action.payload
                    //  action,
            };

        case constant.REMOVE_USER:
            return {
                ...state,
                userData: {},
            };
        case constant.SETLOCATION:
            return {
                ...state,
                fLatitude: action.payload.lat,
                fLongitude: action.payload.lng
            };
            // case CLEAR_COUNTER:
            //     return 0
            // case SET_COUNTER:
            //     return action.payload
        case constant.SET_APPVERSION:
            return {
                ...state,
                app_version: action.payload,
            };
        default:
            return state
    }

}