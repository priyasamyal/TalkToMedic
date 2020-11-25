
import { constant } from '../common/index';
const initialState = {
    treatments: [],
    vLat: '',
    vLng: '',
    dScheduledDate: '',
    dTime: '',
    eMode: '',
    ePurpose: '',
    iFamilyMemberId: '',
    eType: ''
};
export default (state = initialState, action) => {
    console.log(action, "action...");
    switch (action.type) {
        case constant.SET_PROBLEMS:
            return {
                ...state,
                treatments: action.payload.treatments,
                vLat: action.payload.vLat,
                vLng: action.payload.vLng,
            };

        case constant.SET_APPT_DATE_TIME:
            return {
                ...state,
                dScheduledDate: action.payload.dScheduledDate,
                dTime: action.payload.dTime,
                eMode: action.payload.eMode,
                ePurpose: action.payload.ePurpose,
                iFamilyMemberId: action.payload.iFamilyMemberId,
                eType: action.payload.eType,
            };

        case constant.SET_APPT_TYPE:
            return {
                ...state,
                //    eType: action.payload,
                dTime: action.payload.dTime,
                dScheduledDate: action.payload.dScheduledDate,
                iUserId: action.payload.iUserId,
                fFirstConsultFee: action.payload.fFirstConsultFee,
                fFollowConsultFee: action.payload.fFollowConsultFee,
                iFirstConsultDuration: action.payload.iFirstConsultDuration,
                iFollowConsultDuration: action.payload.iFollowConsultDuration,
            };
        default:
            return state
    }

}