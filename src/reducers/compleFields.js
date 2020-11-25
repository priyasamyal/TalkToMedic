
import { constant } from '../common/index';

const param = {
    bAccountDetails: true,
    bAvailability: true,
    bPracticeDetails: true,
    bProfileDetails: true
};
export default (state = param, action) => {
    //console.log("reducer", state, action)
    switch (action.type) {
        case constant.SET_COMPLETENESS:
            state = action.payload
            return state;
        default:
            return state
    }

}