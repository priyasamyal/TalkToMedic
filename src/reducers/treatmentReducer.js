
import { constant } from '../common/index';
export default (state = [], action) => {
 //   console.log("reducer", state, action)
    switch (action.type) {
        case constant.SET_TREATMENT:
            state = action.payload
            return state;

        default:
            return state
    }

}