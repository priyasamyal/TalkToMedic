
import { constant } from '../common/index';
export default (family_relation = [], action) => {
    //console.log("reducer", family_relation, action)
    switch (action.type) {
        case constant.SET_RELATION:
            family_relation = action.payload
            return family_relation;
        default:
            return family_relation
    }

}