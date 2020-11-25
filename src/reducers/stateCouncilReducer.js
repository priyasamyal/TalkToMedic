
import { constant } from '../common/index';
export default (state_council = [], action) => {
   // console.log("reducer", action)
    switch (action.type) {
        case constant.SET_COUNCIL:
            state_council = action.payload
            return state_council;
        default:
            return state_council
    }

}