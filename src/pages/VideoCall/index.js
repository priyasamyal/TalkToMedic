//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import {
    Container,
    ActionSheet,
    Icon,
    Button,
    Body,
    Item,
    CheckBox,
} from 'native-base';
import MovableView from 'react-native-movable-view';
import styles from './styles';
import { OTSession, OTPublisher, OTSubscriber,OTSubscriberView  } from 'opentok-react-native';
import { colors, constant, data } from '../../common/index';
import { connect } from "react-redux";
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
import moment from 'moment';
import Rating from '@components/Rating';
import Feedback from '@components/Feedback';
import BackgroundTimer from 'react-native-background-timer';
import PaymentReceipt from '@components/PaymentReceipt';
import Connecting from '@components/Connecting';
import MedicalHistory from '@components/MedicalHistory';
import ThanksScreen from '@components/ThanksScreen';
import AdditionalInfo from '@rmp_components/AdditionalInfo';
import RNCallKeep from 'react-native-callkeep';
import InCallManager from 'react-native-incall-manager';
import EndCallPopUp from '@components/EndCallPopUp';
//import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import CommonPopUp from '@components/CommonPopUp';
import RmpConclusion from '@rmp_components/RmpConclusion';
import TimerPopUp from '@components/TimerPopUp';
// create a component
import {
    postApiRequestWithHeaders,
    errorHandler,
    errorHandler1,
    getApiRequest,
    showToast,
    networkCheck,
    alertWithTwoBtn,
    alertWithSingleBtn,
    clear_push_interval
} from '../../common/user';

/***Footer Icon URL */
const end_call = require('../../assets/imgs/end-call.png');
const videoOn = require('../../assets/imgs/video-on.png');
const videoOff = require('../../assets/imgs/video-off.png');
const audioOn = require('../../assets/imgs/mike-on.png');
const audioOff = require('../../assets/imgs/mike-off.png');
const selfieOn = require('../../assets/imgs/selfie-on.png');
const selfieOff = require('../../assets/imgs/selfie_on.png');
const default_user = require('../../assets/imgs/default_user.png');
const refresh = require('../../assets/imgs/refresh.png');
/***Footer Icon URL Ends */
count = 0;
timeoutId = '';
end_signal_timer = "";
_interval;
class VideoCall extends Component {
    constructor(props) {
        super(props);
        this.sessionOptions = {
            connectionEventsSuppressed: true,
            androidZOrder: 'onTop', // Android only - valid options are 'mediaOverlay' or 'onTop'
            androidOnTop: 'publisher',  // Android only - valid options are 'publisher' or 'subscriber'
            useTextureViews: true,  // Android only - default is false
            isCamera2Capable: false,
            ipWhitelist: false,
        };
        this.stream_counter = 0;
        // this.apiKey = '46048402';
        // this.sessionId = '2_MX40NjA0ODQwMn5-MTU4ODc2MzMxMDAyNH5XMEk4c1VqZkNCTEo1TFp2SDBDUFV6dG1-UH4';
        // this.token = 'T1==cGFydG5lcl9pZD00NjA0ODQwMiZzaWc9OGEzM2M4NThmM2U1MDU1OTNkZjQ0OTA0NGM3MzFjMWRkMTJhZWYwMTpzZXNzaW9uX2lkPTJfTVg0ME5qQTBPRFF3TW41LU1UVTRPRGMyTXpNeE1EQXlOSDVYTUVrNGMxVnFaa05DVEVvMVRGcDJTREJEVUZWNmRHMS1VSDQmY3JlYXRlX3RpbWU9MTU4ODc2MzMxMCZyb2xlPW1vZGVyYXRvciZub25jZT0xNTg4NzYzMzEwLjAzNDkxMzI0MzMwOTYy';
        this.state = {
            session: 'connect',
            isConnected: false,
            call_completed: false,
            publishVideo: true,
            publishAudio: true,
            cameraPosition: 'front',
            identityConfirm: '',
            sub_streamId: '',
            apiKey: this.props.sessionDetail.vApiKey,
            sessionId: this.props.sessionDetail.vTokboxId,
            token: this.props.sessionDetail.vTokboxToken,
            minutes_Counter: this.props.sessionDetail.iDuration,
            seconds_Counter: '00',
            is_endCall: false,
            signal: {
                type: '',
            },
            streamProperties: {
                subscribeToAudio: true,
                subscribeToVideo: true,
            },
            subscriber_video_on: true,
            showPopUp: false,
            showTimer: false,
            isrefresh:false
        };
        console.log(this.state, "state video calll......",this.props.sessionDetail)
        this.sessionEventHandlers = {
            signal: event => {
                console.log('signal recived!', event);
                if (event.data == "refresh") {
                    setTimeout(() => {
                        showToast("Reconnecting Video Call");
                    }, 1000);
                      
                }
                else if (event.data == "end_call") {
                    clearInterval(this._interval);
                    RNCallKeep.endAllCalls();
                    InCallManager.stop();
                    if (this.props.user_data.iRoleId != constant.ROLE_PATIENT) {
                       // deactivateKeepAwake();
                        this.connectDisconnect("disconnected");
                        this.setState({ call_completed: true })
                    } else {
                        setTimeout(() => {
                            this.setState({ call_completed: true }, () => {
                               // deactivateKeepAwake();
                                console.log(this.state, "call complete")
                            });
                        }, 2000);

                    }
                }
                else if (event.data == "identity_end") {
                  //  deactivateKeepAwake();
                    RNCallKeep.endAllCalls();
                    InCallManager.stop();
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'MyAccount', params: { type: 'my_appt' } }],
                    });
                    if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
                        showToast("Identity not recognised. Doctor has disconnected the call.")
                    }
                }
                if (event.data == "rmp_video_toggle") {
                    if (this.props.user_data.iRoleId != constant.ROLE_PATIENT) {
                        this.setState({ subscriber_video_on: !this.state.subscriber_video_on })
                    }
                }
                if (event.data == "patient_video_toggle") {
                    if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
                        this.setState({ subscriber_video_on: !this.state.subscriber_video_on })
                    }
                }



            },
            streamCreated: event => {
                console.log('Stream created!', event);
                this.setState({ sub_streamId: event.streamId });
                // if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
                InCallManager.stopRingback();
                clear_push_interval();
                if (this.timeoutId) {
                    BackgroundTimer.clearTimeout(this.timeoutId);
                }
                //   }
                setTimeout(() => {
                    this.setState({ identityConfirm: "ask" })
                }, 10000);

                if (this.stream_counter == 0 ) {
                  //  var timer = 14 * 60 + 60;
                    var timer = parseInt(this.props.sessionDetail.iDuration -1) * 60 + 60;                   
                    //var timer = 2 * 60 + 60;
                    var minutes; 1
                    var seconds;
                    BackgroundTimer.setTimeout(() => {
                        this._interval = setInterval(() => {
                            minutes = Math.floor(timer / 60);
                            seconds = Math.floor(timer % 60);

                            minutes = minutes < 10 ? '0' + minutes : minutes;
                            seconds = seconds < 10 ? '0' + seconds : seconds;
                          //  console.log(minutes, seconds);
                            this.setState({
                                minutes_Counter: minutes,
                                seconds_Counter: seconds,
                                // id: id
                            })

                            --timer;
                            // this.refs.child.startTimer(timer)
                            if (timer < 0) {
                                console.log('timeup');
                                clearInterval(this._interval);
                            } else if (timer == 180) {
                                this.setState({
                                    showTimer: true
                                })
                                this.refs.child.startTimer(timer)
                            }
                            else if (this.state.minutes_Counter == "00" && this.state.seconds_Counter == "01") {
                                this.setState({
                                    showTimer: false
                                })
                                this.connectDisconnect("disconnected");
                                RNCallKeep.endAllCalls();
                                InCallManager.stop();
                                this.sendSignal(0, "end_call");
                            }
                            // var num = (Number(this.state.seconds_Counter) + 1).toString(),
                            //     count = this.state.minutes_Counter;
                            // if (Number(this.state.seconds_Counter) == 59) {
                            //     count = (Number(this.state.minutes_Counter) + 1).toString();
                            //     num = '00';
                            // }
                            // this.setState({
                            //     minutes_Counter: count.length == 1 ? '0' + count : count,
                            //     seconds_Counter: num.length == 1 ? '0' + num : num
                            // });
                        }, 1000);

                        this.setState({ timer });
                    }, 1500);

                }

                if (this.props.user_data.iRoleId != constant.ROLE_PATIENT) {
                    if (this.stream_counter == 0) {
                        this.stream_counter = 1;
                        this.connectDisconnect('connected');
                    }
                }
                this.stream_counter = 1;
                InCallManager.start({ media: 'video' });
                InCallManager.setForceSpeakerphoneOn(true);
            },
            streamDestroyed: event => {
                console.log('Stream destroyed!', event);
            },
            sessionConnected: event => {
                this.setState({
                    isConnected: true,
                })
            },
            sessionDisconnected: event => {
                console.log('session disconnected', event);
            },
            otrnError: event => {
                console.log('session otrnError', event);
            },
            sessionReconnecting: event => {
                console.log('sessionReconnecting', event);
            },
        };

    }

    componentDidMount() {
       // activateKeepAwake();
    }


    sendSignal(code, text) {
        console.log('send signal', code, text);
        this.setState({
            signal: {
                type: code,
                data: text,
            },
        });
    }

    connectDisconnect = (type) => {
        console.log(type, "connectDisconnect");
        var params = {
            iAppointmentId: this.props.sessionDetail.iAppointmentId,
            iPatientId: this.props.sessionDetail.Patient_info.iUserId,
            iRmpId: this.props.sessionDetail.Rmp_info.iUserId,
            eConnectionStatus: type
        }
        console.log("params of connect", params)
        postApiRequestWithHeaders(data.api_endpoint.connect, params, this.props.user_data.vAccessToken).then(
            data => {
                if (type == "disconnected") {
                    this.setState({ call_completed: true })
                }

                console.log(data, "response of connect");
            },
            error => {
                if (type == "disconnected") {
                    this.setState({ call_completed: true })
                }
                console.log(error, 'errorrrrrr');
            },
        );
    }
    additionalInfo = (txt, info) => {
        console.log("additional info", txt, info);
        if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'CommonPage', params: { type: 'feedback' } }],
            });
        } else {
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'CommonPage', params: { type: 'add_medical_history', rmp_prescription_data: { from: "call" } } }],
            });
        }

    }
    // Render prop function

renderSubscribers = (subscribers) => {
    //console.log(subscribers,"subscribers....")
    return subscribers.map((streamId) => (
      <TouchableOpacity
        key={streamId}
        style={{ width: "100%", height: "100%", backgroundColor: 'black', display: this.state.subscriber_video_on ? "flex" : 'none', }}
      >
        <OTSubscriberView streamId={streamId}  style={{ width: "100%", height: "100%", backgroundColor: 'black', display: this.state.subscriber_video_on ? "flex" : 'none', }} />
      </TouchableOpacity>
    ));
  };

    getView = () => {
        if (this.state.call_completed) {
            if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
                return (<Rating parentCallback={this.additionalInfo}></Rating>)
            } else {
                return (<RmpConclusion parentCallback={this.additionalInfo} ></RmpConclusion>)
            }
        }
        if (this.state.session == 'connecting') {
            return (
                <View style={{
                    zIndex: 10,
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: width,
                    height: height,
                    //backgroundColor: 'red'
                }}>
                    <Connecting pageFrom="refresh" onRef={ref => (this.child = ref)} ></Connecting>
                </View>

            );
        }
        else {
            return (
                <View style={styles.container}>
                    <OTSession options={this.sessionOptions} eventHandlers={this.sessionEventHandlers} apiKey={this.state.apiKey} sessionId={this.state.sessionId} token={this.state.token} signal={this.state.signal}
                    >
                        <OTSubscriber>
                             {this.renderSubscribers}
                        </OTSubscriber>

                        {/* <OTSubscriber
                            properties={{
                                subscribeToAudio: true,
                                subscribeToVideo: true,
                            }}
                            eventHandlers={this.subscriberEventHandlers}
                            style={{ width: "100%", height: "100%", backgroundColor: 'black', display: this.state.subscriber_video_on ? "flex" : 'none', }} /> */}

                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && (
                            <Image
                                source={{
                                    uri: data.profile_picture_url + this.props.sessionDetail.Rmp_info.vProfilePicture
                                }}
                                style={[{
                                    resizeMode: 'cover',
                                    height: "100%", width: "100%"
                                }]}
                            />
                        )}
                        {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                            <Image
                                source={{
                                    uri: data.profile_picture_url + this.props.sessionDetail.Patient_info.vProfilePicture,
                                }}
                                style={[{
                                    resizeMode: 'cover',
                                    height: "100%", width: "100%"
                                }]}
                            />
                        )}
                        <View style={styles.pub_outer}>
                            <MovableView
                                style={{ flex: 1 }}>
                                <View style={styles.pub_inner}>
                                    <OTPublisher
                                        properties={{
                                            publishAudio: this.state.publishAudio,
                                            cameraPosition: this.state.cameraPosition,
                                            // publishVideo: true
                                            publishVideo: this.state.publishVideo
                                        }}
                                        style={{ width: "100%", height: "100%",zIndex:3 }} />
                                    <View style={styles.pub_text_container}>
                                        {this.props.user_data.iRoleId == constant.ROLE_PATIENT && (
                                            <Text style={styles.pub_user_txt}>
                                                {this.props.sessionDetail.Patient_info.vFirstName.substring(0, 7) + "..."} - {this.props.sessionDetail.Patient_info.iAge}/{this.props.sessionDetail.Patient_info.eGender.charAt(0)}</Text>
                                        )}
                                        {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                                            <Text style={styles.pub_user_txt}>Dr.
                                            {this.props.sessionDetail.Rmp_info.vFirstName.substring(0, 10) + "..."}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </MovableView>
                        </View>
                    </OTSession>
                    {this.state.is_endCall && (
                        <View style={{
                            zIndex: 10,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: width,
                            height: height,
                        }}>
                            <EndCallPopUp clickHandler={this.popUpClick}></EndCallPopUp>
                        </View>
                    )}

                    {this.state.showPopUp && (
                        <View style={{
                            zIndex: 10,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: width,
                            height: height,
                        }}>
                            <CommonPopUp clickHandler={this.popUpClick1} title="Confirm" msg="Do you wish to proceed with the call or disconnect call?"></CommonPopUp>
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
                            <TimerPopUp ref="child" clickHandler={this.popUpClick} title={"call"} msg={"Your Appointment is about to end after"}></TimerPopUp>
                        </View>
                    )}

                    {/* ************RMP Header Start ************ */}
                    {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                        <View style={styles.header_main}>
                            <View style={{ alignItems: 'center', padding: 10 }}>
                                <Text style={styles.head_text}>
                                    {this.props.sessionDetail.treatments.map((value, idx) => {
                                        if (idx < this.props.sessionDetail.treatments.length - 1) {
                                            return (value.vTreatmentName + ', ')
                                        } else {
                                            return (value.vTreatmentName)
                                        }
                                    })}
                                </Text>
                                <Text style={[styles.head_text, { fontFamily: 'OpenSans-Bold', }]}>{this.props.sessionDetail.eType == "Initial" ? "Initial Consult" : "Follow Up"}</Text>
                            </View>
                        </View>
                    )}

                    {/* ************RMP Header End ************ */}

                      {/* ************Refresh Start ************ */} 
                        <View style={[styles.refresh_main,{top:this.props.user_data.iRoleId == constant.ROLE_PATIENT? 30:69}]}>
                            <View style={{ alignItems: 'center', padding: 10,  }}>
                            <TouchableOpacity style={[styles.identityBtnContiner, {backgroundColor:colors.sub_theme, padding:5, borderRadius:5, flexDirection:'row'}]} onPress={() => {
                                        this.footerHandler('refresh')
                                    }}><Image style={{height:28, width:28, alignSelf:'center'}}
                                            source={refresh}
                                        />                                       
                                     <Text style={[styles.head_text, { fontFamily: 'OpenSans-Bold', alignSelf:'center', fontSize:15, paddingLeft:5, paddingRight:5}]}>RECONNECT</Text>
                                    </TouchableOpacity>
                              
                            </View>
                        </View>
                 

                    {/* ************Refresh End ************ */}

                    {/* ************Footer Buttons ************ */}
                    <View style={styles.footer_main}>
                        <View style={{ flexDirection: "row", justifyContent: 'space-around' }}>
                            {this.props.user_data.iRoleId == constant.ROLE_PATIENT && (
                                <Text style={styles.userInfo}>Dr.
                                 {this.props.sessionDetail.Rmp_info.vFirstName.substring(0, 10) + "..."} | Reg. No. {this.props.sessionDetail.Rmp_info.vRegistrationNo}</Text>
                            )}

                            {this.props.user_data.iRoleId != constant.ROLE_PATIENT && (
                                <Text style={styles.userInfo}>
                                    {this.props.sessionDetail.Patient_info.vFirstName.substring(0, 15) + "..."} - {this.props.sessionDetail.Patient_info.iAge}/{this.props.sessionDetail.Patient_info.eGender.charAt(0)}</Text>
                            )}
                            <Text style={styles.userInfo}>{this.state.minutes_Counter}:{this.state.seconds_Counter}</Text>
                        </View>
                        <View style={styles.footer_outer}>
                            <TouchableOpacity style={styles.footer_container} onPress={() => this.footerHandler('swap')}>
                                <Image style={styles.footer_icon}
                                    source={this.state.cameraPosition == 'front' ? selfieOn : selfieOff}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footer_container} onPress={() => this.footerHandler('video')}>
                                <Image style={styles.footer_icon}
                                    source={this.state.publishVideo ? videoOn : videoOff}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.footerHandler('audio')} style={styles.footer_container}>
                                <Image style={styles.footer_icon}
                                    source={this.state.publishAudio ? audioOn : audioOff}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.footerHandler('end_call')} style={styles.footer_container}>
                                <Image style={styles.footer_icon}
                                    source={end_call}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ************Confirm Identity Container Start************ */}
                    {(this.props.user_data.iRoleId != constant.ROLE_PATIENT && this.state.isrefresh == false) && (

                        <View style={styles.identity_container}>
                            {this.state.identityConfirm == "ask" && (
                                <View style={{ padding: 10, }}>
                                    <Text style={styles.identity_heading}>Confirm Patient's Identity {this.state.isrefresh.toString()}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', borderColor: colors.PLACEHOLDER_TEXT, height: 100, width: 100 }}>
                                            <Image
                                                source={{
                                                    uri: data.profile_picture_url + this.props.sessionDetail.Patient_info.vProfilePicture,
                                                }}
                                                style={[{
                                                    resizeMode: 'stretch',
                                                    height: 100, width: 100,
                                                    borderRadius: 10
                                                }]}
                                            />
                                        </View>
                                        <View style={{ flex: 1, marginLeft: 10 }}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5, fontWeight: 'bold' }]}>{this.props.sessionDetail.Patient_info.vFirstName}
                                                </Text>
                                                <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5, fontWeight: 'bold' }]}>{' | '} </Text>
                                                <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5, fontWeight: 'bold' }]}>{moment(this.props.sessionDetail.Patient_info.dDob).format("DD-MM-YYYY")}</Text>
                                            </View>
                                            <View>
                                                <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5, fontWeight: 'bold' }]}>Mobile: {this.props.sessionDetail.Patient_info.vMobileNo}</Text>
                                                <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5, fontWeight: 'bold' }]}>Address: {this.props.sessionDetail.Patient_info.tAddress}</Text>
                                            </View>


                                            {/* <Text style={styles.sub_heading}>Name</Text>
                                            <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5 }]}>{this.props.sessionDetail.Patient_info.vFirstName}

                                            </Text>
                                            <Text style={styles.sub_heading}>DOB</Text>
                                            <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5 }]}>
                                                {moment(this.props.sessionDetail.Patient_info.dDob).format("DD-MM-YYYY")}</Text>
                                            <Text style={styles.sub_heading}>Mobile</Text>
                                            <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5 }]}>{this.props.sessionDetail.Patient_info.vMobileNo}</Text> */}
                                        </View>

                                    </View>
                                    {/* <Text style={styles.sub_heading}>Address</Text>
                                    <Text style={[styles.sub_heading, { color: colors.sub_theme, marginBottom: 5 }]}>{this.props.sessionDetail.Patient_info.tAddress}</Text> */}
                                    <Button block style={styles.nextButtonContainer}
                                        onPress={() => {
                                            this.identityHandler('confirm');
                                        }} >
                                        <Text style={styles.nextButton}>Identity Confirmed</Text>
                                    </Button>
                                    <Button block style={[styles.nextButtonContainer, { backgroundColor: colors.danger }]}
                                        onPress={() => {
                                            this.identityHandler('not_confirm');
                                        }} >
                                        <Text style={styles.nextButton}>Identity Could not be Confirmed</Text>
                                    </Button>
                                </View>

                            )}
                            {this.state.identityConfirm == "not_confirm" && (
                                <View style={{ height: height / 3, justifyContent: 'space-around', alignItems: 'center', padding: 10 }}>
                                    <Text style={styles.identity_heading}>Patient’s Identity could not be confirmed. Please convey this to the Patient and End Call.</Text>
                                    <TouchableOpacity style={styles.identityBtnContiner} onPress={() => {
                                        this.identityHandler('end_call');
                                    }}>
                                        <Image style={styles.endBtnIcon}
                                            source={end_call}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}

                    {/* ************Confirm Identity Container Ends ************ */}
                    {/* {this.state.sub_streamId == "" && this.props.user_data.iRoleId == constant.ROLE_PATIENT && ( */}
                    {(this.state.sub_streamId == "") && (
                        <View style={{
                            zIndex: 10,
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: width,
                            height: height,
                            //backgroundColor: 'red'
                        }}>
                            <Connecting parentCallback={this.timeOutScreen} pageFrom={this.state.pageFrom} onRef={ref => (this.child = ref)} ></Connecting>
                        </View>
                    )}

                </View>
            );
        }
    }
    render() {
        return (
            this.getView()
        )

    }


    footerHandler = (action) => {
        console.log(action);
        switch (action) {
            case "audio":
                this.setState({ publishAudio: !this.state.publishAudio });
                break;
            case "video":
                if (this.props.user_data.iRoleId == constant.ROLE_PATIENT) {
                    this.setState({ publishVideo: !this.state.publishVideo }, () => {
                        this.sendSignal("1", "rmp_video_toggle");
                    });
                } else {
                    this.setState({ publishVideo: !this.state.publishVideo }, () => {
                        this.sendSignal("1", "patient_video_toggle");
                    });
                }
                break;
            case "swap":
                this.state.cameraPosition == 'back' ? this.setState({ cameraPosition: 'front' }) : this.setState({ cameraPosition: 'back' })
                break;
            case "end_call": {
                // this.sendSignal(0, "end_call");
                this.setState({ is_endCall: true })
                break;
            }
            case "refresh": {
                 this.sendSignal(1, "refresh");
                 setTimeout(() => {
                    this.setState({ session: "connecting" ,isrefresh: true});
                    setTimeout(() => {
                        this.setState({ session: "connect" });
                    }, 1500);
                 }, 300);
                 break;
            }
            default:
                break;
        }
    }

    identityHandler = (status) => {
        switch (status) {
            case "confirm":
                
                this.setState({ identityConfirm: status,isrefresh: true })
                break;

            case "not_confirm":
                this.setState({ showPopUp: true })


                break;
            case "end_call": {
                this.sendSignal(1, "identity_end");
                //this.connectDisconnect("disconnected");   
                //  this.setState({ call_completed: true });
                this.identityNotConfirmApi();
            }

                break;
            default:
                break;
        }
    }

    identityNotConfirmApi = () => {
        console.log("not confirm...")
        var param = {
            iAppointmentId: this.props.sessionDetail.iAppointmentId,
        }
        postApiRequestWithHeaders(data.api_endpoint.reject_identity, param, this.props.user_data.vAccessToken).then(
            data => {
            },
            error => {
            },
        );
    }

    timeOutScreen = (status) => {
        console.log(status, "timeout call");
        switch (status) {
            case "timeout":
                clear_push_interval();
                var param = {
                    iAppointmentId: this.props.sessionDetail.iAppointmentId,
                }
                postApiRequestWithHeaders(data.api_endpoint.missed_by, param, this.props.user_data.vAccessToken).then(
                    res => {
                        var push_data = {
                            data: [
                                {
                                    notification: {
                                        title: `TalkToMedic Call Missed`,
                                        body: this.props.user_data.iRoleId != constant.ROLE_PATIENT ? "Call Missed from Dr. " + this.props.sessionDetail.Rmp_info.vFirstName : "Call Missed from Patient " + this.props.sessionDetail.Patient_info.vFirstName,//this.props.sessionDetail.Patient_info.vFirstName,
                                        content_available: true,
                                        priority: 'high',
                                        //  sound: 'ask_ken_new.wav',
                                    },
                                    data: {
                                        type: 'missed',
                                        notify_users: [{ vDeviceToken: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? this.props.sessionDetail.Rmp_info.vDeviceToken : this.props.sessionDetail.Patient_info.vDeviceToken }]
                                    }
                                }
                            ],
                        };

                        postApiRequestWithHeaders(data.api_endpoint.push_payload, push_data, this.props.user_data.vAccessToken).then(
                            data => {
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'MyAccount' }],
                                })
                            },
                            error => {
                                console.log(error, 'errorrrrrr');
                            },
                        );

                    },
                    error => {
                    },
                );
                showToast(this.props.user_data.iRoleId == constant.ROLE_PATIENT ? data.ToastMessages.patient_busy : data.ToastMessages.doc_busy);
                // this.props.navigation.reset({
                //     index: 0,
                //     routes: [{ name: 'MyAccount', params: { type: 'my_appt' } }],
                // });
                break;

            case "end_call":
                clear_push_interval();
                var push_data = {
                    data: [
                        {
                            notification: {
                                title: `TalkToMedic Call Missed`,
                                body: this.props.user_data.iRoleId != constant.ROLE_PATIENT ? "Call Missed from Dr. " + this.props.sessionDetail.Rmp_info.vFirstName : "Call Missed from Patient " + this.props.sessionDetail.Patient_info.vFirstName,//this.props.sessionDetail.Patient_info.vFirstName,
                                content_available: true,
                                priority: 'high',
                            },
                            data: {
                                type: 'end_call',
                                notify_users: [{ vDeviceToken: this.props.user_data.iRoleId == constant.ROLE_PATIENT ? this.props.sessionDetail.Rmp_info.vDeviceToken : this.props.sessionDetail.Patient_info.vDeviceToken }]
                            }
                        }
                    ],
                };
                postApiRequestWithHeaders(data.api_endpoint.push_payload, push_data, this.props.user_data.vAccessToken).then(
                    data => {
                        this.props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'MyAccount' }],
                        })
                    },
                    error => {
                        console.log(error, 'errorrrrrr');
                    },
                );
                break;

            default:
                break;
        }


    }

    popUpClick = status => {
        console.log(status, "status");
        switch (status) {
            case "back":
                this.setState({ is_endCall: false })
                break;
            case "end":
                this.setState({ is_endCall: false })
                this.connectDisconnect("disconnected");
                RNCallKeep.endAllCalls();
                InCallManager.stop();
                this.sendSignal(0, "end_call");

                break
            case "ok":
                this.setState({ showTimer: false })
                break;
            default:
                break;
        }
    }


    popUpClick1 = status => {
        console.log(status, "status");
        this.setState({ showPopUp: !this.state.showPopUp })
        switch (status) {
            case "proceed":
                this.setState({ identityConfirm: "confirm", isrefresh: true })
                break;
            case "disconnect":
                this.setState({ identityConfirm: "not_confirm",isrefresh: true });
                break

            default:
                break;
        }

    }

}

function mapStateToProps(state) {
   // console.log(state, "Verify Number state... video calls")
    return {
        sessionDetail: state.sessionData,
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, {})(VideoCall);
