//import liraries
import React, { Component } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Dimensions, SafeAreaView } from 'react-native';
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
} from 'native-base';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
    clearLocalStorage,
    networkCheck
} from '../../common/user';
import CommonPopUp from '@components/CommonPopUp';
import TimerPopUp from '@components/TimerPopUp';
import moment from 'moment';
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
import { colors, constant, data } from '../../common/index';
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles from './styles';
var { width, height } = Dimensions.get('window');
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
import { setSessionData } from "../../actions"
import RefundPopUp from '@rmp_components/RefundPopUp';
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { removeUser, setLocation, setComplete, setStateList, setTreatment, setStateCouncil, setSpeciality, setRelation, setAppVersion } from "../../actions";
import RNCallKeep from 'react-native-callkeep';
// create a component//e10adc3949ba59abbe56e057f20f883e
class Appointments extends Component {
    constructor(props) {
        super(props);
        console.log(props, "props")
        this.state = {
            selectedData: {},
            fRefundAmount: '',
            selectedIndex: 0,
            upcoming_appointments: [],
            past_appointments: [],
            spinner: false,
            showPastMessage: false,
            showUpcomingMessage: false,
            showPopUp: false,
            showTimer: false,
            timer_msg: '',
            timer_title: '',
            timer: {
                days: '0',
                hours: '0',
                minutes: '',
                seconds: '',
            },
            showRefundPopUp: false,
            isLogoutShow: true,
            showUpdatePopup: false,
            showNetworkPopup: false
        };
    }

    componentDidMount() {
        networkCheck().then(data => {
            if (!data) {
                this.setState({
                    showNetworkPopup: true,
                })
            } else {
                this.setState({
                    showNetworkPopup: false,
                    fieldFocus: true
                })
            }
        });

        Geolocation.getCurrentPosition(info => {
            console.log(info, "current");
            this.setState({
                vLat: String(info.coords.latitude),
                vLng: String(info.coords.longitude)
            })
            this.props.setLocation({ lat: String(info.coords.latitude), lng: String(info.coords.longitude) });
        }, error => {
            console.log("location error", error);
            this.setState({
                vLat: "30.7162",
                vLng: "76.7776"
            })
            this.props.setLocation({ lat: "30.7162", lng: "76.7776" })
            if (error.PERMISSION_DENIED == 1) {
                console.log("denianle")
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                // Geolocation.requestAuthorization();
            }
        });

        check(PERMISSIONS.ANDROID.CAMERA)
            .then((result) => {
                switch (result) {
                    case RESULTS.DENIED:
                        request(PERMISSIONS.ANDROID.CAMERA);
                        break;
                    case RESULTS.GRANTED:
                        RNCallKeep.setup({
                            ios: {
                                appName: "TalkToMedic",
                                imageName: 'calling'
                            },
                            android: {
                                alertTitle: 'Permissions required',
                                alertDescription: 'This application needs to access your phone accounts',
                                cancelButton: 'Cancel',
                                okButton: 'ok',
                            },
                        });
                        break;
                    case RESULTS.BLOCKED:
                        request(PERMISSIONS.ANDROID.CAMERA);
                        break;
                }
            });

        setTimeout(() => {
            if (this.props.app_version.length > 0) {
                const isPopup = data.current_version >= this.props.app_version ? false : true;
                this.setState({ showUpdatePopup: isPopup });
            }
        }, 1000)


        if (this.props.route != undefined) {
            if (this.props.route.params != undefined) {
                if (this.props.route.params.type == 'my_appt') {
                    this.props.navigation.navigate('CommonPage', { type: 'appointments' });
                }
                else if (this.props.route.params.type == 'consult') {
                    this.props.navigation.navigate('CommonPage', { type: 'consult_doctor' });
                }
                else if (this.props.route.params.type == 'practice_detail') {
                    showToast("You must fill in your practice details.")
                    this.props.navigation.navigate('CommonPage', { type: 'practice_detail' });
                }
                else if (this.props.route.params.type == 'ViewPatientReports') {
                    this.props.navigation.navigate('ViewPatientReports');
                }
            }
        }
        if (this.props.user_data.iRoleId != constant.ROLE_PATIENT) {
            this.checkCompletess();
        }


        clearInterval(this._interval);
        this.getAppointments();
    }

    getCommonDetails = () => {
        getApiRequest(data.api_endpoint.get_countries).then(
            data => {
                //   console.log(data, "getCommonDetailsall data....")
                this.props.setStateList(data.states);
                this.props.setTreatment(data.treatments);
                this.props.setStateCouncil(data.medical_councils);
                this.props.setSpeciality(data.specialties);
                this.props.setRelation(data.famility_relations);
                this.props.setAppVersion(data.app_version);
            },
            error => {
                //  console.log(error, 'errorrrrrr');
            },
        );
    };


    checkCompletess = (token) => {
        postApiRequestWithHeaders(data.api_endpoint.user_complete, {}, this.props.user_data.vAccessToken).then(
            data => {
                // console.log(data, "checkCompletess");
                this.props.setComplete(data.profile_status);
            },
            error => {
                // console.log(error, 'errorrrrrr');
            },
        );
    }

    PopUpClickHandler = (action) => {
        console.log(action, "actionnnnn")

        switch (action) {
            case "cancel":
                // this.props.navigation.navigate("Book Appointment");
                this.setState({
                    isLogoutShow: false
                })
                break;

            default:
                break;
        }

        if (action == "SplashScreen") {
            networkCheck().then(data => {
                if (!data) {
                    this.setState({
                        showNetworkPopup: true,
                    })
                } else {
                    this.setState({
                        showNetworkPopup: false,
                    });
                    this.getCommonDetails();
                }
            });
            return;
        }

        this.setState({ showLogoutPopUp: !this.state.showLogoutPopUp })
        if (action == "logout") {
            clearLocalStorage('user_details').then(data => {
                this.props.removeUser();
                console.log(data, "remove key")
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'EnterPhoneNumber' }],
                });

            });
        }
    }

    getAppointments = () => {
        // console.log(this.props.user_data.iUserId, "ids....s")
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.my_appointments, { iUserId: this.props.user_data.iUserId }, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                //   console.log(data, "data.....");
                this.setState({
                    upcoming_appointments: data.upcoming_appointments,
                    past_appointments: data.past_appointments,
                    showPastMessage: true,
                    showUpcomingMessage: true
                })

            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                //  console.log(error, 'errorrrrrr');
            },
        );
    }
    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };
    refundAmount = (type, amount) => {
        var param = {
            vTransactionId: this.state.selectedData.vTransactionId,
            fRefundAmount: amount
        }
        //   console.log(param);
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.refund, param, this.props.user_data.vAccessToken).then(
            data => {
                showToast(data.message);
                this.props.clickHandler('back');
                //   console.log(data, "data.....");
                this.setState({
                    spinner: !this.state.spinner
                });
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
    getRefundAmount = (param, status) => {
        //.log(param, "lkjjl", this.state)
        var params = {
            vTransactionId: param.vTransactionId
        }
        //  console.log(params, "param....s")
        //  return false;
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.max_refund_amount, params, this.props.user_data.vAccessToken).then(
            res => {
                //   console.log(res, res.fRefundAmount, "data.....", param);
                // this.setState({
                //     vTransactionId: param.vTransactionId,
                //     fRefundAmount: res.fRefundAmount.toString(),
                //     showLogoutPopUp: true,

                // })
                if (status == "cancel") {
                    if (!param.bIsRefundable) {
                        this.setState({ fRefundAmount: res.fRefundAmount.toString(), showPopUp: true, timer_title: "Cancel Appointment", timer_msg: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? "You are about to cancel this appointment. You will be notified of Refund, if applicable, as per cancellation policy." : "You are about to cancel this appointment. Patient will be notified of Refund, if applicable, as per cancellation policy." })
                    } else {
                        this.setState({ fRefundAmount: res.fRefundAmount.toString(), showPopUp: true, timer_title: "Cancel Appointment", timer_msg: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? "You are about to cancel this appointment. You will be notified of Refund, if applicable, as per cancellation policy." : "You are about to cancel this appointment. Patient will be notified of Refund, if applicable, as per cancellation policy." })
                    }
                } else {
                    this.setState({
                        vTransactionId: param.vTransactionId,
                        fRefundAmount: res.fRefundAmount.toString(),
                        showRefundPopUp: true,

                    })
                }


                // console.log(this.state)
                this.setState({
                    spinner: !this.state.spinner
                });
            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                // console.log(error, 'errorrrrrr');
            },
        );
    }


    buttonAction = (status, item) => {
        // console.log(status, item, "button Action");
        // console.log(item, "ak");
        this.setState({
            selectedData: item
        }, () => {
            console.log("saved....", this.state)
        })
        switch (status) {
            case "add_reports":
                this.props.navigation.push('PatientReports',
                    { data: { appointmentId: item.iAppointmentId, reports: "", apptDate: item.dScheduledDate, role: this.props.user_data.iRoleId } });
                break;
            case "cancel":

                this.getRefundAmount(item, status);
                if (!item.bIsRefundable) {

                } else {

                }
                // this.setState({ showPopUp: true, timer_title: "Cancel", timer_msg: "info" })
                //  this.props.navigation.navigate('CancelAppt', { iAppointmentId: item.iAppointmentId });
                break;
            case "rmp_prescription": {
                this.props.navigation.push('CommonPage', { rmp_prescription_data: { id: item.iAppointmentId, from: "appointments" }, type: 'rmp_prescription' });
                break;
            }
            case "patient_prescription": {
                this.props.navigation.push('CommonPage', { prescData: { iAppointmentId: item.iAppointmentId, from: "appointments" }, type: 'prescription' });
                break;
            }
            case "patient_book": {
                // this.props.navigation.push('CommonPage', { type: 'consult_doctor' });
                this.props.navigation.navigate("Book Appointment")
                break;

            }
            case "refund": {
                this.setState({
                    selectedData: item
                })
                this.getRefundAmount(item, status);
                break;
            }
            case "rmp_medical_history": {
                this.props.navigation.push('CommonPage', { rmp_prescription_data: { id: item.iAppointmentId, from: "appointments" }, type: 'rmp_medical_history' });
                break;
            }
            case "rmp_upcoming_history": {
                this.props.navigation.push('CommonPage', { rmp_prescription_data: { data: item, from: "appointments" }, type: 'rmp_upcoming_history' });
                break;
            }
            case "start_consult":
                // console.log('object', item);
                // console.log(moment(item.dScheduledDate).format("MMM DD, YYYY HH:mm:ss"))
                var countDownDate = new Date(moment(item.dScheduledDate).format("MMM DD, YYYY HH:mm:ss")).getTime();

                //  console.log(countDownDate, "countDownDate..")
                // Get today's date and time
                var now = new Date().getTime();
                //var now = new Date("May 26, 2020 10:30:23").getTime();
                // console.log(now, "Now...")
                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                //  console.log(days, hours, minutes, seconds);
                if (days == 0 && hours == 0 && (minutes > 0 || seconds > 0)) {
                    // console.log("show pop timer");
                    this.setState({
                        timer_msg: `Your Appointment will start at ${moment(item.dScheduledDate).format("DD-MM-YYYY hh:mm A")}`,
                        timer_title: 'Not Started',
                        showTimer: true
                    })
                    var secondsOnly = minutes * 60 + seconds;
                    this.startTimer(secondsOnly, item.dScheduledDate, item.iAppointmentId);

                }
                else if (days == 0 && hours > 0) {
                    this.setState({
                        timer_msg: `Your Appointment is after ${hours}h : ${minutes}m : ${seconds}s ${'\n'} Please wait.`,
                        timer_title: ' ',
                        showPopUp: true
                    })
                }
                else if (days > 0) {
                    this.setState({
                        timer_msg: `Your Appointment is after ${hours}h : ${minutes}m : ${seconds}s ${'\n'}Please wait.`,
                        timer_title: ' ',
                        showPopUp: true
                    })
                }

                else if (days == -1 && hours == -1 && (minutes < 0 && minutes < -parseInt(item.iDuration))) {
                    this.setState({
                        timer_msg: `You have missed your appointment ${minutes * -1} min ago. Please refresh your page.`,
                        timer_title: 'Missed',
                        showPopUp: true
                    })
                }

                else if (days < -1 && hours <= -1 && minutes <= -1) {
                    this.setState({
                        timer_msg: `You have missed your appointment. Please refresh your page.`,
                        timer_title: 'Missed',
                        showPopUp: true
                    })
                } else {
                    //  console.log("esleee")
                    this.getSessionDetails(item.iAppointmentId);
                }
            default:
                break;
        }
    }

    getSessionDetails = (id) => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        var param = {
            iAppointmentId: id
        }
        postApiRequestWithHeaders(data.api_endpoint.getSession, param, this.props.user_data.vAccessToken).then(
            data => {
                //  console.log(data, "data.....");
                this.props.setSessionData(data.session_detail);
                this.setState({
                    spinner: !this.state.spinner
                });
                this.props.navigation.push('CommonPage', { type: 'audio_setting_appt' });
            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                //  console.log(error, 'errorrrrrr');
            },
        );
    }

    startTimer = (secondsOnly, dateTime, iAppointmentId) => {
        // console.log(secondsOnly, "timr", dateTime);
        setTimeout(() => {
            this.refs.child.startTimer(secondsOnly, dateTime, iAppointmentId)
        }, 1000);
    }

    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');

                break;
            }
            case 'back': {
                //  console.log('back');
                this.props.clickHandler('back');
                break;
            }
        }
    }

    _renderItem = (item) => {
        return (

            <View style={{
                borderBottomWidth: 1, paddingBottom: 15, paddingTop: 0, borderColor: colors.PLACEHOLDER_TEXT,
                marginBottom: item.index == data.problems.length - 1 ? 150 : 20
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <Text style={styles.secondRow}>{moment(item.item.dScheduledDate).format("DD-MM-YYYY")}</Text>
                    </View>
                    <View>
                        <Text style={styles.secondRow}>{moment(item.item.dScheduledDate).format("hh:mm A")}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 2 }]}>
                        <Text style={styles.secondRow}>{this.props.user_data.iRoleId != constant.ROLE_PATIENT ? item.item.vPatientName : item.item.vDoctorName}</Text>
                    </View>
                    <View >
                        <Text style={[styles.secondRow, { fontFamily: 'OpenSans-Regular' }]}>{this.props.user_data.iRoleId != constant.ROLE_PATIENT ? item.item.iAge + ", " + item.item.eGender : item.item.eRelationType == null ? "For MySelf" : "For " + item.item.eRelationType}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    {/* <View style={styles.thirdRowContainer}>
                        <Text style={styles.thirdRow}> {this.props.user_data.iRoleId != constant.ROLE_PATIENT ? item.item.iAge + ", " + item.item.eGender : item.item.eRelationType == null ? "For MySelf" : "For " + item.item.eRelationType}</Text>
                    </View> */}
                    <View style={styles.thirdRowContainer}>
                        <Text style={styles.thirdRow}>{item.item.eType == "Initial" ? "Initial Consult" : "Follow Up"}</Text>
                    </View>
                    <View>
                        <Text style={[styles.thirdRow, { fontWeight: 'bold' }]}>Rs {item.item.fAppointmentFee}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: 0 }}>
                    <Button onPress={() => this.buttonAction("start_consult", item.item)} light style={{ backgroundColor: colors.geen_txt, marginRight: 10 }}>
                        <Text style={styles.btnText} >Start Consult</Text>
                    </Button>
                    <Button onPress={() => {
                        this.setState({
                            selectedData: item
                        }, () => {
                            //   console.log("saved....", this.state);
                            this.buttonAction("cancel", item.item)
                        })
                    }} bordered light style={{ borderColor: colors.danger, marginRight: 20 }}>
                        <Text style={[styles.btnText, { color: colors.danger }]}>Cancel</Text>
                    </Button>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                        <Button onPress={() => this.buttonAction("rmp_upcoming_history", item.item)} bordered light style={{ borderColor: colors.THEME_YELLOW, marginRight: 20, }}>
                            <Text numberOfLines={2} style={[styles.btnText, { color: colors.THEME_YELLOW }]}>View Medical History</Text>
                        </Button>


                    )}
                </View>
                {this.props.user_data.iRoleId != constant.ROLE_PATIENT && item.item.reports.length > 0 ? (
                    <View style={{ marginTop: 5 }}>
                        <Button onPress={() => this.buttonAction("add_reports", item.item)} block light style={{ backgroundColor: colors.poor_color, marginRight: 20, flex: 1, height: 40, justifyContent: 'center' }}>
                            <Text style={[styles.btnText,
                                // { color: colors.THEME_YELLOW }
                            ]}>Lab/Test Reports</Text>
                        </Button>
                    </View>
                ) : this.props.user_data.iRoleId == constant.ROLE_PATIENT ? (
                    <View style={{ marginTop: 5 }}>
                        <Button onPress={() => this.buttonAction("add_reports", item.item)} block light style={{ backgroundColor: colors.poor_color, marginRight: 20, flex: 1, height: 40, justifyContent: 'center' }}>
                            <Text style={[styles.btnText,
                                // { color: colors.THEME_YELLOW }
                            ]}>Lab/Test Reports</Text>
                        </Button>
                    </View>
                ) : null}

            </View>

        )
    }

    _renderPastItem = (item) => {
        return (
            <View style={{
                borderBottomWidth: 1, paddingBottom: 20, paddingTop: 0, borderColor: colors.PLACEHOLDER_TEXT,
                marginBottom: item.index == data.problems.length - 1 ? 150 : 20
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <Text style={styles.secondRow}>{moment(item.item.dScheduledDate).format("DD-MM-YYYY")}</Text>
                    </View>
                    <View>
                        <Text style={styles.secondRow}>{moment(item.item.dScheduledDate).format("hh:mm A")}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 2 }]}>
                        <Text style={styles.secondRow}>{this.props.user_data.iRoleId != constant.ROLE_PATIENT ? item.item.vPatientName : item.item.vDoctorName}</Text>
                    </View>
                    <View >
                        <Text style={[styles.secondRow, { fontFamily: 'OpenSans-Regular' }]}>{this.props.user_data.iRoleId != constant.ROLE_PATIENT ? item.item.iAge + ", " + item.item.eGender : item.item.eRelationType == null ? "For MySelf" : "For " + item.item.eRelationType}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={styles.thirdRowContainer}>
                        <Text style={styles.thirdRow}>{item.item.eType == "Initial" ? "Initial Consult" : "Follow Up"}</Text>
                    </View>
                    <View>
                        <Text style={[styles.thirdRow, { fontWeight: 'bold' }]}>Rs {item.item.fAppointmentFee}</Text>
                    </View>
                </View>
                {item.item.eStatus == "cancelled" && (
                    <View>
                        <Text style={[styles.thirdRow, { color: colors.danger, fontFamily: 'OpenSans-Bold', }]}>Cancelled | {item.item.eCancelledReason}</Text>

                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && (
                            <Button block onPress={() => this.buttonAction("patient_book", item.item)} bordered light style={{ borderColor: colors.geen_txt, marginTop: 10, height: 60, justifyContent: 'center', width: 150 }}>
                                <Text numberOfLines={2} style={[styles.btnText, { color: colors.geen_txt, }]}>Book Another{'\n'} Appointment</Text>
                            </Button>
                        )}
                    </View>
                )}
                {item.item.eStatus == "discontinued" && (
                    <View>
                        <Text style={[styles.thirdRow, { color: colors.danger, fontFamily: 'OpenSans-Bold', }]}>*Patient Identity Not Confirmed </Text>

                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && (
                            <Button block onPress={() => this.buttonAction("patient_book", item.item)} bordered light style={{ borderColor: colors.geen_txt, marginTop: 10, height: 60, justifyContent: 'center', width: 150 }}>
                                <Text numberOfLines={2} style={[styles.btnText, { color: colors.geen_txt, }]}>Book Another{'\n'} Appointment</Text>
                            </Button>

                        )}
                    </View>
                )}
                {item.item.eStatus == "missed" && (
                    <View style={{ flexDirection: "column" }}>
                        <Text style={[styles.thirdRow, { color: colors.THEME_YELLOW, fontFamily: 'OpenSans-Bold', }]}>{item.item.eMissedBy == "doctor" ? "Missed By Doctor" : "Missed By Patient"}  </Text>
                        {item.item.eMissedBy == "doctor" && this.props.user_data.iRoleId != constant.ROLE_PATIENT && item.item.vRefundId == "" && item.item.bCanRefund && (
                            <Button onPress={() => this.buttonAction("refund", item.item)} bordered block light style={{ borderColor: colors.danger, justifyContent: 'center', marginTop: 10, width: 150 }}>
                                <Text style={[styles.btnText, { color: colors.danger }]}>Refund</Text>
                            </Button>
                        )}
                        {item.item.eMissedBy == "doctor" && this.props.user_data.iRoleId != constant.ROLE_PATIENT && item.item.vRefundId != "" && (
                            <Button bordered block light style={{ borderColor: colors.danger, justifyContent: 'center', marginTop: 10, width: 200 }}>
                                <Text style={[styles.btnText, { color: colors.danger }]}>Already Refunded</Text>
                            </Button>
                        )}

                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && (
                            <Button block onPress={() => this.buttonAction("patient_book", item.item)} bordered light style={{ borderColor: colors.geen_txt, marginTop: 10, height: 60, justifyContent: 'center', width: 150 }}>
                                <Text numberOfLines={2} style={[styles.btnText, { color: colors.geen_txt, }]}>Book Another{'\n'} Appointment</Text>
                            </Button>
                        )}


                    </View>
                )}

                {item.item.tAdditionalInfo != "" && (
                    <View>
                        <TouchableOpacity onPress={() => this.additionalInfo(item.item.tAdditionalInfo)}>
                            <Text style={[styles.thirdRow, { color: colors.THEME_YELLOW, fontFamily: 'OpenSans-Bold', textDecorationLine: 'underline', marginBottom: 5 }]}>Additional Info Required </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {item.item.eStatus == "completed" && (
                    <View style={{ flexDirection: 'row' }}>
                        {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                            <Button onPress={() => this.buttonAction("rmp_medical_history", item.item)} block light style={{ backgroundColor: colors.THEME_YELLOW, marginRight: 20, flex: 1, height: 55, justifyContent: 'center' }}>
                                <Text style={[styles.btnText,
                                    // { color: colors.THEME_YELLOW }
                                ]}>Medical History</Text>
                            </Button>
                        )}
                        {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                            <Button onPress={() => this.buttonAction("rmp_prescription", item.item)} bordered light style={{ backgroundColor: colors.sub_theme, marginRight: 20, flex: 1, height: 55, justifyContent: 'center' }}>
                                <Text style={[styles.btnText,
                                    // { color: colors.sub_theme }
                                ]}>Edit Prescription</Text>
                            </Button>
                        )}
                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && item.item.eStatus == "completed" && (
                            <Button onPress={() => this.buttonAction("patient_book", item.item)} bordered block light style={{ backgroundColor: colors.geen_txt, marginRight: 20, flex: 1, height: 55, justifyContent: 'center' }}>
                                <Text style={[styles.btnText,
                                    // { color: colors.geen_txt }
                                ]}>Book Another Appointment </Text>
                            </Button>
                        )}

                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && item.item.eStatus == "completed" && (
                            <Button onPress={() => this.buttonAction("patient_prescription", item.item)} bordered block light style={{ backgroundColor: colors.sub_theme, marginRight: 20, flex: 1, height: 55, justifyContent: 'center' }}>
                                <Text style={[styles.btnText,
                                    // { color: colors.sub_theme }
                                ]}>View Prescription</Text>
                            </Button>
                        )}
                    </View>
                )}
                {this.props.user_data.iRoleId != constant.ROLE_PATIENT && item.item.reports.length > 0 ? (
                    <View style={{ paddingTop: 10 }}>
                        <Button onPress={() => this.buttonAction("add_reports", item.item)} block light style={{ backgroundColor: colors.poor_color, marginRight: 20, flex: 1, height: 40, justifyContent: 'center' }}>
                            <Text style={[styles.btnText,
                                // { color: colors.THEME_YELLOW }
                            ]}>Lab/Test Reports</Text>
                        </Button>
                    </View>
                ) : this.props.user_data.iRoleId == constant.ROLE_PATIENT ? (
                    <View style={{ paddingTop: 10 }}>
                        <Button onPress={() => this.buttonAction("add_reports", item.item)} block light style={{ backgroundColor: colors.poor_color, marginRight: 20, flex: 1, height: 40, justifyContent: 'center' }}>
                            <Text style={[styles.btnText,
                                // { color: colors.THEME_YELLOW }
                            ]}>Lab/Test Reports</Text>
                        </Button>
                    </View>
                ) : null}

            </View>

        )
    }
    popUpClick = (status, id) => {
        //   console.log(status, id, "id.....", this.state.selectedData);
        this.setState({ showPopUp: false, showTimer: false })
        switch (status) {
            case "enter_session":
                // console.log("enter session");
                this.getSessionDetails(id)
                break;

            case "cancel_appt":
                //console.log("cancel appt...");
                this.props.navigation.navigate('CancelAppt', { iAppointmentId: this.state.selectedData.iAppointmentId, fRefundAmount: this.state.fRefundAmount, bIsRefundable: this.state.selectedData.bIsRefundable });
                break;
            default:
                break;
        }
    }

    additionalInfo = (info) => {
        // console.log("info...");
        this.setState({ showPopUp: true, timer_title: "Additional Info", timer_msg: info })
        // this.setState({ showPopUp: true, timer_title: "", timer_msg="hi" });
    }
    refundClick = (status, amount) => {
        // console.log(status);
        this.setState({ showRefundPopUp: !this.state.showRefundPopUp })
        switch (status) {
            case "partial":
                console.log("partial refund", amount);
                this.refundAmount("partial", amount)
                break;

            default:
                break;
        }

    }
    render() {
        return (
            <Container>
                {this.state.showRefundPopUp && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <RefundPopUp clickHandler={this.refundClick} amount={this.state.fRefundAmount} title="Refund" msg="Select Refund Type"></RefundPopUp>
                    </View>
                )}
                {this.state.showPopUp && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title={this.state.timer_title} msg={this.state.timer_msg}></CommonPopUp>
                    </View>
                )}

                {this.state.showTimer && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                    }}>
                        <TimerPopUp ref="child" clickHandler={this.popUpClick} title={this.state.timer_title} msg={this.state.timer_msg}></TimerPopUp>
                    </View>
                )}

                {this.state.showNetworkPopup && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.PopUpClickHandler} title="Internet Connectivity" msg="You don't have any internet connection."></CommonPopUp>
                    </View>
                )}
                {/* {this.props.route.params && this.props.route.params.type == "logout" && this.state.isLogoutShow && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.PopUpClickHandler} title="Logout" msg="Are you sure you want to logout?"></CommonPopUp>
                    </View>
                )} */}
                {this.state.showUpdatePopup && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp title="Update Required" msg="You are using an older version of the app. Please, update it to the latest version."></CommonPopUp>
                    </View>
                )}

                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />

                <HeaderComponent show_headingCenter={true} show_menu={true}
                    clickHandler={this.navigator}
                    navigation={this.props.navigation}
                    title={this.props.user_data.iRoleId == constant.ROLE_PATIENT ? constant.page_titles.APPOINTMENTS : constant.page_titles.RMP_APPOINTMENTS}></HeaderComponent>

                <SafeAreaView style={styles.container}>

                    <SegmentedControlTab
                        tabsContainerStyle={{ width: width - 8, alignSelf: "center" }}
                        borderRadius={5}
                        tabTextStyle={styles.tabText}
                        activeTabStyle={styles.activeTabStyle}
                        tabStyle={styles.tabStyle}
                        values={["Upcoming", "Past",]}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this.handleIndexChange}
                    />

                    <View style={styles.mainContainer}>
                        {this.state.showPastMessage && this.state.past_appointments.length == 0 && this.state.selectedIndex == 1 && (
                            <Text style={[styles.headingText, { fontFamily: 'OpenSans-Regular' }]}>No  Past Appointments</Text>
                        )}
                        {this.state.showUpcomingMessage && this.state.upcoming_appointments.length == 0 && this.state.selectedIndex == 0 && (
                            <Text style={[styles.headingText, { fontFamily: 'OpenSans-Regular' }]}>No Upcoming Appointments</Text>
                        )}

                        {this.state.selectedIndex == 0 && (
                            <FlatList
                                style={{ marginBottom: 150 }}
                                showsVerticalScrollIndicator={false}
                                data={this.state.upcoming_appointments}
                                keyExtractor={item => item.id}
                                horizontal={false}
                                renderItem={(item) => this._renderItem(item)}
                            />
                        )}
                        {this.state.selectedIndex == 1 && (
                            <FlatList
                                style={{ marginBottom: 150 }}
                                showsVerticalScrollIndicator={false}
                                data={this.state.past_appointments}
                                keyExtractor={item => item.id}     //has to be unique   
                                horizontal={false}
                                renderItem={(item) => this._renderPastItem(item)}
                            />
                        )}

                    </View>
                </SafeAreaView>

            </Container >
        );
    }
}



function mapStateToProps(state) {
    //  console.log(state, "Verify Number state...")
    return {
        app_version: state.user.app_version,
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, { setSessionData, removeUser, setLocation, setComplete, setStateList, setTreatment, setStateCouncil, setSpeciality, setRelation, setAppVersion })(Appointments);
