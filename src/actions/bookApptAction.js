import { constant } from '../common/index';
export const setProblems = (data) => {
    return {
        type: constant.SET_PROBLEMS,
        payload: data
    }
}

export const setDateTime = (data) => {
    return {
        type: constant.SET_APPT_DATE_TIME,
        payload: data
    }
}

export const apptType = (data) => {
    return {
        type: constant.SET_APPT_TYPE,
        payload: data
    }
}

