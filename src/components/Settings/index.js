//import liraries
import React, { Component } from 'react';
import { View, Text, Linking } from 'react-native';
import {
    Container,
    Icon,
    Button,

} from 'native-base';

import HeaderComponent from '@components/HeaderComponent';
import Consent from '@components/Consent';
import { colors, constant, data } from '../../common/index';
import { alertWithTwoBtn } from '../../common/user';
import styles from './styles';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import { connect } from "react-redux";
import { auth } from 'react-native-firebase';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';
// create a component
class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camera_permission: false,
            mic_permission: false,
            come_from: !this.props.hasOwnProperty("type") ? "sidebar" : 'call',
            showAuth: false,
            spinner: false

        }
    }
    componentDidMount() {
        this.checkCameraPermission();
        this.checkMicPermission();
        console.log(this.props.type, "this.props.type")
    }


    checkCameraPermission = () => {
        check(PERMISSIONS.ANDROID.CAMERA).then(result => {

            switch (result) {
                case RESULTS.DENIED:
                    request(PERMISSIONS.ANDROID.CAMERA).then(result => {

                        if (result == 'granted') {
                            this.setState({
                                ...this.state, camera_permission: true
                            })
                        }
                    });
                    break;
                case RESULTS.GRANTED:
                    this.setState({
                        ...this.state, camera_permission: true
                    })
                    break;
                case RESULTS.BLOCKED:
                    break;
            }
        });
    }
    checkMicPermission = () => {
        check(PERMISSIONS.ANDROID.CALL_PHONE).then(result => {
            switch (result) {
                case RESULTS.DENIED:
                    request(PERMISSIONS.ANDROID.CALL_PHONE).then(result => {
                        if (result == 'granted') {
                            this.setState({
                                ...this.state, mic_permission: true
                            })
                        }
                    });
                    break;
                case RESULTS.GRANTED:
                    this.setState({
                        ...this.state, mic_permission: true
                    })
                    break;
                case RESULTS.BLOCKED:
                    break;
            }
        });
    }

    navigator = (action) => {
        console.log(action);
        switch (action) {
            case "next":
                if (this.state.mic_permission && this.state.camera_permission && this.state.come_from == 'sidebar') {
                    // this.props.clickHandler('back');
                    this.props.navigation.goBack();

                } else if (this.state.mic_permission && this.state.camera_permission && this.state.come_from == 'call') {
                    console.log("enter");
                    if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
                        console.log("jiii")
                        this.setState({ showAuth: true })
                    } else {
                        this.callPatient();
                    }
                }
                else {
                    alertWithTwoBtn(
                        'Permission Required',
                        data.ToastMessages.access_both_permission,
                        'Not Now',
                        'Open Settings',
                    ).then(data => {
                        console.log(data);
                        if (data) {
                            Linking.openSettings();
                        }
                    });
                }
                break;
            case 'back': {
                if(this.state.come_from == 'call'){
                    this.props.clickHandler('back');
                    return;
                }
                this.props.navigation.goBack();
                break;
            }

            case "enter_session": {
                this.callPatient();
            }
            default:
                break;
        }
    }
    callPatient = () => {
        console.log(this.props.sessionDetail.iAppointmentId, "this.props.sessionDetail")
        this.setState({
            spinner: !this.state.spinner
        });
        if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
            if (this.props.sessionDetail.Rmp_info.vPlatform == 'ios') {
                this.notifyiOSUser()
            } else {
                this.notifyAndroidUser();
            }
        }
        else {
            if (this.props.sessionDetail.Patient_info.vPlatform == 'ios') {
                this.notifyiOSUser()
            } else {
                this.notifyAndroidUser();
            }
        }

        // // this.props.navigation.reset({
        // //     index: 0,
        // //     routes: [{ name: 'VideoCall' }],
        // // });
        // // this.props.navigation.push('VideoCall');

        // // return false;
        // this.setState({
        //     spinner: !this.state.spinner
        // });
        // var push_data = {
        //     data: [
        //         {
        //             notification: {
        //                 title: `TalkToMedic Patient Call`,
        //                 body: this.props.sessionDetail.Patient_info.vFirstName +
        //                     ' | ' + this.props.sessionDetail.Patient_info.eGender.charAt(0),
        //                 content_available: true,
        //                 priority: 'high',
        //                 sound: 'ask_ken_new.wav',
        //             },
        //             data: {
        //                 type: 'incoming_call',
        //                 sessionDetail: this.props.sessionDetail,
        //                 notify_users: [{ vDeviceToken: this.props.sessionDetail.Rmp_info.vDeviceToken }],
        //                 // notify_users: [{ vDeviceToken: "fbtdtyJazU5SloZjBZt17z:APA91bEOU5PeP-g3-qbAHPlA8hYjOm1_sxdS01bQMhoQsVtgSAA37evqhSlT5cSsMxIJolPZz7oRTGtgSSat5_2XqlHPyOH3HjKb97iUKRvvYWvmgW20Vj9NMfDmKgiTFSW2rC4QvRAD" }],
        //             },
        //         },
        //     ],
        // };
        // console.log(JSON.stringify(push_data));
        // // return false;
        // postApiRequestWithHeaders(data.api_endpoint.push_payload, push_data, this.props.user_data.vAccessToken).then(
        //     data => {
        //         // this.props.navigation.reset({
        //         //     index: 0,
        //         //     routes: [{ name: 'VideoCall' }],
        //         // });
        //         this.props.navigation.push('VideoCall');

        //         this.setState({
        //             spinner: !this.state.spinner
        //         });
        //     },
        //     error => {

        //         this.setState({
        //             spinner: !this.state.spinner
        //         });
        //         showToast(error);
        //         console.log(error, 'errorrrrrr');
        //     },
        // );
    }

    notifyAndroidUser = () => {
        var push_data = {
            data: [
                {
                    notification: {
                        title: `${this.props.user_data.iRoleId != constant.ROLE_PATIENT ? "TalkToMedic Doctor Call" : "TalkToMedic Patient Call"}`,
                        body: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? this.props.sessionDetail.Patient_info.vFirstName +
                            ' | ' + this.props.sessionDetail.Patient_info.iAge + ' | ' + this.props.sessionDetail.Patient_info.eGender.charAt(0) : this.props.sessionDetail.Rmp_info.vFirstName + ' | ' + this.props.sessionDetail.Rmp_info.eGender.charAt(0),
                        content_available: true,
                        priority: 'high',
                        sound: 'ask_ken_new.wav',
                    },
                    data: {
                        type: 'incoming_call',
                        sessionDetail: this.props.sessionDetail,
                        notify_users: [{ vDeviceToken: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? this.props.sessionDetail.Rmp_info.vDeviceToken : this.props.sessionDetail.Patient_info.vDeviceToken }],
                    },
                },
            ],
        };
        console.log(JSON.stringify(push_data));
        console.log(JSON.stringify(this.props.sessionDetail));
        postApiRequestWithHeaders(data.api_endpoint.push_payload, push_data, this.props.user_data.vAccessToken).then(
            data => {
                // this.props.navigation.reset({
                //     index: 0,
                //     routes: [{ name: 'VideoCall' }],
                // });
                this.props.navigation.push('VideoCall');

                this.setState({
                    spinner: !this.state.spinner
                });
            },
            error => {

                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    notifyiOSUser = () => {
        var request = {
            "param": {
                "data": {
                    "aps": {
                        alert: this.props.sessionDetail.iAppointmentId,
                        type: "incoming_call",
                        title: `${this.props.user_data.iRoleId != constant.ROLE_PATIENT ? "Dr " + this.props.sessionDetail.Rmp_info.vFirstName + " Calling.." : "Patient " + this.props.sessionDetail.Patient_info.vFirstName + " Calling.."}`,
                        phone: `${this.props.user_data.iRoleId == constant.ROLE_PATIENT ? "xxx-xxx-" + this.props.sessionDetail.Patient_info.vMobileNo.substr(this.props.sessionDetail.Patient_info.vMobileNo.length - 4, this.props.sessionDetail.Patient_info.vMobileNo.length) : "xxx-xxx-" + this.props.sessionDetail.Rmp_info.vMobileNo.substr(this.props.sessionDetail.Rmp_info.vMobileNo.length - 4, this.props.sessionDetail.Rmp_info.vMobileNo.length)}`
                    }
                },
                "notify_user": [
                    {
                        vVoipToken: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? this.props.sessionDetail.Rmp_info.vVoipToken : this.props.sessionDetail.Patient_info.vVoipToken
                    }
                ]
            }
        }
        postApiRequestWithHeaders(data.api_endpoint.push_payload_apn, request, this.props.user_data.vAccessToken).then(
            data => {
                // this.props.navigation.reset({
                //     index: 0,
                //     routes: [{ name: 'VideoCall' }],
                // });
                this.props.navigation.push('VideoCall');

                this.setState({
                    spinner: !this.state.spinner
                });
            },
            error => {
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    render() {
        return (
            <Container>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                {!this.state.showAuth && (

                    <View>

                        <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.SETTING}></HeaderComponent>
                        <View style={styles.mainContainer}>
                            <Text style={styles.headingText}>
                                {' '}
                                Checking Your {'\n'}Permissions & Devices
                    </Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
                                <View style={{}}>
                                    <Text style={styles.headingText_inner}>Camera</Text>
                                    <Icon
                                        style={[{
                                            alignSelf: 'center',
                                            color: this.state.camera_permission ? colors.geen_txt : colors.danger,
                                            fontSize: 70,
                                            paddingRight: 5
                                        }]}
                                        name='ios-camera' />

                                    <Text style={[styles.headingTextStatus, { color: this.state.camera_permission ? colors.geen_txt : colors.danger }]}>{this.state.camera_permission ? "Passed" : "Failed"}</Text>
                                </View>

                                <View>
                                    <Text style={styles.headingText_inner}>Mic</Text>
                                    <Icon
                                        style={[{
                                            alignSelf: 'center',
                                            color: this.state.mic_permission ? colors.geen_txt : colors.danger,
                                            fontSize: 70,
                                            paddingRight: 5
                                        }]}
                                        name='md-mic' />

                                    <Text style={[styles.headingTextStatus, { color: this.state.mic_permission ? colors.geen_txt : colors.danger }]}>{this.state.mic_permission ? "Passed" : "Failed"}</Text>
                                </View>
                            </View>

                            <Text style={styles.instructionText}>{(this.state.mic_permission && this.state.camera_permission) ? "" : "Please fix the issue(s) above and Retry"}</Text>

                            <Button style={[styles.nextButtonContainer, { backgroundColor: (this.state.mic_permission && this.state.camera_permission) ? colors.THEME_YELLOW : colors.danger }]}
                                onPress={() => {
                                    this.navigator('next');
                                }} >

                                {this.state.come_from == "sidebar" && (
                                    <Text style={[styles.nextButton,]}>{(this.state.mic_permission && this.state.camera_permission) ? "Go Back" : "Try Again"}</Text>
                                )}

                                {this.state.come_from == "call" && (
                                    <Text style={[styles.nextButton,]}>{(this.state.mic_permission && this.state.camera_permission) ? "Enter Session" : "Try Again"}</Text>
                                )}
                            </Button>
                        </View>
                    </View>
                )}

                {this.state.showAuth && (
                    <Consent clickHandler={this.navigator}></Consent>

                )}

            </Container>
        );
    }
}

function mapStateToProps(state) {
    // console.log(state, "Verify Number state...")
    return {
        sessionDetail: state.sessionData,
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, {})(Settings);
