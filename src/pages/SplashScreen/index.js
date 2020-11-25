//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Linking, Platform, AppState } from 'react-native';


// import Introduction from '@pages/Introduction';
// import EnterPhoneNumber from '@pages/EnterPhoneNumber';
// import PatientRegister from '@pages/PatientRegister';
// import EnterPassword from '@pages/EnterPassword';
// import PatientProfile from '@components/PatientProfile';
// import VideoCall from '@pages/VideoCall';
// import MyAccount from '@pages/MyAccount';
// import AvailableRMP from '@pages/AvailableRMP';
// import Payment from '@pages/Payment';
// import Camera from '@components/Camera';
// import CallKit from '@pages/CallKit';
// import CommonPage from '@pages/CommonPage';
// import AddMember from '@components/AddMember';
import { getApiRequest, postApiRequestWithHeaders, showToast, getItem, setItem } from '../../common/user';
import RNCallKeep from 'react-native-callkeep';
import { data, colors } from '../../common/index';
import ApptType from '@pages/ApptType';
import firebase from 'react-native-firebase';
import { connect } from "react-redux";
import InCallManager from 'react-native-incall-manager';
import { setSessionData, setDeviceToken, setStateList, setTreatment, setUserData, setStateCouncil, setSpeciality, setRelation, setAppVersion } from "../../actions";
import uuid from 'uuid';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import Spinner from 'react-native-loading-spinner-overlay';
import { StackActions, CommonActions } from '@react-navigation/native';
import { AppEventsLogger } from "react-native-fbsdk";

// create a component

const getNewUuid = () => uuid.v4().toLowerCase();

const format = uuid => uuid.split('-')[0];
class SplashScreeen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            callUUID: ""
        };
        RNCallKeep.addEventListener('answerCall', this.answerCall);
        RNCallKeep.addEventListener('endCall', this.endCall);
        // if (Platform.OS === 'android') {
        //     Linking.getInitialURL().then(url => {
        //         this.navigate(url);
        //     });
        // } else {
        //     Linking.addEventListener('url', this.handleOpenURL);
        // }
    }


    handleOpenURL = (event) => { // D

        // console.log(event, "deep linking event...", Object.keys(this.props.user_data).length)
        // console.log(this.count, "count.....")
        getItem(['user_details']).then(
            res => {
                if (res) {
                    if (JSON.parse(res[0][1])) {
                        this.navigate(event.url);
                        //console.log("itme exist", JSON.parse(res[0][1]));

                    } else {
                        //  console.log("mooooooo")
                    }
                }
            }, err => {
                // console.log(err, "erroro,,,,,")
            })



        /**
        talktomedic://myAppointments
        talktomedic://viewPrescription/52
         */
    }
    navigate = (url) => {
        // console.log(url, "url....")
        // E
        //   const { navigate } = this.props.navigation;
        const route = url.replace(/.*?:\/\//g, '');
        //  console.log(route);
        if (route == "myAppointments") {
            // this.props.navigation.navigate('CommonPage', { type: 'appointments' });
            const navigateHandler = CommonActions.navigate({
                name: "MyAccount",
                actions: CommonActions.navigate({
                    name: "Appointments"
                })
            });

            this.props.navigation.dispatch(navigateHandler)
            // this.props.navigation.navigate('MyAccount');
        } else if (url.substring(url.lastIndexOf("//") + 2, url.lastIndexOf("/")) == "viewPrescription") {
            var id = url.substring(url.lastIndexOf("/") + 1)
            console.log("view pres", id);
            this.props.navigation.push('CommonPage', { prescData: { iAppointmentId: id, from: "appointments" }, type: 'prescription' });
        }

    }
    //***Call Kit Event Listeners when  user picks and ends the call ** *//
    endCall = ({ callUUID }) => {
        RNCallKeep.rejectCall(callUUID);
        // console.log("end call....")
        firebase.notifications().removeAllDeliveredNotifications();
    };
    answerCall = ({ callUUID }) => {
        // console.log("answer call....", callUUID);
        RNCallKeep.supportConnectionService();

        // RNCallKeep.reportEndCallWithUUID(callUUID, 4);
        RNCallKeep.rejectCall(callUUID);
        this.props.navigation.navigate("VideoCall", { uuid: callUUID });

        // setTimeout(() => {
        //     this.props.navigation.navigate("VideoCall", { uuid: callUUID });
        // }, 100);

    }

    async componentDidMount() {

        // AppEventsLogger.logEvent("fb_mobile_login", {});
        
        if (Platform.OS === 'android') {

            getItem(['user_details']).then(
                res => {
                    console.log(res, "resultUsers")
                    if (res) {
                        if (JSON.parse(res[0][1])) {
                            Linking.getInitialURL().then(url => {
                                //  console.log("url-link", url);
                                if (url != null) {
                                    this.navigate(url);
                                }
                            });
                            return;
                        }
                    }

                }, err => {
                    //  console.log(err)
                })
        } else {
            Linking.addEventListener('url', this.handleOpenURL);
        }

        this.getCommonDetails();
        this.setUpPush();
        // this.getUserDetails();

        // await this.navigationHandler();
    }

    // navigationHandler = (data) => {
    //     if (Object.keys(data).length === 0) {
    //         this.props.navigation.reset({
    //             index: 0,
    //             routes: [{ name: 'EnterPhoneNumber' }],
    //         });
    //     } else {
    //         this.props.navigation.reset({
    //             index: 0,
    //             routes: [{ name: 'MyAccount' }],
    //         });
    //     }
    // }


    render() {
        // return (
        //     <CallKit navigation={this.props.navigation} />
        // );
        /** comment on 05-08-2020 */
        // if (Object.keys(this.props.user_data).length === 0) {
        //     return (
        //         <EnterPhoneNumber navigation={this.props.navigation} />
        //     );
        // } else {
        //     return (
        //         <MyAccount navigation={this.props.navigation} />
        //     );
        // }
        return (
            // <View />
            <Spinner
                color={colors.sub_theme}
                visible={true}
                textContent={''}
            />
        )

    }


    getCommonDetails = () => {
        getApiRequest(data.api_endpoint.get_countries).then(
            data => {
                //  console.log(data, "getCommonDetailsall data....")
                this.props.setStateList(data.states);
                this.props.setTreatment(data.treatments);
                this.props.setStateCouncil(data.medical_councils);
                this.props.setSpeciality(data.specialties);
                this.props.setRelation(data.famility_relations);
                this.props.setAppVersion(data.app_version);
                this.getUserDetails();
            },
            error => {
                //  console.log(error, 'errorrrrrr');
            },
        );
    };


    getUserDetails = () => {
        //  console.log(this.props, "this.props......");
        getItem(['user_details']).then(
            res => {
                console.log(res, "resultUsers")
                if (res) {
                    if (JSON.parse(res[0][1])) {
                        // console.log("itme exist", JSON.parse(res[0][1]));
                        var data = JSON.parse(res[0][1]);
                        this.hitUserDetailApi(data.vAccessToken);
                        this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'MyAccount' }],
                        });
                        return;
                    }

                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'EnterPhoneNumber' }],
                    });
                }

            }, err => {
                //  console.log(err)
            })

    };

    hitUserDetailApi = (token) => {
        postApiRequestWithHeaders(data.api_endpoint.user_details, {}, token).then(
            data => {
                //  console.log(data, "user_details data....")
                setItem('user_details', JSON.stringify(data.user)).then(
                    res => {
                        if (res) {
                            // this.navigationHandler(data.user);
                            this.props.setUserData(data.user);
                        }
                    },
                    err => {
                        console.log(err, "set err")
                    },
                );
            },
            error => {
                // console.log(error, 'errorrrrrr');
            },
        );
    }

    /**
     * Fetch device token and ask for permission
     */
    setUpPush = () => {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        //   console.log("LOG Messaging: ", token);
                        this.props.setDeviceToken(token);
                        this.messageListener();
                    })
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            console.log("User Now Has Permission");
                            this.setUpPush();
                            this.messageListener();
                        })
                        .catch(error => {
                            console.log("Error", error);
                            // this.messageListener();
                            // User has rejected permissions  
                        });
                }
            });
    }

    /**
     * Push notification listener events
     */
    messageListener = async () => {
        //console.log("Message Listener.....")
        this.notificationListener = firebase.notifications().onNotification((message) => {
            const { title, body } = message;
            //  console.log(message, "on receive111");
            const callUUID = getNewUuid();
            if (message._data.type == "incoming_call") {
                this.props.setSessionData(JSON.parse(message._data.sessionDetail));
                var payload = JSON.parse(message._data.sessionDetail);
                //    console.log(payload, "payload....")
                RNCallKeep.setup({
                    ios: {
                        appName: `${payload.Patient_info.vFirstName} | ${payload.Patient_info.iAge} | ${payload.Patient_info.eGender.charAt(0)} `,
                        imageName: 'calling'
                    },
                    android: {
                        alertTitle: 'Permissions required',
                        alertDescription: 'This application needs to access your phone accounts',
                        cancelButton: 'Cancel',
                        okButton: 'ok',
                    },
                });

                //  console.log(callUUID)
                this.setState({ callUUID: callUUID });
                RNCallKeep.displayIncomingCall(callUUID, "xxx-xxx-" + payload.Patient_info.vMobileNo.substr(payload.Patient_info.vMobileNo.length - 4, payload.Patient_info.vMobileNo.length), "TalkToMedic Patient Call", 'number', false);
            } else if (message._data.type == "end_call") {
                // console.log(this.state.callUUID, ".....uuid")
                RNCallKeep.rejectCall(this.state.callUUID);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
                })
                // InCallManager.stop();
                showToast("Patient Disconnected the call.");
                // firebase.notifications().removeAllDeliveredNotifications();
            }

        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // console.log(notificationOpen, "on onNotificationOpened")
            const { title, body } = notificationOpen.notification;
            const callUUID = getNewUuid();
            if (notificationOpen.notification._data.type == "booking") {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount', params: { type: 'appointments' } }],
                })
            } else if (notificationOpen.notification._data.type == "incoming_call") {
                this.props.setSessionData(JSON.parse(notificationOpen.notification._data.sessionDetail));
                var payload = JSON.parse(notificationOpen.notification._data.sessionDetail);
                //  console.log(payload, "payload....")
                RNCallKeep.setup({
                    ios: {
                        appName: `${payload.Patient_info.vFirstName} | ${payload.Patient_info.iAge} | ${payload.Patient_info.eGender.charAt(0)} `,
                        imageName: 'calling'
                    },
                    android: {
                        alertTitle: 'Permissions required',
                        alertDescription: 'This application needs to access your phone accounts',
                        cancelButton: 'Cancel',
                        okButton: 'ok',
                    },
                });
                this.setState({ callUUID: callUUID });
                RNCallKeep.displayIncomingCall(callUUID, "xxx-xxx-" + payload.Patient_info.vMobileNo.substr(payload.Patient_info.vMobileNo.length - 4, payload.Patient_info.vMobileNo.length), "TalkToMedic Patient Call");
            } else if (notificationOpen.notification._data.type == "end_call") {
                RNCallKeep.rejectCall(this.state.callUUID);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
                })
                showToast("Patient Disconnected the call.");
                firebase.notifications().removeAllDeliveredNotifications();
            }
            //  console.log(title, body);
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        //   console.log(notificationOpen, "notificationOpen....");
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
        }

        this.messageListener = firebase.messaging().onMessage((message) => {
            //  console.log(JSON.stringify(message), "On FInal Push Message Receive");
            const callUUID = getNewUuid();
            if (message._data.type == "incoming_call") {
                this.props.setSessionData(JSON.parse(message._data.sessionDetail));
                var payload = JSON.parse(message._data.sessionDetail);
                // console.log(payload, "payload....")
                RNCallKeep.setup({
                    ios: {
                        appName: `${payload.Patient_info.vFirstName} | ${payload.Patient_info.iAge} | ${payload.Patient_info.eGender.charAt(0)} `,
                        imageName: 'calling'
                    },
                    android: {
                        alertTitle: 'Permissions required',
                        alertDescription: 'This application needs to access your phone accounts',
                        cancelButton: 'Cancel',
                        okButton: 'ok',
                    },
                });
                this.setState({ callUUID: callUUID });
                RNCallKeep.displayIncomingCall(callUUID, "xxx-xxx-" + payload.Patient_info.vMobileNo.substr(payload.Patient_info.vMobileNo.length - 4, payload.Patient_info.vMobileNo.length), "TalkToMedic Patient Call", 'number', false);
            } else if (message._data.type == "end_call") {
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
                })
                showToast("Patient Disconnected the call.");
                RNCallKeep.rejectCall(this.state.callUUID);
                firebase.notifications().removeAllDeliveredNotifications();
            }

        });
    }


}

function mapStateToProps(state) {
    //console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData
    }
}
export default connect(mapStateToProps, { setDeviceToken, setStateList, setTreatment, setUserData, setStateCouncil, setSpeciality, setSessionData, setRelation, setAppVersion })(SplashScreeen);


/**
 *
 *   // if (message._data.type == "incoming_call") {
            //         RNCallKeep.setup({
            //             ios: {
            //                 appName: 'Jeff with Plumbing Issue',
            //             },
            //             android: {
            //                 alertTitle: 'Permissions required',
            //                 alertDescription: 'This application needs to access your phone accounts',
            //                 cancelButton: 'Cancel',
            //                 okButton: 'ok',
            //             },
            //         });
            //         const callUUID = getNewUuid();
            //         RNCallKeep.displayIncomingCall(callUUID, "6875785", "Ask Ken Customer Call", 'number', false);
            //     return false
 */