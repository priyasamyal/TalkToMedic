
import { constant } from '../common/index';
const initialState = {};
export default (state = initialState, action) => {
    console.log(action, "action...");
    switch (action.type) {
        case constant.SET_SESSION:
            state = action.payload
            return state;

        default:
            return state
    }

}