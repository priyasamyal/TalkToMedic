//import liraries
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Platform,
    Text,
    TextInput,
    ScrollView,
    FlatList,

} from 'react-native';
import {
    Container,
    Header,
    Content,
    Left,
    Button,
    Body,
    Right,
    Icon,
    Title,
    Toast, Picker
} from 'native-base';
import HeaderComponent from '@components/HeaderComponent';
import moment from 'moment';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler, openUrl
} from '../../common/user';
import { connect } from "react-redux";
// create a component
const history = [{
    eRelationType: "Father",
    iAge: 10,
    eGender: "Male",
    iFamilyMemebrId: "1",
    patient_history: [{
        dScheduledDate: "2020-03-19 13:19:36",
        id: '1'
    },
    {
        dScheduledDate: "2020-03-19 13:19:36",
        id: '2'
    }]
},

{
    eRelationType: "Mother",
    iAge: 30,
    eGender: "Feale",
    iFamilyMemebrId: "2",
    patient_history: [{
        dScheduledDate: "2020-03-19 13:19:36",
        id: '2'
    }]
}
]
class Prescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iFamilyMemberId: history[0],
            currentRelationIndex: 0,
            history: history,
            prescription_data: {}
        };
    }

    componentDidMount() {
        console.log(this.props, "data in press");
        var param = {
            //iAppointmentId: "10",
            iAppointmentId: this.props.pres_param.iAppointmentId,
            // iFamilyMemberId: this.props.pres_param.iFamilyMemberId
        }
        console.log(param, "param....");
        this.getPrescription(param)
    }

    getPrescription = (param) => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.getPrescription, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....", this.state);
                this.setState({ prescription_data: data })
            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true
                });
            },
        );
    }
    navigator = (page, data) => {
        switch (page) {
            case 'next': {
                var param = {
                    iPrescriptionId: this.state.prescription_data.prescription.iPrescriptionId,
                    iAppointmentId: this.props.pres_param.iAppointmentId
                }
                console.log(param)
                this.props.clickHandler('pharmacy_mobile', param);
                break;
            }
            case 'back': {
                console.log('back');
                this.props.clickHandler('back');
                break;
            }
        }
    }

    onFamilyMemberChange = (value) => {
        console.log(value)
        console.log(history.indexOf(value));
        this.setState({
            iFamilyMemberId: value,
            currentRelationIndex: history.indexOf(value)
        });
        if (history.indexOf(value) > -1) {
            history[history.indexOf(value)].patient_history.map((m, index) => {
                console.log(m, index, "mmm");
                if (index == 0) {
                    return m.isActive = true
                } else {
                    return m.isActive = false
                }
            })
        }
        console.log(history[history.indexOf(value)])
    }

    itemClicked = (item, index) => {
        console.log(this.state, index, item)
        // console.log(item, index);
        history[this.state.currentRelationIndex].patient_history[index].isActive = !history[this.state.currentRelationIndex].patient_history[index].isActive;

        this.setState({
            history: history
        })

        console.log(this.state.history)
    }
    getBMIValue() {
        var feetVariable = parseInt(this.state.prescription_data.patient_details.vHeightFeet)
        var inchesVaraiable = parseInt(this.state.prescription_data.patient_details.vHeightInch)
        var weightVariable = parseInt(this.state.prescription_data.patient_details.vWeight);
        if (this.state.vWeight == '') {
            return " "
        }
        else {
            var meterSquare = [((feetVariable * 12) + inchesVaraiable) / 39.37] * [((feetVariable * 12) + inchesVaraiable) / 39.37]
            var bmiValueVariable = weightVariable / meterSquare
            return bmiValueVariable.toFixed(2);
        }
    }

    render() {
        return (
            <Container>
                <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.PRESCRIPTION}></HeaderComponent>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContainer}>
                        {Object.keys(this.state.prescription_data).length !== 0 && (
                            <View style={{ flex: 1, }}>
                                <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                    {Object.keys(this.state.prescription_data.patient_info).length == 0 && (
                                        <Text style={[styles.headingTextRelation, { width: "100%", paddingLeft: 10 }]}>MySelf | {this.state.prescription_data.patient_details.iAge} | {this.state.prescription_data.patient_details.eGender.charAt(0)}</Text>
                                    )}

                                    {Object.keys(this.state.prescription_data.patient_info).length != 0 && (
                                        <Text style={[styles.headingTextRelation, { width: "100%", paddingLeft: 10 }]}> {this.state.prescription_data.patient_info.eRelationType} | {this.state.prescription_data.patient_info.iAge} | {this.state.prescription_data.patient_info.eGender.charAt(0)}</Text>
                                    )}
                                </View>
                                {this.state.prescription_data.prescription.medicines.length == 0 && (
                                    <View style={{ marginTop: 30, }}>

                                        <Text style={[styles.headingText, { textAlign: 'center', fontFamily: 'OpenSans-Regular' }]}>No Prescription advised yet.</Text>

                                    </View>

                                )}
                                {this.state.prescription_data.prescription.medicines.length != 0 && (
                                    <View style={[styles.dateContainer, {}]}>

                                        <Text style={[styles.medicinetext, { padding: 10 }]}>{moment(this.state.prescription_data.patient_details.dScheduledDate).format("ddd")}| {moment(this.state.prescription_data.patient_details.dScheduledDate).format("DD-MM-YYYY")}</Text>
                                        <View style={[styles.dateInnerContainer,]}>
                                            <View>
                                                <View style={styles.headerWrapper}>
                                                    <Text style={[styles.headingText, {}]}>{this.state.prescription_data.rmp_details.vFirstName} {this.state.prescription_data.rmp_details.vLastName}    | Ph  {this.state.prescription_data.rmp_details.vPhoneNo}</Text>
                                                    <Text style={[styles.headingText, {}]}>{this.state.prescription_data.rmp_details.vQualification}  | Reg. No.  {this.state.prescription_data.rmp_details.vRegistrationNo}</Text>
                                                </View>
                                                <View style={styles.headerWrapper}>

                                                    <Text style={[styles.headingText, {}]}> {this.state.prescription_data.patient_details.vFirstName}  |  {this.state.prescription_data.patient_details.iAge} | {this.state.prescription_data.patient_details.eGender.charAt(0)}  | {this.state.prescription_data.patient_details.eType == "Initial" ? "Initial Consult" : this.state.prescription_data.patient_details.eType}</Text>
                                                    <Text style={[styles.headingSubText, {}]}> H: {this.state.prescription_data.patient_details.vHeightFeet}' {' '}{this.state.prescription_data.patient_details.vHeightInch}"   |  W: {this.state.prescription_data.patient_details.vWeight} KG.  |  LMP:  {this.state.prescription_data.patient_details.dLmpDate != null ? moment(this.state.prescription_data.patient_details.dLmpDate).format("DD-MM-YYYY") : ''} </Text>


                                                    <Text style={[styles.headingSubText, {}]}>BMI: {this.getBMIValue()} |  BP: {this.state.prescription_data.patient_details.vBloodPressure}    |  Temp: {this.state.prescription_data.patient_details.vBodyTemp} </Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', padding: 5 }}>
                                                    <Text style={[styles.headingText, { flex: 1, color: colors.danger, fontSize: 25 }]}>Rx</Text>
                                                    <Text style={[styles.headingText, {}]}>{moment(this.state.prescription_data.patient_details.dScheduledDate).format("DD-MM-YYYY")}</Text>
                                                </View>

                                                {this.state.prescription_data.prescription.medicines.map((value, idx) => {
                                                    return (
                                                        <View style={{ padding: 5 }}>
                                                            <Text style={[styles.medicinetext,]}>{value.tMedicineName}</Text>
                                                            <Text style={[styles.headingText, { fontSize: 18 }]}>{value.eDrugForm}- {value.fDoseQuantity}{value.eDoseUnit}   |  {value.eDoseFrequency} - {value.iDoseDuration} {value.eDoseDurationUnit}</Text>
                                                        </View>
                                                    )
                                                })}



                                                {this.state.prescription_data.prescription.medicines.length > 0 && (
                                                    <View style={{ marginTop: 30, }}>
                                                        <Button style={styles.nextButtonContainer}
                                                            onPress={() => {
                                                                this.navigator('next');
                                                            }} >
                                                            <Text style={styles.nextButton}>Share With Pharmacy</Text>
                                                        </Button>
                                                    </View>

                                                )}

                                            </View>

                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                    </View>
                </ScrollView>
            </Container>
        );
    }




}


function mapStateToProps(state) {
    return {
        user_data: state.user.userData
    }
}
export default connect(mapStateToProps, {})(Prescription);

//make this component available to the app
