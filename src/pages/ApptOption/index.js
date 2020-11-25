//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';

import StateListing from '@components/StateListing';
import {
    Container,
    ActionSheet,
    Icon,
    Content,
    Left,
    Button,
    Body,
    Right,
    Title,
    Toast,
    Item,
    CheckBox,
    ListItem,
    Picker
} from 'native-base';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import moment from 'moment';
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
// create a component
var Gender = ["Male", "Female", "Others", "Cancel"];
var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const calendar = require('../../assets/imgs/calendar.png');
import Camera from '@components/Camera';
import { setMember, setDateTime, setUserData } from "../../actions"
import { connect } from "react-redux";
const dateObj = new Date();
import RazorpayCheckout from 'react-native-razorpay';
import PatientRegister from "../PatientRegister";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
// create a component
class ApptOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dScheduledDate: moment(this.props.appt_data.dScheduledDate).format("DD-MM-YYYY"),
            dTime: moment(this.props.appt_data.dTime, "HH:mm:ss").format("hh:mm A"),
            eMode: 'Video',
            ePurpose: '',
            iFamilyMemberId: 'MySelf',
            eType: 'Initial',
            spinner: false,
            isRegistered: true,

        };
    }

    startPayment = (fees) => {
        var options = {
            description: 'Appointment Consultation Fees',
            // image: 'https://www.talktomedic.in/assets/web/images/ic_launcher.png',
            currency: 'INR',
            // key: 'rzp_test_tcd4Yy6Q8OlCde',
            key: 'rzp_live_OD0kknoemJXCtm',
            amount: fees,
            name: this.props.user_data.vFirstName,
            prefill: {
                email: '',
                contact: this.props.user_data.vMobileNo,
                name: this.props.user_data.vFirstName + ' ' + this.props.user_data.vLastName
            },
            // theme: { color: '#066DAE' },
            payment_capture: 1
        }
        console.log(options, "optins...")
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            console.log(data, "payment succcsess");
            this.bookAppointment(data.razorpay_payment_id)
            //  alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            console.log(error, "payment succcserroress")
            //  alert(`Error: ${error.code} | ${error.description}`);
        });
    }

    bookAppointment = (id) => {
        console.log(this.state, "booking.....");
        console.log("book app", id);
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        var param = {
            vTransactionId: id,
            iUserId: this.props.appt_data.iUserId,
            //    iAvailabilityId: this.state.selectedDoctor.iAvailabilityId,
            treatments: this.props.appt_data.treatments,
            eType: this.props.appt_data.eType,
            ePurpose: this.props.appt_data.ePurpose,
            eMode: this.props.appt_data.eMode,
            dTime: this.props.appt_data.dTime,
            dScheduledDate: this.props.appt_data.dScheduledDate,
            iFamilyMemberId: this.props.appt_data.iFamilyMemberId == "MySelf" ? null : this.props.appt_data.iFamilyMemberId,
            eApptType: "Scheduled",
            // iDuration: "15",
            iDuration: this.props.appt_data.eType === "Initial" ? this.props.appt_data.iFirstConsultDuration : this.props.appt_data.iFollowConsultDuration,
            fAppointmentFee: this.props.appt_data.eType === "Initial" ? this.props.appt_data.fFirstConsultFee : this.props.appt_data.fFollowConsultFee,
        }
        console.log(param, "parasm....");

        postApiRequestWithHeaders(data.api_endpoint.book_appointment, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                setTimeout(() => {
                    this.setState({
                        spinner: !this.state.spinner
                    });
                }, 100);
                showToast(data.message);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'CommonPage', params: { type: 'thanks_booking' } }],
                });
                console.log(this.props)
            },
            error => {
                setTimeout(() => {
                    this.setState({
                        spinner: !this.state.spinner
                    });
                }, 100);
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    componentDidMount() {
        this.getMembers();
    }


    getMembers = () => {
        postApiRequestWithHeaders(data.api_endpoint.getMember, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.props.setMember(data.family_members);
            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    selectOption = (type, status) => {
        switch (type) {
            case "mode":
                this.setState({ eMode: status })
                break;
            case "purpose":
                this.setState({ ePurpose: status })
                break;

            default:
                break;
        }
    }

    checkValidation = () => {
        console.log(moment(this.state.dTime, 'hh:mm A').format('mm'), "minutes");
        var minutes = moment(this.state.dTime, 'hh:mm A').format('mm');
        console.log("min", minutes);
        if (minutes % 15 != 0) {
            showToast("Please select time in 15 minutes interval. ");
        }
        else if (this.state.eMode == '') {
            showToast(data.ToastMessages.mode);
        }

        else if (this.state.ePurpose == '') {
            showToast(data.ToastMessages.purpose);
        } else {
            console.log(this.state.dTime)
            if (this.props.user_data.vFirstName == "Guest" && this.props.user_data.vLastName == "Patient") {

                this.props.setDateTime(this.state);
                this.setState({
                    isRegistered: false
                });
            } else {
                this.props.setDateTime(this.state);
                this.state.eType == 'Initial' ? this.startPayment(String(parseInt(this.props.appt_data.fFirstConsultFee) * 100)) : this.startPayment(String(parseInt(this.props.appt_data.fFollowConsultFee) * 100));
            }
        }

    }

    navigator = (action, data) => {
        console.log(action, data, "callback", this.state);
        switch (action) {
            case "next":
                this.checkValidation();

                break;
            case "back":
                this.props.navigation.goBack();
                break;
            case "add_member":
                this.props.navigation.navigate("AddMember");
                // this.props.navigation.push('CommonPage', { type: 'family_member' });
                break;
            default:
                break;
        }
    }
    onValueChange(value) {
        this.setState({
            iFamilyMemberId: value
        });
    }

    pad(n, width) {
        n = n + '';
        return n.length >= width ? n :
            new Array(width - n.length + 1).join('0') + n;
    }

    timePickerHandler = (date) => {
        var date = new Date(date.nativeEvent.timestamp);
        let hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        let am_pm = date.getHours() >= 12 ? "PM" : "AM";
        let minutes = this.pad(date.getMinutes(), 2);
        this.setState({ dTime: this.pad(hours, 2) + ":" + minutes + " " + am_pm, dateTimeVisible: false });
    }

    /********METHOD FOR PATTIENT REGISTRATION PAGE HANDLER*******/
    patientNavigatior = (action, data) => {
        console.log(action, data, "dataHandle");
        switch (action) {
            case "backPage":
                this.setState({
                    isRegistered: true
                })
                break;
            case "update_profile":
                console.log(data)
                this.upDateUser(data);
                break;
            default:
                break;
        }
    }

    /********UPDATE USER DETAILS********/
    upDateUser = (param) => {
        this.setState({
            spinner: !this.state.spinner,
        });
        postApiRequestWithHeaders(data.api_endpoint.update_profile, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.props.setUserData(data.user);
                this.setState({
                    spinner: !this.state.spinner,
                    isRegistered: true
                });
                showToast("Profile Updated Successfully.");
                setTimeout(() => {
                    this.state.eType == 'Initial' ? this.startPayment(String(parseInt(this.props.appt_data.fFirstConsultFee) * 100)) : this.startPayment(String(parseInt(this.props.appt_data.fFollowConsultFee) * 100));
                }, 100);

            },
            error => {

                this.setState({
                    spinner: !this.state.spinner,
                    isRegistered: true
                });
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    render() {
        return (
            <Container>
                {this.state.isRegistered && (
                    <>
                        <Spinner
                            color={colors.sub_theme}
                            visible={this.state.spinner}
                            textContent={''}
                        />
                        <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.CHOOSE_OPTION}></HeaderComponent>


                        <ScrollView>
                            <View style={styles.mainContainer}>
                                <Text style={styles.headingTextMain}>
                                    Specify for whom you are Booking this Appoinment
                        </Text>
                                <View>
                                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', }}>

                                        <View style={{ flex: 1, }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                <Text style={[styles.headingText, { color: colors.PLACEHOLDER_TEXT, fontSize: 15, }]}>(choose yourself or a relation) </Text>

                                                <TouchableOpacity onPress={() => this.navigator("add_member")}>

                                                    <Text style={[styles.headingText, { color: colors.THEME_YELLOW, textDecorationLine: 'underline', fontSize: 15 }]}>Add Member</Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View style={[styles.numberInputContainerRow, { fontSize: 20, padding: 0 }]}>
                                                <Picker
                                                    note
                                                    iosIcon={<Icon name="ios-arrow-down" style={{ color: colors.sub_theme, fontSize: 20 }} />}
                                                    iosHeader="Relations"
                                                    mode="dropdown"
                                                    textStyle={[styles.numberInput]}
                                                    style={[{ width: "100%" }]}
                                                    selectedValue={this.state.iFamilyMemberId}
                                                    onValueChange={this.onValueChange.bind(this)}
                                                >
                                                    <Picker.Item label="MySelf" value="MySelf" />
                                                    {this.props.family_member.map((value, idx) => {
                                                        return (
                                                            <Picker.Item label={value.vFirstName + " (" + value.eRelationType + ")"} value={value.iFamilyMemberId} />
                                                        )
                                                    })}
                                                </Picker>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', }}>
                                        <View style={{ flex: 1, }}>
                                            <Text style={[styles.headingText,]}>Date</Text>
                                            <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                                <Item style={{
                                                    borderBottomWidth: 0,
                                                    backgroundColor: "white",
                                                }} >
                                                    <DatePicker
                                                        disabled={true}
                                                        allowFontScaling={true}
                                                        style={{ width: '100%', backgroundColor: "white", }}
                                                        showIcon={true}
                                                        iconSource={calendar}
                                                        date={this.state.dScheduledDate}
                                                        mode="date"
                                                        placeholder="DD-MM-YYYY"
                                                        format="DD-MM-YYYY"
                                                        minDate={moment().format("DD-MM-YYYY")}
                                                        //maxDate="01-01-2015"
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
                                                                fontSize: 18,
                                                                backgroundColor: "white",
                                                            },
                                                            dateInput: {
                                                                fontFamily: 'OpenSans-Regular',
                                                                alignItems: 'flex-start',
                                                                borderWidth: 0,
                                                                fontSize: 18,
                                                                backgroundColor: "white",
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
                                                                backgroundColor: "white",
                                                                borderRadius: 4,
                                                            }
                                                            // ... You can check the source to find the other keys.
                                                        }}
                                                        onDateChange={date => {
                                                            this.setState({ dScheduledDate: date })
                                                        }}
                                                    />
                                                </Item>

                                            </View>
                                        </View>
                                        <View style={{ flex: 1, paddingLeft: 5 }}>
                                            <Text style={styles.headingText}>Time</Text>
                                            <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                                <Item style={{
                                                    borderBottomWidth: 0,
                                                }} >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            //  this.setState({ dateTimeVisible: true })
                                                        }}>
                                                        <Text
                                                            style={[styles.numberInput, { padding: 8 }]}>
                                                            {this.state.dTime}
                                                        </Text>
                                                    </TouchableOpacity>


                                                    {this.state.dateTimeVisible ? (
                                                        <DateTimePicker
                                                            allowFontScaling={true}
                                                            timeZoneOffsetInMinutes={0}
                                                            value={this.state.timePickerVal}
                                                            mode="time"
                                                            is24Hour={true}
                                                            showIcon={false}
                                                            iconSource={calendar}
                                                            display="spinner"
                                                            onChange={date => {
                                                                this.timePickerHandler(date);
                                                            }}
                                                            placeholder='Time'
                                                        />
                                                    ) : <Text></Text>}
                                                </Item>

                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', }}>

                                        <View style={{ flex: 1, }}>
                                            <Text style={[styles.headingText,]}>Purpose of Appointment</Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity
                                                    onPress={() => this.selectOption("purpose", "Emergency")}
                                                    style={[styles.numberInputContainerBlock, { borderColor: colors.sub_theme, marginRight: 10 }, this.state.ePurpose == "Emergency" ? { backgroundColor: colors.sub_theme } : {}, { flex: 2 }]}>
                                                    <View>
                                                        <Text style={[
                                                            styles.body_style, { color: colors.sub_theme }, this.state.ePurpose == "Emergency" ? { color: colors.LIGHT_COLOR } : {},
                                                        ]}> Emergency</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => this.selectOption("purpose", "Non Emergency")}
                                                    style={[styles.numberInputContainerBlock, this.state.ePurpose == "Non Emergency" ? { backgroundColor: colors.sub_theme } : {}, { flex: 3 }]}>
                                                    <View>
                                                        <Text style={[
                                                            styles.body_style, this.state.ePurpose == "Non Emergency" ? { color: colors.LIGHT_COLOR } : {}, {}
                                                        ]}> Non-Emergency</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', }}>

                                        <View style={{ flex: 1, }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                <Text style={styles.headingText}>
                                                    Is This Your
                                        </Text>
                                            </View>
                                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', marginRight: 15 }}>

                                                <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                                                    checked={this.state.eType == "Initial" ? true : false}
                                                    onPress={() => this.setState({ eType: "Initial" })}
                                                    hitSlop={hitSlop}
                                                />
                                                <Body style={{ alignItems: 'flex-start' }}>
                                                    <TouchableOpacity onPress={() => this.setState({ eType: "Initial" })} hitSlop={hitSlop}>
                                                        <Text style={styles.checkboxText}>First Consult?</Text>
                                                    </TouchableOpacity>
                                                </Body>
                                            </View>

                                            <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', marginRight: 15 }}>
                                                <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                                                    checked={this.state.eType == "Follow Up" ? true : false}
                                                    onPress={() => this.setState({ eType: "Follow Up" })}
                                                    hitSlop={hitSlop}
                                                />
                                                <Body style={{ alignItems: 'flex-start', flexDirection: 'row' }}>

                                                    <TouchableOpacity onPress={() => this.setState({ eType: "Follow Up" })} hitSlop={hitSlop}>
                                                        <Text style={styles.checkboxText}>Follow-up Consult?</Text>
                                                    </TouchableOpacity>
                                                </Body>
                                            </View>
                                        </View>

                                    </View>

                                    <View style={{ marginTop: 30, }}>
                                        <Button style={styles.nextButtonContainer}
                                            onPress={() => {
                                                this.navigator('next');
                                            }} >
                                            <Text style={styles.nextButton}>
                                                {
                                                    this.props.user_data.vFirstName == "Guest" && this.props.user_data.vLastName == "Patient" ? "Proceed" : "Proceed to Payment"
                                                }
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </>
                )}

                {!this.state.isRegistered && (
                    <PatientRegister
                        spinner={this.state.spinner}
                        clickHandler={this.patientNavigatior.bind(this)} />
                )}
            </Container>
        );
    }
}

function mapStateToProps(state) {
    console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData,
        family_member: state.family_member,
        appt_data: state.appointment_booking_data
    }
}

export default connect(mapStateToProps, { setMember, setDateTime, setUserData })(ApptOption);
