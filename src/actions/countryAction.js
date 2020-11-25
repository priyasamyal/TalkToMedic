import { constant } from '../common/index';
export const setStateList = (country_list) => {
    return {
        type: constant.SET_COUNTRIES,
        payload: country_list
    }
}

export const setTreatment = (treatments) => {
    return {
        type: constant.SET_TREATMENT,
        payload: treatments
    }
}

export const setCity = (city) => {
    return {
        type: constant.SET_CITY,
        payload: city
    }
}


export const setMember = (member) => {
    return {
        type: constant.SET_MEMBER,
        payload: member
    }
}


export const setStateCouncil = (data) => {
    return {
        type: constant.SET_COUNCIL,
        payload: data
    }
}

export const setSpeciality = (data) => {
    return {
        type: constant.SET_SPECIALITY,
        payload: data
    }
}

export const setSessionData = (data) => {
    return {
        type: constant.SET_SESSION,
        payload: data
    }
}
export const setRelation = (data) => {
    return {
        type: constant.SET_RELATION,
        payload: data
    }
}

export const setComplete = (data) => {
    return {
        type: constant.SET_COMPLETENESS,
        payload: data
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