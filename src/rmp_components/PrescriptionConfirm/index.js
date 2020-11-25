import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity,
    SafeAreaView, TextInput,
    Keyboard

} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import { Text, Textarea, Form, Button, Picker, Icon, ActionSheet } from 'native-base'
const { width: Width } = Dimensions.get('window');
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
const calendar = require('../../assets/imgs/calendar.png');
import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

var { width, height } = Dimensions.get('window');
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import CommonPopUp from '@components/CommonPopUp';
import {
    postApiRequest,
    showToast,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
var Bmi_value = ["Low"];
inches = [{ id: "0", value: '0"' }, { id: "1", value: '1"' }, { id: "2", value: '2"' }, { id: "3", value: '3"' }, { id: "4", value: '4"' }, { id: "5", value: '5"' }, { id: "6", value: '6"' }, { id: "7", value: '7"' }, { id: "8", value: '8"' }, { id: "9", value: '9"' }, { id: "10", value: '10"' }, { id: "11", value: '11"' }, { id: "12", value: '12"' }]

feet = [{ id: "1", value: "1'" }, { id: "2", value: "2'" }, { id: "3", value: "3'" }, { id: "4", value: "4'" }, { id: "5", value: "5'" }, { id: "6", value: "6'" }, { id: "7", value: "7'" }, { id: "8", value: "8'" }, { id: "9", value: "9'" }, { id: "10", value: "10'" }]

drugForm = ["Tablet", "Syrup", "Suspension", "Capsule", "Injection"];
doseFrequency = ["Once A Day", "Twice A Day", "Thrice A Day", "Four Times a Day", "As Needed"];
doseDurationUnit = ["Days", "Weeks", "Months"];
doseUnit = ["ml", "mg", "gm"]
class PrescriptionConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vHeightFeet: "5",
            vHeightInch: "0",
            vWeight: "",
            vBloodPressure: "",
            vBodyTemp: "",
            //   dLmpDate: new Date(),
            show_warning: false,
            medicines: [
                {
                    "tMedicineName": "",
                    "eDrugForm": "Tablet",
                    "fDoseQuantity": "",
                    "eDoseUnit": "ml",
                    "iDoseDuration": "",
                    "eDoseFrequency": "Once A Day",
                    "eDoseDurationUnit": 'Days'
                }],
            spinner: false,
            prescription_data: {},
            error: false,
            showPopUp: false,
            eIsPatientNotified: false
        };
    }

    componentDidMount() {
        console.log(this.props, "data in pressing");
        if (this.props.rmp_prescription_data.from == "call") {
            var param = {
                iAppointmentId: this.props.sessionDetail.iAppointmentId,
            }
            console.log("param for prescriptio", param)

            this.getPrescription(param)
        } else {
            var param = {
                // iAppointmentId: this.props.sessionDetail.iAppointmentId,
                iAppointmentId: this.props.rmp_prescription_data.id,
            }
            this.getPrescription(param)
        }

    }

    getPrescription = (param) => {
        console.log(param, "kkk")

        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.getPrescription, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....", this.state);
                if (data.prescription.iPrescriptionId != null) {
                    console.log("nemmsf", data.patient_details.dLmpDate)
                    this.setState({
                        medicines: data.prescription.medicines,
                        vWeight: data.patient_details.vWeight == null ? "" : data.patient_details.vWeight,
                        vBloodPressure: data.patient_details.vBloodPressure,
                        vBodyTemp: data.patient_details.vBodyTemp,
                        dLmpDate: data.patient_details.dLmpDate != null ? moment(data.patient_details.dLmpDate).format("DD-MM-YYYY") : '',
                        vHeightFeet: data.patient_details.vHeightFeet == null ? "5" : data.patient_details.vHeightFeet,
                        vHeightInch: data.patient_details.vHeightInch == null ? "0" : data.patient_details.vHeightInch,
                        prescription_data: data
                    });
                } else {
                    if (this.props.rmp_prescription_data.from == "appointments") {
                        this.setState({
                            // showPopUp: true,
                            vHeightFeet: data.patient_details.vHeightFeet == null ? "5" : data.patient_details.vHeightFeet,
                            vHeightInch: data.patient_details.vHeightInch == null ? "0" : data.patient_details.vHeightInch,
                            vWeight: data.patient_details.vWeight == null ? "" : data.patient_details.vWeight,
                            dLmpDate: data.patient_details.dLmpDate != null ? moment(data.patient_details.dLmpDate).format("DD-MM-YYYY") : '',
                            vBloodPressure: data.patient_details.vBloodPressure == null ? "" : data.patient_details.vBloodPressure,
                            vBodyTemp: data.patient_details.vBodyTemp == null ? "" : data.patient_details.vBodyTemp,
                            prescription_data: data
                        });
                    } else {
                        this.setState({
                            vHeightFeet: data.patient_details.vHeightFeet == null ? "5" : data.patient_details.vHeightFeet,
                            vHeightInch: data.patient_details.vHeightInch == null ? "0" : data.patient_details.vHeightInch,
                            vWeight: data.patient_details.vWeight == null ? "" : data.patient_details.vWeight,
                            dLmpDate: data.patient_details.dLmpDate != null ? moment(data.patient_details.dLmpDate).format("DD-MM-YYYY") : '',
                            vBloodPressure: data.patient_details.vBloodPressure == null ? "" : data.patient_details.vBloodPressure,
                            vBodyTemp: data.patient_details.vBodyTemp == null ? "" : data.patient_details.vBodyTemp,
                            prescription_data: data
                        });
                    }

                }

                this.setState({
                    spinner: !this.state.spinner,
                });
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
    getBMIValue() {
        var feetVariable = parseInt(this.state.vHeightFeet)
        var inchesVaraiable = parseInt(this.state.vHeightInch)
        var weightVariable = parseInt(this.state.vWeight);
        if (this.state.vWeight == '') {
            return " "
        }
        else {
            var meterSquare = [((feetVariable * 12) + inchesVaraiable) / 39.37] * [((feetVariable * 12) + inchesVaraiable) / 39.37]
            var bmiValueVariable = weightVariable / meterSquare
            return bmiValueVariable.toFixed(2);
        }
    }


    cancelPrescription() {
        console.warn("Cancel prescription")
    }
    confirmPrescription = () => {
        this.setState({ show_warning: false })
    }
    addRow = () => {
        var error = false;
        for (let i in this.state.medicines) {
            console.log(i, "iii", this.state.medicines[i]);
            if (this.state.medicines[i].tMedicineName == '' || this.state.medicines[i].iDoseDuration == '') {
                console.log("empty");
                error = true
                showToast("Please fill current medicine name or duration");
                break
            }
        }

        if (!error) {
            this.state.medicines.push({
                "tMedicineName": "",
                "eDrugForm": "Tablet",
                "fDoseQuantity": "",
                "eDoseUnit": "ml",
                "iDoseDuration": "",
                "eDoseFrequency": "Once A Day",
                "eDoseDurationUnit": 'Days'
            })
            this.setState({ medicines: this.state.medicines })
        }
        /**
         *    
         */
    }
    navigator = (action, data) => {
        Keyboard.dismiss();
        console.log("navigatior...", action, this.state)
        switch (action) {
            case "add":
                console.log("add");
                this.addRow();
                break;
            case "back":
                this.props.clickHandler('back');
                break;

            case "save":
                var error = false;
                for (let i in this.state.medicines) {
                    console.log(i, "iii", this.state.medicines[i]);
                    if (this.state.medicines[i].tMedicineName == '' || this.state.medicines[i].iDoseDuration == '') {
                        console.log("empty");
                        error = true
                        showToast("Please fill current medicine name or duration");
                        break
                    }
                }

                if (!error) {
                    this.setState({ showPopUp: true, eIsPatientNotified: false })
                }

                break;

            case "submit":
                var error = false;
                for (let i in this.state.medicines) {
                    console.log(i, "iii", this.state.medicines[i]);
                    if (this.state.medicines[i].tMedicineName == '' || this.state.medicines[i].iDoseDuration == '') {
                        console.log("empty");
                        error = true
                        showToast("Please fill current medicine name or duration");
                        break
                    }
                }
                if (!error) {
                    this.setState({ showPopUp: true, eIsPatientNotified: true })
                }
                break;
            default:
                break;
        }
    }
    addPrescription = (param, status) => {
        console.log(param, "param..")
        // console.log("adding..")
        // if (status == "save") {
        //     this.props.navigation.reset({
        //         index: 0,
        //         routes: [{ name: 'MyAccount' }],
        //     });
        // } else {
        //     console.log("hlooo")
        //     this.props.navigation.push('CommonPage', { type: 'post_prescription' });

        // }
        // return false;
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.addPrescription, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....", this.state);
                this.setState({
                    spinner: !this.state.spinner,
                });
                if (!this.state.eIsPatientNotified) {
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'MyAccount' }],
                    });
                } else {
                    this.props.navigation.push('CommonPage', { type: 'post_prescription' });
                }
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
    popUpClick = (status) => {
        console.log(status);
        this.setState({ showPopUp: !this.state.showPopUp });
        console.log(this.state)
        switch (status) {
            case "cancel":
                break;
            case "confirm":
                var param = {
                    iAppointmentId: this.props.rmp_prescription_data.from == "call" ? this.props.sessionDetail.iAppointmentId : this.props.rmp_prescription_data.id,
                    medicines: this.state.medicines,
                    eIsPatientNotified: this.state.eIsPatientNotified
                }
                if (this.props.rmp_prescription_data.from != "call") {
                    param.iPrescriptionId = this.state.prescription_data.prescription.iPrescriptionId
                }
                console.log(JSON.stringify(param));
                this.addPrescription(param)
                break;
            default:
                break;
        }
    }
    render() {
        return (
            <View>
                {this.state.showPopUp && (
                    <View style={{
                        zIndex: 2,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title="Please Confirm" 
                            msg="The medications being prescribed by you are in compliance with IMC permissible drug list Types O, A or B"></CommonPopUp>
                    </View>
                )}
                {/* {this.state.showPopUp && (
                    <View style={{
                        zIndex: 2,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title="Warning" 
                        msg="Please Confirm that the medications being prescribed by you are in compliance 
                        with IMC permissible drug list Types O, A or B"></CommonPopUp>
                    </View>
                )} */}
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.mainContent}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <View>


                        <Spinner
                            color={colors.sub_theme}
                            visible={this.state.spinner}
                            textContent={''}
                        />
                        <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.ADD_PRESCRIPTION}></HeaderComponent>

                        {this.state.show_warning && (
                            <View style={[styles.mainContainer, { padding: 10 }]}>
                                <Text style={styles.headingText}>Please Confirm{'\n'} that the medications being prescribed by you are in compliance with IMC permissible drug list Types O, A or B </Text>
                                <View style={styles.buttonWrapper}>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={this.cancelPrescription}
                                            style={styles.cancelButtonContainer}>
                                            <Text style={{ color: colors.danger, fontSize: 20, fontFamily: 'OpenSans-Regular', }}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={() => this.confirmPrescription()}
                                            style={styles.confirmButtonContainer}>
                                            <Text style={{ color: 'white', fontSize: 20, fontFamily: 'OpenSans-Regular', }}>Yes, I Confirm</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        {!this.state.show_warning && (
                            <View style={[styles.container, { alignItems: 'flex-start' }]}>
                                <View style={[styles.mainContainer,]}>
                                    <View style={{
                                        alignSelf: 'baseline',
                                        padding: 20, paddingTop: 0, borderColor: colors.PLACEHOLDER_TEXT,
                                        //   marginBottom: item.index == data.problems.length - 1 ? 150 : 20
                                    }}>
                                        {Object.keys(this.state.prescription_data).length !== 0 && (
                                            <View style={{ flexDirection: 'row', marginBottom: 10, justifyContent: 'space-between', }}>
                                                <View style={[styles.thirdRowContainerr, { borderRightWidth: 0, paddingLeft: 0 }]}>

                                                    <Text style={styles.secondRow}>{moment(this.state.prescription_data.patient_details.dScheduledDate).format("ddd")}, {moment(this.state.prescription_data.patient_details.dScheduledDate).format("DD-MM-YYYY")}</Text>

                                                </View>
                                                <View>
                                                    <Text style={styles.secondRow}>{'  '}|{'  '}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.secondRow}>{this.state.prescription_data.patient_details.eType == "Initial" ? "Initial Consult" : this.state.prescription_data.patient_details.eType}</Text>
                                                </View>

                                            </View>
                                        )}
                                        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                                            <View style={[styles.thirdRowContainer,]}>
                                                {Object.keys(this.state.prescription_data).length !== 0 && (
                                                    Object.keys(this.state.prescription_data.rmp_details).length != 0 && (
                                                        <Text style={styles.secondRow}>Dr. {this.state.prescription_data.rmp_details.vFirstName} {this.state.prescription_data.rmp_details.vLastName} | Ph:  {this.state.prescription_data.rmp_details.vPhoneNo}</Text>
                                                    )

                                                )}
                                                {Object.keys(this.state.prescription_data).length !== 0 && (
                                                    Object.keys(this.state.prescription_data.rmp_details).length != 0 && (
                                                        <Text style={styles.secondRow}>{this.state.prescription_data.rmp_details.vQualification} | Reg.No.{this.state.prescription_data.rmp_details.vRegistrationNo}</Text>
                                                    )

                                                )}

                                            </View>


                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            <View style={[styles.thirdRowContainer, { marginTop: 10 }]}>
                                                {Object.keys(this.state.prescription_data).length !== 0 && (
                                                    Object.keys(this.state.prescription_data.patient_info).length != 0 && (
                                                        <Text style={styles.secondRow}>Patient:  {this.state.prescription_data.patient_info.vFirstName.toUpperCase()} | {this.state.prescription_data.patient_info.iAge} | {this.state.prescription_data.patient_info.eGender}</Text>
                                                    )

                                                )}

                                                {Object.keys(this.state.prescription_data).length !== 0 && (
                                                    Object.keys(this.state.prescription_data.patient_info).length == 0 && (
                                                        <Text style={styles.secondRow}>Patient:  {this.state.prescription_data.patient_details.vFirstName.toUpperCase()} | {this.state.prescription_data.patient_details.iAge} | {this.state.prescription_data.patient_details.eGender}</Text>
                                                    )

                                                )}

                                            </View>

                                        </View>
                                    </View>


                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                        <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5, }}>
                                            <Text style={styles.headingTextForm}>Height <Text style={{ fontSize: 13, color: colors.PLACEHOLDER_TEXT }}>(ft inch)</Text></Text>
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <View style={[styles.numberInputContainer, { flex: 1, padding: 0, marginRight: 5, height: 50, backgroundColor: colors.BORDER_COLOR }]}>
                                                    <Picker
                                                        enabled={false}
                                                        mode="dropdown"
                                                        iosHeader={'Select Feet'}
                                                        iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 25, }} />}
                                                        style={{ width: '100%', color: colors.BLACK_TEXT }}
                                                        selectedValue={this.state.vHeightFeet}
                                                        textStyle={[styles.stateCouncilTxt]}

                                                    >
                                                        {feet.map((value, idx) => {
                                                            return (
                                                                <Picker.Item label={value.value} value={value.id} />
                                                            )
                                                        })}


                                                    </Picker>
                                                </View>

                                                <View style={[styles.numberInputContainer, { flex: 1, backgroundColor: colors.BORDER_COLOR }]}>
                                                    <Picker
                                                        enabled={false}
                                                        mode="dropdown"
                                                        iosHeader={'Select Feet'}
                                                        iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 25, }} />}
                                                        style={{ width: '100%', color: colors.BLACK_TEXT, height: 40, padding: 0 }}
                                                        selectedValue={this.state.vHeightInch}
                                                        textStyle={[styles.pickerText]}

                                                    >
                                                        {inches.map((value, idx) => {
                                                            return (
                                                                <Picker.Item label={value.value} value={value.id} />
                                                            )
                                                        })}
                                                    </Picker>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                            <Text style={styles.headingTextForm}>Weight <Text style={{ fontSize: 13, color: colors.PLACEHOLDER_TEXT }}>(Kg)</Text></Text>
                                            <View style={[styles.numberInputContainer, { backgroundColor: colors.BORDER_COLOR }]}>
                                                <TextInput
                                                    editable={false}
                                                    selectTextOnFocus={false}
                                                    style={styles.numberInput}
                                                    selectionColor={colors.THEME_YELLOW}
                                                    keyboardType='numeric'
                                                    ref={ref => (this.textInputRef = ref)}
                                                    maxLength={5}
                                                    onChangeText={(value) => {
                                                        console.log("change..")
                                                        this.setState({ vWeight: value })
                                                    }}
                                                    value={this.state.vWeight}
                                                >
                                                </TextInput>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                            <Text style={styles.headingTextForm}>LMP</Text>
                                            <View style={[styles.numberInputContainer, { backgroundColor: colors.BORDER_COLOR }]}>
                                                <DatePicker
                                                    disabled={true}
                                                    allowFontScaling={true}
                                                    style={{ width: '100%' }}
                                                    showIcon={false}
                                                    iconSource={calendar}
                                                    date={this.state.dLmpDate}
                                                    mode="date"
                                                    placeholder="DD-MM-YYYY"
                                                    format="DD-MM-YYYY"
                                                    // minDate={new Date()}
                                                    //  maxDate="01-01-3015"
                                                    confirmBtnText="Select"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        placeholderText: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 18,
                                                            color: colors.PLACEHOLDER_TEXT,
                                                            padding: 5,
                                                            paddingBottom: 9,
                                                        },
                                                        dateText: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            alignItems: 'flex-start',
                                                            borderWidth: 0,
                                                            fontSize: 15,
                                                        },
                                                        dateInput: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            alignItems: 'flex-start',
                                                            borderWidth: 0,
                                                            fontSize: 18,
                                                            // marginLeft: 36
                                                        },
                                                        btnTextConfirm: {
                                                            color: colors.THEME_YELLOW,
                                                            fontSize: 18,
                                                            fontFamily: 'OpenSans-Bold',
                                                        },
                                                        btnTextCancel: {
                                                            color: colors.jet_black,
                                                            fontSize: 18,
                                                            fontFamily: 'OpenSans-Regular',
                                                        },
                                                        disabled: {
                                                            backgroundColor: colors.BORDER_COLOR,
                                                            borderRadius: 4,
                                                            //  paddingLeft: 5
                                                        }
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={date => {
                                                        this.setState({ 'dLmpDate': date });
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                            <Text style={styles.headingTextForm}>BMI</Text>
                                            <View style={[styles.numberInputContainer, { backgroundColor: colors.BORDER_COLOR }]}>
                                                <TextInput
                                                    editable={false}
                                                    selectTextOnFocus={false}
                                                    style={styles.numberInput}
                                                    selectionColor={colors.THEME_YELLOW}
                                                    keyboardType='numeric'
                                                    ref={ref => (this.textInputRef = ref)}
                                                    value={this.getBMIValue()}
                                                >
                                                </TextInput>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                            <Text style={styles.headingTextForm}>BP</Text>
                                            <View style={[styles.numberInputContainer, { backgroundColor: colors.BORDER_COLOR }]}>
                                                <TextInput
                                                    editable={false}
                                                    selectTextOnFocus={false}
                                                    style={styles.numberInput}
                                                    selectionColor={colors.THEME_YELLOW}
                                                    keyboardType='numeric'
                                                    ref={ref => (this.textInputRef = ref)}
                                                    maxLength={5}
                                                    onChangeText={(value) => {
                                                        console.log("change..")
                                                        this.setState({ vBloodPressure: value })
                                                    }}
                                                    value={this.state.vBloodPressure}
                                                >
                                                </TextInput>
                                            </View>
                                        </View>

                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                            <Text style={styles.headingTextForm}>Temp <Text style={{ fontSize: 13, color: colors.PLACEHOLDER_TEXT }}>(C)</Text></Text>
                                            <View style={[styles.numberInputContainer, { backgroundColor: colors.BORDER_COLOR }]}>
                                                <TextInput
                                                    editable={false}
                                                    selectTextOnFocus={false}
                                                    style={[styles.numberInput,]}
                                                    selectionColor={colors.THEME_YELLOW}
                                                    keyboardType='numeric'
                                                    ref={ref => (this.textInputRef = ref)}
                                                    maxLength={5}
                                                    onChangeText={(value) => {
                                                        console.log("change..")
                                                        this.setState({ vBodyTemp: value })
                                                    }}
                                                    value={this.state.vBodyTemp}
                                                >
                                                </TextInput>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5, marginBottom: 15 }}>
                                            <Text style={[styles.headingTextForm, { color: colors.danger, fontFamily: 'OpenSans-Bold', fontSize: 20 }]}>Rx</Text>
                                        </View>
                                    </View>

                                    {this.state.medicines.map((item, key) => {
                                        return (
                                            <View style={{ alignItems: 'flex-start', marginBottom: 25, }}>
                                                <View style={{ marginTop: 0, flexDirection: 'row', marginLeft: 15, marginRight: 15, }}>
                                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5, }}>
                                                        <Text style={styles.headingTextForm}>Name of Medicine</Text>
                                                        <View style={styles.numberInputContainer}>
                                                            <TextInput
                                                                style={styles.numberInput}
                                                                keyboardType="default"
                                                                selectionColor={colors.THEME_YELLOW}
                                                                onChangeText={name => {
                                                                    this.state.medicines[key].tMedicineName = name
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                                value={item.tMedicineName}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginTop: 5, flexDirection: 'row', marginLeft: 15, marginRight: 15,height: 75 }}>
                                                    <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                                        <Text style={styles.headingTextForm}>Drug Form</Text>
                                                        <View style={[styles.numberInputContainer, { flex: 5, padding: 0, marginRight: 5, height: 50 }]}>
                                                            <Picker
                                                                mode="dropdown"
                                                                iosHeader="Drug Form"
                                                                iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 20, }} />}
                                                                style={{ width: 135, color: colors.BLACK_TEXT, justifyContent: 'space-around' }}
                                                                selectedValue={item.eDrugForm}
                                                                textStyle={[styles.stateCouncilTxt]}
                                                                onValueChange={(value) => {
                                                                    this.state.medicines[key].eDrugForm = value
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                            // onValueChange={this.onFeetValueChange.bind(this)}
                                                            >
                                                                {drugForm.map((value, idx) => {
                                                                    return (
                                                                        <Picker.Item label={value} value={value} />
                                                                    )
                                                                })}


                                                            </Picker>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                                        <Text style={[styles.headingTextForm, ]}> Quantity</Text>
                                                        <View style={[styles.numberInputContainer, { width : 60 }]}>
                                                            <TextInput
                                                                style={styles.numberInput}
                                                                keyboardType='numeric'
                                                                maxLength={4}
                                                                ref={ref => (this.textInputRef = ref)}
                                                                // autoFocus={true}
                                                                selectionColor={colors.THEME_YELLOW}
                                                                onChangeText={name => {
                                                                    this.state.medicines[key].fDoseQuantity = name
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                                value={item.fDoseQuantity}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1.6, paddingRight: 5, paddingLeft: 5, marginRight: 2.5, height: 75 }}>
                                                        <Text style={styles.headingTextForm}>{' '}</Text>
                                                        <View style={[styles.numberInputContainer, { width: 108, flex: 2, padding: 0, marginRight: 5, height: 50 }]}>
                                                            {/* <Picker
                                                                mode="dropdown"
                                                                iosHeader={'Select Unit'}
                                                                iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 20, }} />}
                                                                style={{ width: '80%', color: colors.BLACK_TEXT }}
                                                                selectedValue={item.eDoseUnit}
                                                                textStyle={[styles.stateCouncilTxt, { fontSize: 13 }]}
                                                                onValueChange={(value) => {
                                                                    this.state.medicines[key].eDoseUnit = value
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                            >
                                                                {doseUnit.map((value, idx) => {
                                                                    return (
                                                                        <Picker.Item label={value} value={value} />
                                                                    )
                                                                })}


                                                            </Picker> */}
                                                            <Picker
                                                                mode="dropdown"
                                                                iosHeader={'Frequency'}
                                                                iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 20, }} />}
                                                                style={{ width: 120, color: colors.BLACK_TEXT, paddingLeft: 0, justifyContent: 'space-around', }}
                                                                selectedValue={item.eDoseUnit}
                                                                textStyle={[styles.stateCouncilTxt, {
                                                                    width: '100%', fontSize: 13
                                                                }]}
                                                                onValueChange={(value) => {
                                                                    this.state.medicines[key].eDoseUnit = value
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                            >
                                                                {doseUnit.map((value, idx) => {
                                                                    return (
                                                                        <Picker.Item label={value} value={value} />
                                                                    )
                                                                })}


                                                            </Picker>
                                                        </View>
                                                    </View>
                                                </View>

                                                <View style={{ marginTop: 5, flexDirection: 'row', marginLeft: 15, marginRight: 15, }}>
                                                    <View style={{ paddingRight: 5, paddingLeft: 5, height: 75, flex: 2 }}>
                                                        <Text style={styles.headingTextForm}>Frequency</Text>
                                                        <View style={[styles.numberInputContainer, { flex: 1, padding: 0, marginRight: 5, }]}>
                                                            <Picker
                                                                mode="dropdown"
                                                                iosHeader={'Frequency'}
                                                                iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 25, }} />}
                                                                style={{ width: 135, color: colors.BLACK_TEXT, justifyContent: 'space-around' }}
                                                                selectedValue={item.eDoseFrequency}
                                                                textStyle={[styles.stateCouncilTxt]}
                                                                onValueChange={(value) => {
                                                                    this.state.medicines[key].eDoseFrequency = value
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                            >
                                                                {doseFrequency.map((value, idx) => {
                                                                    return (
                                                                        <Picker.Item label={value} value={value} />
                                                                    )
                                                                })}


                                                            </Picker>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                                        <Text style={styles.headingTextForm}>Duration</Text>
                                                        <View style={[styles.numberInputContainer, { width : 60 }]}>
                                                            <TextInput
                                                                style={styles.numberInput}
                                                                keyboardType='numeric'
                                                                maxLength={3}
                                                                ref={ref => (this.textInputRef = ref)}
                                                                // autoFocus={true}
                                                                selectionColor={colors.THEME_YELLOW}
                                                                onChangeText={name => {
                                                                    this.state.medicines[key].iDoseDuration = name
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                                value={item.iDoseDuration}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1.7, paddingRight: 5, paddingLeft: 5, height: 75 }}>
                                                        <Text style={styles.headingTextForm}>{' '}</Text>
                                                        <View style={[styles.numberInputContainer, { width : 110,flex: 2, padding: 0, marginRight: 5, height: 50, alignItems: 'flex-start' }]}>
                                                            <Picker

                                                                mode="dropdown"
                                                                iosHeader={'Frequency'}
                                                                iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 20, }} />}
                                                                style={{ width: 120, color: colors.BLACK_TEXT, paddingLeft: 0, justifyContent: 'space-around', }}
                                                                selectedValue={item.eDoseDurationUnit}
                                                                textStyle={[styles.stateCouncilTxt, {
                                                                    width: '100%', fontSize: 13
                                                                }]}
                                                                onValueChange={(value) => {
                                                                    Keyboard.dismiss();
                                                                    this.state.medicines[key].eDoseDurationUnit = value
                                                                    this.setState({ medicines: this.state.medicines })
                                                                }}
                                                            >
                                                                {doseDurationUnit.map((value, idx) => {
                                                                    return (
                                                                        <Picker.Item label={value} value={value} />
                                                                    )
                                                                })}


                                                            </Picker>
                                                        </View>
                                                    </View>

                                                </View>

                                            </View>
                                        )

                                    })}


                                    <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, }}>
                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5, alignItems: 'flex-end' }}>
                                            <TouchableOpacity onPress={() => {
                                                this.navigator('add');
                                            }}>

                                                <Text style={[styles.headingTextForm, { color: colors.THEME_YELLOW, textDecorationLine: 'underline' }]}>Add Another Medicine</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 50, }}>

                                        <Button style={[styles.nextButtonContainer, {}]}
                                            onPress={() => {
                                                this.navigator('submit');
                                            }} >
                                            <Text style={styles.nextButton}>Submit & Notify  Patient</Text>
                                        </Button>

                                        <Button bordered style={[styles.nextButtonContainer, { backgroundColor: 'transparent', borderColor: colors.THEME_YELLOW, marginBottom: 50 }]}
                                            onPress={() => {
                                                this.navigator('save');
                                            }} >
                                            <Text style={[styles.nextButton, { color: colors.THEME_YELLOW }]}>SAVE</Text>
                                        </Button>
                                    </View>

                                </View>

                            </View>


                        )}



                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }
}


function mapStateToProps(state) {
    return {
        user_data: state.user.userData,
        sessionDetail: state.sessionData,
    }
}
export default connect(mapStateToProps, {})(PrescriptionConfirm);

