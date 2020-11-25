
import { constant } from '../common/index';
export default (state = [], action) => {
    switch (action.type) {
        case constant.SET_SPECIALITY:
            state = action.payload
            return state;
        default:
            return state
    }

}