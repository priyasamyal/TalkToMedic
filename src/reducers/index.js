import { combineReducers } from 'redux';
import countriesReducer from './countriesReducer';
import treatmentReducer from './treatmentReducer';
import userReducer from './userReducer';
import familyMemberReducer from './familyMemberReducer';
import cityReducer from './cityReducer';
import appintmentBookReducer from './appintmentBookReducer';
import stateCouncilReducer from './stateCouncilReducer';
import SpecialityReducer from './SpecialityReducer';
import SessionReducer from './SessionReducer';
import relationReducer from './relationReducer';
import compleFields from './compleFields';
export default combineReducers({
    states: countriesReducer,
    user: userReducer,
    treatments: treatmentReducer,
    city: cityReducer,
    family_member: familyMemberReducer,
    appointment_booking_data: appintmentBookReducer,
    state_council: stateCouncilReducer,
    specialities: SpecialityReducer,
    sessionData: SessionReducer,
    FAMILY_RELATIONS: relationReducer,
    compleFields: compleFields
})