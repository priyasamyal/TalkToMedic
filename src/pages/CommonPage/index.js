//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ForgotPassword from '@components/ForgotPassword';
import ChangePassword from '@components/ChangePassword';
import PatientProfile from '@components/PatientProfile';
import ChooseProblem from '@components/ChooseProblem';
import Camera from '@components/Camera';
import Appointments from '@components/Appointments';
import AddMember from '@components/AddMember';
import RmpProfile from '@components/RmpProfile';
import Settings from '@components/Settings';
import ThanksScreen from '@components/ThanksScreen';
import MedicalHistory from '@components/MedicalHistory';
import ApptMedicalHistory from '@components/ApptMedicalHistory';
import PaymentReceipt from '@components/PaymentReceipt';
import Prescription from '@components/Prescription';
import PharmacyOTP from '@components/PharmacyOTP';
import PharmacyMobile from '@components/PharmacyMobile';
import Feedback from '@components/Feedback';
import Rating from '@components/Rating';
import RmpPracticeDetail from '@components/RmpPracticeDetail';
import AdditionalInfo from '@rmp_components/AdditionalInfo';
import ConsultationFee from '@rmp_components/ConsultationFee';
import RmpConclusion from '@rmp_components/RmpConclusion';
import AddMedicalHistory from '@rmp_components/AddMedicalHistory';
import ManageAvailability from '@rmp_components/ManageAvailability';
import PrescriptionConfirm from '@rmp_components/PrescriptionConfirm';
import PostPrescription from '@rmp_components/PostPrescription';
import WithdrawFunds from '@rmp_components/WithdrawFunds';

// create a component
state_data = { id: '1' }
class CommonPage extends Component {
    constructor(props) {
        super(props);
        console.log(this.props, "commpop....")
        this.state = {
            param: this.props.route.params.type,
            presData: this.props.route.params.prescData,
            pharmcyData: this.props.route.params.pharmcyData,
            pharmcyMobile: this.props.route.params.pharmcyMobile,

            rmp_prescription_data: this.props.route.params.rmp_prescription_data

        };
    }

    componentDidMount() {
        console.log(this.props, "commpop....")
    }

    navigator = (status, data) => {

        console.log(status, data, "fdgdfg")
        switch (status) {
            case "back":
                this.props.navigation.goBack();
                break;
            case "HomeAccount":
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
                });
                break;
            case "consult":
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount', params: { type: 'my_appt' } }],
                });
                break;

            case "book":
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount', params: { type: 'consult' } }],
                });
                break;
            case "move_prescription":
                this.props.navigation.push('CommonPage', { type: 'prescription', prescData: { iAppointmentId: data.iAppointmentId, from: "dashboard" } });
                break;
            case "pharmacy_otp":
                this.props.navigation.push('CommonPage', { type: 'pharmacy_otp', pharmcyData: data });
                break;
            case "pharmacy_mobile":
                this.props.navigation.push('CommonPage', { type: 'pharmacy_mobile', pharmcyMobile: data });
                break;

            case "thanksPharm":
                this.props.navigation.push('CommonPage', { type: 'thanks_pharm' });
                break;

            case "with":
                this.props.navigation.push('CommonPage', { type: 'withdraw' });
                break;

            default:
                break;
        }
    }

    getPage = () => {
        switch (this.state.param) {
            case "consult_doctor":
                return <ChooseProblem clickHandler={this.navigator} navigation={this.props.navigation} ></ChooseProblem>
            case "forgot_password":
                return <ForgotPassword clickHandler={this.navigator} ></ForgotPassword>
            case "appointments":
                return <Appointments clickHandler={this.navigator} navigation={this.props.navigation}></Appointments>
            case "edit_profile":
                return <PatientProfile clickHandler={this.navigator} ></PatientProfile>
            case "change_password":
                return <ChangePassword clickHandler={this.navigator} ></ChangePassword>
            case "family_member":
                return <AddMember clickHandler={this.navigator} ></AddMember>
            case "payment_receipts":
                return <PaymentReceipt clickHandler={this.navigator} ></PaymentReceipt>
            case "medical_history":
                return <MedicalHistory rmp_prescription_data={this.state.rmp_prescription_data} clickHandler={this.navigator} ></MedicalHistory>
            case "rmp_conclusion":
                return <RmpConclusion navigation={this.props.navigation} clickHandler={this.navigator} ></RmpConclusion>
            case "thanks_booking":
                return <ThanksScreen clickHandler={this.navigator} type="thanks_booking"></ThanksScreen>
            case "thanks_pharm":
                return <ThanksScreen clickHandler={this.navigator} type="thanks_pharm"></ThanksScreen>
            case "audio_setting":
                return <Settings clickHandler={this.navigator} type="audio_setting"></Settings>
            case "audio_setting_appt":
                return <Settings clickHandler={this.navigator} type="appt" navigation={this.props.navigation}></Settings>
            case "prescription":
                return <Prescription clickHandler={this.navigator} pres_param={this.state.presData}></Prescription>
            case "pharmacy_otp":
                return <PharmacyOTP clickHandler={this.navigator} pharmcyData={this.state.pharmcyData}></PharmacyOTP>
            case "feedback":
                return <Feedback clickHandler={this.navigator} navigation={this.props.navigation} ></Feedback>
            case "pharmacy_mobile":
                return <PharmacyMobile clickHandler={this.navigator} navigation={this.props.navigation} pharmcyMobile={this.state.pharmcyMobile}></PharmacyMobile>
            case "edit_profile_rmp":
                return <RmpProfile clickHandler={this.navigator} ></RmpProfile>

            case "practice_detail":
                return <RmpPracticeDetail clickHandler={this.navigator} ></RmpPracticeDetail>

            case "withdraw_funds":
                return <AddMedicalHistory clickHandler={this.navigator}></AddMedicalHistory>
            case "consultation_fee":
                return <ConsultationFee clickHandler={this.navigator}></ConsultationFee>
            case "manage_avail":
                return <ManageAvailability clickHandler={this.navigator}></ManageAvailability>

            case "rmp_prescription":
                return <PrescriptionConfirm clickHandler={this.navigator} rmp_prescription_data={this.state.rmp_prescription_data} navigation={this.props.navigation}></PrescriptionConfirm>
            case "rmp_medical_history":
                return <AddMedicalHistory clickHandler={this.navigator} rmp_prescription_data={this.state.rmp_prescription_data} navigation={this.props.navigation}></AddMedicalHistory>

            case "add_medical_history":
                return <AddMedicalHistory clickHandler={this.navigator} rmp_prescription_data={this.state.rmp_prescription_data} navigation={this.props.navigation} ></AddMedicalHistory>
            case "rmp_upcoming_history":
                return <ApptMedicalHistory clickHandler={this.navigator} rmp_prescription_data={this.state.rmp_prescription_data} navigation={this.props.navigation}></ApptMedicalHistory>
            case "withdraw":
                return <WithdrawFunds clickHandler={this.navigator} navigation={this.props.navigation}></WithdrawFunds>

            case "post_prescription":
                return <PostPrescription clickHandler={this.navigator} navigation={this.props.navigation}></PostPrescription>
            default:
                return <Appointments clickHandler={this.navigator} navigation={this.props.navigation} ></Appointments>
                break;
        }
    }

    render() {
        return (

            this.getPage()
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default CommonPage;
