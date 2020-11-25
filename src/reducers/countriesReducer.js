import { constant } from '../common/index';
// let user = JSON.parse(localStorage.getItem('user'));
// const initialState = user ? { loggedIn: true, user } : {};
export default (state = [{
    iStateid: '1',
    vStateName: "Punjab",
}], action) => {
    // console.log("reducer", state, action)
    switch (action.type) {
        case constant.SET_COUNTRIES:
            state = action.payload
            return state;
            // case DECREMENT_COUNTER:
            //     return state - 1
            // case CLEAR_COUNTER:
            //     return 0
            // case SET_COUNTER:
            //     return action.payload
        default:
            return state
    }

}