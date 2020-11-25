import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity, Image, SafeAreaView, Keyboard

} from 'react-native';
import styles from './styles';
import { Text, Textarea, Button, Icon, Picker, Input, Form, Toast } from 'native-base'
import DatePicker from 'react-native-datepicker'
const calendar = require('../../assets/imgs/calendar.png');
import { colors, constant, data } from '../../common/index';
import HeaderComponent from '@components/HeaderComponent';
import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
var { width, height } = Dimensions.get('window');
import {
    postApiRequest,
    showToast,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import moment from 'moment';

import CommonPopUp from '@components/CommonPopUp';
inches = [{ id: "0", value: '0"' }, { id: "1", value: '1"' }, { id: "2", value: '2"' }, { id: "3", value: '3"' }, { id: "4", value: '4"' }, { id: "5", value: '5"' }, { id: "6", value: '6"' }, { id: "7", value: '7"' }, { id: "8", value: '8"' }, { id: "9", value: '9"' }, { id: "10", value: '10"' }, { id: "11", value: '11"' }, { id: "12", value: '12"' }]

feet = [{ id: "1", value: "1'" }, { id: "2", value: "2'" }, { id: "3", value: "3'" }, { id: "4", value: "4'" }, { id: "5", value: "5'" }, { id: "6", value: "6'" }, { id: "7", value: "7'" }, { id: "8", value: "8'" }, { id: "9", value: "9'" }, { id: "10", value: "10'" }]


class AddMedicalHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vHeightFeet: "5",
            vHeightInch: "0",
            vWeight: "",
            vBloodPressure: "",
            vBodyTemp: "",
            dLmpDate: "",
            selected: "",
            tSpecialInstructions: '',
            tChiefComplaints: '',
            tRelevantHistory: '',
            tExaminationLabTest: '', tSuggestedInvestigation: '', tDiagnosis: '',
            spinner: false,
            history: {},
            showPopUp: false,
            btnTxt: '',
            showInstruction: false
        };
    }
    componentDidMount() {
        console.log(this.props, "history props...");
        if (this.props.rmp_prescription_data.from == 'appointments') {
            this.getMedicalHistory();
        }
    }

    getMedicalHistory = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        var param = {
            iAppointmentId: this.props.rmp_prescription_data.id
            //  iAppointmentId: "10"
        }
        console.log(param, "param")
        postApiRequestWithHeaders(data.api_endpoint.medical_history_by_id, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                if (data.data.iMedicalHistoryId != null) {
                    this.setState({
                        vHeightFeet: data.data.vHeightFeet,
                        vHeightInch: data.data.vHeightInch,
                        vWeight: data.data.vWeight,
                        vBloodPressure: data.data.vBloodPressure,
                        vBodyTemp: data.data.vBodyTemp,
                        dLmpDate: data.data.dLmpDate != null ? moment(data.data.dLmpDate).format("DD-MM-YYYY") : '',
                        selected: "",
                        tSpecialInstructions: data.data.tSpecialInstructions,
                        tChiefComplaints: data.data.tChiefComplaints,
                        tRelevantHistory: data.data.tRelevantHistory,
                        tExaminationLabTest: data.data.tExaminationLabTest, tSuggestedInvestigation: data.data.tSuggestedInvestigation, tDiagnosis: data.data.tDiagnosis,
                        spinner: !this.state.spinner,
                        history: data.data,
                    });
                } else {
                    this.setState({
                        history: data.data,
                        spinner: !this.state.spinner,
                        // showPopUp: true
                    })
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

    onInchesValueChange(valueInchesSelected) {
        this.setState({
            vHeightInch: valueInchesSelected
        })
    }
    onFeetValueChange(valueFeetSelected) {
        this.setState({
            vHeightFeet: valueFeetSelected
        })
    }

    editPrescription() {
        {
            Toast.show({
                text: 'Edit prescription',
                buttonText: 'Okay'
            })
        }
    }
    checkValidation = () => {
        Keyboard.dismiss();
        if (this.state.vWeight == "") {
            showToast("Please enter Patient's weight.")
        }
        else if (this.state.tDiagnosis == "") {
            showToast("Please enter Patient's diagnosis.")
        } else {
            var param = {
                iAppointmentId: this.props.rmp_prescription_data.from == 'appointments' ? this.props.rmp_prescription_data.id : this.props.sessionDetail.iAppointmentId,
                vHeightFeet: this.state.vHeightFeet,
                vHeightInch: this.state.vHeightInch,
                vWeight: this.state.vWeight,
                dLmpDate: this.state.dLmpDate,
                vBloodPressure: this.state.vBloodPressure,
                vBodyTemp: this.state.vBodyTemp,
                tSpecialInstructions: this.state.tSpecialInstructions,
                tChiefComplaints: this.state.tChiefComplaints,
                tRelevantHistory: this.state.tRelevantHistory,
                tExaminationLabTest: this.state.tExaminationLabTest,
                tSuggestedInvestigation: this.state.tSuggestedInvestigation,
                tDiagnosis: this.state.tDiagnosis,
            }
            if (this.props.rmp_prescription_data.from == 'appointments') {
                param.iMedicalHistoryId = this.state.history.iMedicalHistoryId
            }
            console.log(param)
            this.addHistory(param)
        }
    }

    navigator = (action, data) => {
        // this.setState({
        //     showPopUp: true
        // })
        // return false;
        switch (action) {
            case "next":
                console.log(this.state);
                this.setState({ buttonText: action }, () => {
                    this.checkValidation();
                });

                break;
            case "back":
                this.props.clickHandler('back');
                break;
            default:
                console.log(this.state);
                this.setState({ buttonText: action, }, () => {

                    this.checkValidation();
                });
                break;
        }
    }
    addHistory = (param) => {
        console.log(param, "parammmm...")
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner,

            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.rmp_medical_history, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data....", this.state)
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(data.message);
                if (this.state.buttonText == "save_return") {
                    if (this.props.rmp_prescription_data.from == 'appointments') {
                        //this.props.clickHandler('back');

                    } else {
                        setTimeout(() => {
                            this.setState({ showInstruction: true })
                        }, 2000);

                        // this.props.navigation.reset({
                        //     index: 0,
                        //     routes: [{ name: 'MyAccount' }],
                        // });
                    }
                } else if (this.state.buttonText == "next") {
                    if (this.props.rmp_prescription_data.from == 'appointments') {
                        this.props.clickHandler('back');
                    } else {
                        this.props.navigation.push('CommonPage', { rmp_prescription_data: { from: "call" }, type: 'rmp_prescription' });
                    }
                }

            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'errorrrrrr');
            },
        );
    }

    popUpClick = (status) => {
        console.log(status);
        this.setState({ showInstruction: !this.state.showInstruction })
        switch (status) {
            case "back":
                this.props.clickHandler('back');
                break;
            case "proceed":
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
                });
                break;
            default:
                break;
        }

    }
    render() {
        return (
            <View>
                {this.state.showInstruction && (
                    <View style={{
                        zIndex: 2,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title="Alert" msg="Now you can add, edit Medical History/Prescription via My Appointments >> Past Appointments"></CommonPopUp>
                    </View>
                )}

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.mainContent}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <View contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
                        {/* {this.state.showPopUp && (
                        <View style={{
                            zIndex: 2,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: width,
                            height: height,
                        }}>
                            <CommonPopUp clickHandler={this.popUpClick} title="Not Found" msg="No Medical History Found Regarding this Appointment."></CommonPopUp>
                        </View>
                    )} */}


                        <Spinner
                            color={colors.sub_theme}
                            visible={this.state.spinner}
                            textContent={''}
                        />
                        <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.ADD_HISTORY}></HeaderComponent>
                        <View style={{ flex: 1, padding: 20 }}>
                            {Object.keys(this.state.history).length !== 0 && (
                                <View style={styles.headingTextWrapper} >
                                    {Object.keys(this.state.history.member_info).length == 0 && (
                                        <Text style={{ fontSize: 18, color: colors.BLACK_TEXT, fontFamily: 'OpenSans-Regular', }}>{this.state.history.patient_details.vFirstName} |  {this.state.history.patient_details.iAge}   |  {this.state.history.patient_details.eGender} </Text>
                                    )}
                                    {Object.keys(this.state.history.member_info).length != 0 && (
                                        <Text style={{ fontSize: 18, color: colors.BLACK_TEXT, fontFamily: 'OpenSans-Regular', }}>{this.state.history.member_info.vFirstName} |  {this.state.history.member_info.iAge}   |   {this.state.history.member_info.eGender}</Text>
                                    )}
                                </View>
                            )}
                            <View>
                                {Object.keys(this.state.history).length !== 0 && (
                                    <Text style={styles.headingDateText}>{moment(this.state.history.dScheduledDate).format("ddd")}, {moment(this.state.history.dScheduledDate).format("DD-MM-YYYY")}</Text>
                                )}
                            </View>
                            <View>
                                {Object.keys(this.state.history).length !== 0 && (
                                    Object.keys(this.state.history.rmp_details).length != 0 && (
                                        <Text style={{ fontSize: 18, color: colors.sub_theme, alignItems: "flex-start", fontFamily: 'OpenSans-Regular', marginTop: 5, marginBottom: 5 }}>Dr. {this.state.history.rmp_details.vFirstName} {this.state.history.rmp_details.vLastName}  |   {this.state.history.eType == "Initial" ? "Initial Consult" : "Follow Up"}  </Text>
                                    )

                                )}
                                <View style={{ justifyContent: 'center', alignItems: "center" }}>
                                    <View style={styles.inputWraperStyle}>
                                        <View style={{ flex: 2 }}>
                                            <Text style={styles.inputCaptionStyleForFirstCol}>Height <Text style={{ fontSize: 13, color: colors.PLACEHOLDER_TEXT }}>(ft inch)</Text></Text>
                                            <View style={{ flexDirection: "row", paddingRight: 20, }}>

                                                {/*********************** //feet picker*****************************/}
                                                <View style={[styles.feetWrapperStyles, {}]}>
                                                    <Picker
                                                        mode="dropdown"
                                                        iosHeader={'Select Feet'}
                                                        iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 25, }} />}
                                                        style={{ width: '100%', color: colors.BLACK_TEXT }}
                                                        selectedValue={this.state.vHeightFeet}
                                                        textStyle={[styles.stateCouncilTxt]}
                                                        onValueChange={this.onFeetValueChange.bind(this)}
                                                    >
                                                        {feet.map((value, idx) => {
                                                            return (
                                                                <Picker.Item label={value.value} value={value.id} />
                                                            )
                                                        })}


                                                    </Picker>
                                                </View>
                                                {/*********************** //inches picker*****************************/}
                                                <View style={[styles.inchesWrapperStyle, {}]}>
                                                    <Picker
                                                        note
                                                        mode="dropdown"
                                                        textStyle={[styles.stateCouncilTxt]}
                                                        iosHeader={'Select Inches'}
                                                        iosIcon={<Icon name="arrow-down" style={{ color: colors.sub_theme, fontSize: 25, }} />}
                                                        style={{ width: '100%' }}
                                                        selectedValue={this.state.vHeightInch}
                                                        onValueChange={this.onInchesValueChange.bind(this)}
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
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.inputCaptionStyle, { alignItems: 'flex-start', marginLeft: 0 }]}>Weight<Text style={{ fontSize: 13, color: colors.PLACEHOLDER_TEXT }}> (Kg)</Text></Text>
                                            <Form style={{ alignItems: "flex-start", with: "100%", flex: 1 }}>
                                                <Input
                                                    selectionColor={colors.THEME_YELLOW}
                                                    keyboardType='numeric'
                                                    maxLength={5}
                                                    onChangeText={(value) => {
                                                        this.setState({ vWeight: value })
                                                    }}
                                                    value={this.state.vWeight}
                                                    style={styles.inputStyleForWeight}
                                                ></Input>
                                            </Form>

                                        </View>
                                    </View>
                                    <View style={styles.inputWraperStyle}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.inputCaptionStyleForFirstCol}>LMP</Text>
                                            {/********************************************* Date Picker (LMP) ***************/}
                                            <View style={styles.inputStyleDate}>
                                                <DatePicker
                                                    iconSource={calendar}
                                                    showIcon={true}
                                                    style={{ width: '100%' }}
                                                    date={this.state.dLmpDate}
                                                    mode="date"
                                                    placeholder=" "
                                                    format="DD-MM-YYYY"
                                                    minDate="1990-05-01"
                                                    maxDate={new Date()}
                                                    confirmBtnText="Select"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        placeholderText: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 18,
                                                            color: colors.sub_theme,
                                                            padding: 5,
                                                            paddingBottom: 9,
                                                        },
                                                        dateText: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            alignItems: 'flex-start',
                                                            borderWidth: 0,
                                                            fontSize: 15,
                                                            paddingLeft: 10
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
                                                            backgroundColor: colors.card_border,
                                                            borderRadius: 4,
                                                            //  paddingLeft: 5
                                                        }
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={(date) => { this.setState({ dLmpDate: date }) }}
                                                ></DatePicker>

                                                {/* <Image source={calender}
                                            style={styles.calenderIcon}
                                        /> */}
                                            </View>
                                        </View>
                                        {/*************************BMI****************************************/}
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.inputCaptionStyle}>BMI</Text>
                                            <View style={styles.bmiWrapper}>
                                                <Text style={{ fontSize: 15, color: colors.BLACK_TEXT }}>{this.getBMIValue()}</Text>

                                            </View>
                                            {/********************* BP *******************************/}
                                        </View>
                                    </View>
                                    <View style={styles.inputWraperStyle}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.inputCaptionStyleForFirstCol}>BP  </Text>
                                            <Form>
                                                <Input
                                                    keyboardType="numbers-and-punctuation"
                                                    selectionColor={colors.THEME_YELLOW}
                                                    style={styles.inputStyle}
                                                    value={this.state.vBloodPressure}
                                                    onChangeText={(value) => { this.setState({ vBloodPressure: value }) }}
                                                ></Input>
                                            </Form>

                                            {/********************* temp *******************************/}
                                        </View >
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.inputCaptionStyle}>Temp<Text style={styles.subCaptionInputStyle}> (C) </Text> </Text>
                                            <Form style={{ alignItems: "flex-end" }}>
                                                <Input
                                                    selectionColor={colors.THEME_YELLOW}
                                                    keyboardType="numeric"
                                                    maxLength={5}
                                                    onChangeText={(value) => { this.setState({ vBodyTemp: value }) }}
                                                    style={styles.inputStyle}
                                                    value={this.state.vBodyTemp}
                                                ></Input>
                                            </Form>

                                        </View>
                                    </View>
                                    {/*****************Text Field Area************************/}



                                    <Text style={styles.oddTextCaptionStyle}>DIAGNOSIS/PROVISIONAL DIAGONOSIS</Text>
                                    <Textarea
                                        selectionColor={colors.THEME_YELLOW}
                                        style={styles.textAreaStyle}
                                        rowSpan={5} bordered
                                        value={this.state.tDiagnosis}
                                        onChangeText={(value) => { this.setState({ tDiagnosis: value }) }}
                                    />



                                    <Text style={styles.evenTextAreaCaptionStyle}>CHIEF COMPLAINTS</Text>
                                    <Textarea
                                        selectionColor={colors.THEME_YELLOW}
                                        style={styles.textAreaStyle}
                                        rowSpan={5} bordered
                                        value={this.state.tChiefComplaints}
                                        onChangeText={(value) => { this.setState({ tChiefComplaints: value }) }}
                                    />


                                    <Text style={styles.oddTextCaptionStyle}>RELEVANT HISTORY</Text>
                                    <Textarea
                                        selectionColor={colors.THEME_YELLOW}
                                        style={styles.textAreaStyle}
                                        rowSpan={5} bordered
                                        value={this.state.tRelevantHistory}
                                        onChangeText={(value) => { this.setState({ tRelevantHistory: value }) }}
                                    />


                                    <Text style={styles.evenTextAreaCaptionStyle}>EXAMINATION/LAB FINDINGS</Text>
                                    <Textarea
                                        selectionColor={colors.THEME_YELLOW}
                                        style={styles.textAreaStyle}
                                        rowSpan={5} bordered
                                        value={this.state.tExaminationLabTest}
                                        onChangeText={(value) => { this.setState({ tExaminationLabTest: value }) }}
                                    />


                                    <Text style={styles.oddTextCaptionStyle}>SUGGESTED INVESTIGATIONS</Text>
                                    <Textarea
                                        selectionColor={colors.THEME_YELLOW}
                                        style={styles.textAreaStyle}
                                        rowSpan={5} bordered
                                        value={this.state.tSuggestedInvestigation}
                                        onChangeText={(value) => { this.setState({ tSuggestedInvestigation: value }) }}
                                    />

                                    <Text style={styles.evenTextAreaCaptionStyle}>SPECIAL INSTRUCTIONS</Text>
                                    <Textarea
                                        selectionColor={colors.THEME_YELLOW}
                                        style={styles.textAreaStyle}
                                        rowSpan={5} bordered
                                        value={this.state.tSpecialInstructions}
                                        onChangeText={(value) => { this.setState({ tSpecialInstructions: value }) }}
                                    />
                                </View>
                            </View>
                            {/********************************Buttons****************************/}

                            {this.props.rmp_prescription_data.from == 'appointments' && (
                                <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-around', flex: 1, }}>
                                    <Button onPress={() => {

                                        this.navigator('save_return')
                                    }
                                    }
                                        style={[styles.saveButtonContainer, { flex: 1 }]}>
                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', }}>{'   '}Save {'  '}</Text>
                                    </Button>

                                    {/* <Button full bordered onPress={() => this.navigator('save_return')}
                                    style={[styles.saveButtonContainer, { backgroundColor: 'transparent', borderColor: colors.THEME_YELLOW }]}>
                                    <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', color: colors.THEME_YELLOW }}>Save & Return</Text>
                                </Button> */}
                                </View>
                            )}

                            {this.props.rmp_prescription_data.from != 'appointments' && (
                                <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
                                    <Button full onPress={() => this.navigator('save_return')}
                                        style={styles.saveButtonContainer}>
                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', }}>Save & Return</Text>
                                    </Button>
                                    <Button full
                                        style={[styles.editButtonContainer, { marginTop: 20 }]}
                                        onPress={() => this.navigator('next')}>
                                        <Text style={{ fontSize: 20, fontFamily: 'OpenSans-Regular', }}>Add/Edit Prescription </Text>
                                    </Button>
                                </View>
                            )}





                        </View>
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
export default connect(mapStateToProps, {})(AddMedicalHistory);

