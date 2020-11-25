import React, { useState, useEffect, Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import uuid from 'uuid';
import RNCallKeep from 'react-native-callkeep';
import BackgroundTimer from 'react-native-background-timer';
import DeviceInfo from 'react-native-device-info';
//import VoipPushNotification from 'react-native-voip-push-notification';

// import Home from '@components/Home';

const profile = require('../../assets/imgs/slider2.jpg')
BackgroundTimer.start();


const hitSlop = { top: 10, left: 10, right: 10, bottom: 10 };
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginTop: 20,
        marginBottom: 20,
    },
    callButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        width: '100%',
    },
    logContainer: {
        flex: 3,
        width: '100%',
        backgroundColor: '#D9D9D9',
    },
    log: {
        fontSize: 10,
    }
});
RNCallKeep.setup({
    ios: {
        appName: 'Jeff with Plumbing Issue',
    },
    android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
    },
});
const getNewUuid = () => uuid.v4().toLowerCase();

const format = uuid => uuid.split('-')[0];

const getRandomNumber = () => String(Math.floor(Math.random() * 100000));

const isIOS = Platform.OS === 'ios';
class CallKit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            logText: '',
            heldCalls: {}, // callKeep uuid: held
            mutedCalls: {},
            calls: {},
            is_call_start: false,
            current_uuid: ""
        };
        console.log(Object.keys(this.state.calls).length === 0, "length...")

        RNCallKeep.addEventListener('answerCall', this.answerCall);
        RNCallKeep.addEventListener('didPerformDTMFAction', this.didPerformDTMFAction);
        RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', this.didPerformSetMutedCallAction);
        RNCallKeep.addEventListener('didToggleHoldCallAction', this.didToggleHoldCallAction);
        RNCallKeep.addEventListener('endCall', this.endCall);

        // return () => {
        //     console.log("Will Unmount called.....");
        //     RNCallKeep.removeEventListener('answerCall', this.answerCall);
        //     RNCallKeep.removeEventListener('didPerformDTMFAction', this.didPerformDTMFAction);
        //     RNCallKeep.removeEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
        //     RNCallKeep.removeEventListener('didPerformSetMutedCallAction', this.didPerformSetMutedCallAction);
        //     RNCallKeep.removeEventListener('didToggleHoldCallAction', this.didToggleHoldCallAction);
        //     RNCallKeep.removeEventListener('endCall', this.endCall);
        // }
    }
    componentWillUnmount() {
        console.log("Will Unmount called.....");
        RNCallKeep.removeEventListener('answerCall', answerCall);
        RNCallKeep.removeEventListener('didPerformDTMFAction', didPerformDTMFAction);
        RNCallKeep.removeEventListener('didReceiveStartCallAction', didReceiveStartCallAction);
        RNCallKeep.removeEventListener('didPerformSetMutedCallAction', didPerformSetMutedCallAction);
        RNCallKeep.removeEventListener('didToggleHoldCallAction', didToggleHoldCallAction);
        RNCallKeep.removeEventListener('endCall', endCall);
    }


    componentDidMount() { // or anywhere which is most comfortable and appropriate for you
        console.log("Will mount this.displayIncomingCallDelayed.");

        RNCallKeep.addEventListener('answerCall', this.answerCall);
        RNCallKeep.addEventListener('didPerformDTMFAction', this.didPerformDTMFAction);
        RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
        RNCallKeep.addEventListener('didPerformSetMutedCallAction', this.didPerformSetMutedCallAction);
        RNCallKeep.addEventListener('didToggleHoldCallAction', this.didToggleHoldCallAction);
        RNCallKeep.addEventListener('endCall', this.endCall);
        // VoipPushNotification.requestPermissions(); // required
        // VoipPushNotification.addEventListener('register', (token) => {
        //     console.log("Register", token);
        //     // send token to your apn provider server
        // });
        // VoipPushNotification.addEventListener('notification', (notification) => {
        //     // register your VoIP client, show local notification, etc.
        //     console.log("notification receive", notification);
        //     // if (notification._data.type == "incoming_call") {
        //     //     console.log("call from push......", notification._data.data.caller_number)
        //     //     this.addCall(notification._data.data.uuid, notification._data.data.caller_number);

        //     // } else if (notification._data.type == "disconnect") {
        //     //     console.log("rejecting call....")
        //     //     RNCallKeep.rejectCall(notification._data.data.uuid);
        //     // }
        //     /* there is a boolean constant exported by this module called
        //      * 
        //      * wakeupByPush
        //      * 
        //      * you can use this constant to distinguish the app is launched
        //      * by VoIP push notification or not
        //      *
        //      * e.g. heldCalls: { '40470f60-24d7-4788-a52b-c944371bc028': false },
        //      */
        //     if (VoipPushNotification.wakeupByPush) {
        //         // do something...

        //         // remember to set this static variable to false
        //         // since the constant are exported only at initialization time
        //         // and it will keep the same in the whole app
        //         VoipPushNotification.wakeupByPush = false;
        //     }

        //     /**
        //      * Local Notification Payload
        //      *
        //      * - `alertBody` : The message displayed in the notification alert.
        //      * - `alertAction` : The "action" displayed beneath an actionable notification. Defaults to "view";
        //      * - `soundName` : The sound played when the notification is fired (optional).
        //      * - `category`  : The category of this notification, required for actionable notifications (optional).
        //      * - `userInfo`  : An optional object containing additional notification data.
        //      */
        //     // VoipPushNotification.presentLocalNotification({
        //     //     alertBody: "hello! " + notification.getMessage()
        //     // });
        //     //this.displayIncomingCallNow();
        // });
    }
    log(text) {
        console.info(text);
        this.setState((state, props) => {
            return {
                logText: this.state.logText + "\n" + text
            };
        });
        console.info(text);
    };

    myFunction = () => {
        console.log("hdd");
        console.log(this.state, "Updated States..");
        console.log(Object.keys(this.state.calls).length === 0, "length of state...")
    }

    addCall = (callUUID, number) => {
        this.setState((state, props) => {
            return {
                heldCalls: {
                    ...this.state.heldCalls,
                    [callUUID]: false
                }
            };
        }, this.myFunction);
        this.setState((state, props) => {
            return {
                calls: {
                    ...this.state.calls,
                    [callUUID]: number
                }
            };
        }, this.myFunction);
    };

    removeCall = (callUUID) => {

        const { [callUUID]: _, ...updated } = this.state.calls;
        const { [callUUID]: __, ...updatedHeldCalls } = this.state.heldCalls;
        this.setState((state, props) => {
            return {
                calls: updated,
                heldCalls: updatedHeldCalls
            };
        }, this.myFunction);
    };

    setCallHeld(callUUID, held) {
        this.setState((state, props) => {
            return {
                heldCalls: {
                    ...this.state.heldCalls,
                    [callUUID]: held
                }
            };
        }, this.myFunction);
    };

    setCallMuted(callUUID, muted) {
        this.setState((state, props) => {
            return {
                mutedCalls: {
                    ...this.state.mutedCalls,
                    [callUUID]: muted
                }
            };
        }, this.myFunction);
    };
    //************Show Calling.. UI Starts ************//
    displayIncomingCall(number) {
        console.log("hi");
        const callUUID = getNewUuid();

        this.addCall(callUUID, number);
        this.log(`[displayIncomingCall] ${format(callUUID)}, number: ${number}`);
        RNCallKeep.displayIncomingCall(callUUID, number, "Ask Ken Customer Call", 'number', false);
        // RNCallKeep.displayIncomingCall(callUUID, number, number, 'number', false);
    };

    displayIncomingCallNow() {
        // this.displayIncomingCall(getRandomNumber());
        this.displayIncomingCall("12385");
    };

    displayIncomingCallDelayed() {
        BackgroundTimer.setTimeout(() => {
            this.displayIncomingCall("12385");
        }, 3000);
    };
    //************Show Calling UI Ends **************//
    answerCall = ({ callUUID }) => {
        const number = this.state.calls[callUUID];
        this.log(`[answerCall1] ${format(callUUID)}, number: ${number}`);
        if (number != 'undefined') {
            console.log("cal..")
            this.setState((state, props) => {
                return {
                    current_uuid: callUUID,
                    is_call_start: true
                };
            });
            RNCallKeep.startCall(callUUID, number, number);
            BackgroundTimer.setTimeout(() => {
                this.log(`[setCurrentCallActive] ${format(callUUID)}, number: ${number}`);
                console.log(this.state, "all states..")

            }, 1000);
        }

    };

    didPerformDTMFAction = ({ callUUID, digits }) => {
        const number = this.state.calls[callUUID];
        this.log(`[didPerformDTMFAction] ${format(callUUID)}, number: ${number} (${digits})`);
    };
    didReceiveStartCallAction = ({ handle }) => {
        if (!handle) {
            // @TODO: sometime we receive `didReceiveStartCallAction` with handle` undefined`
            return;
        }
        const callUUID = getNewUuid();
        this.addCall(callUUID, handle);

        this.log(`[didReceiveStartCallAction] ${callUUID}, number: ${handle}`);

        RNCallKeep.startCall(callUUID, handle, handle);

        BackgroundTimer.setTimeout(() => {
            this.log(`[setCurrentCallActive] ${format(callUUID)}, number: ${handle}`);
            RNCallKeep.setCurrentCallActive(callUUID);
        }, 1000);
    };
    didPerformSetMutedCallAction = ({ muted, callUUID }) => {
        const number = this.state.calls[callUUID];
        this.log(`[didPerformSetMutedCallAction] ${format(callUUID)}, number: ${number} (${muted})`);

        this.setCallMuted(callUUID, muted);
    };
    didToggleHoldCallAction = ({ hold, callUUID }) => {
        const number = this.state.calls[callUUID];
        this.log(`[didToggleHoldCallAction] ${format(callUUID)}, number: ${number} (${hold})`);

        this.setCallHeld(callUUID, hold);
    };

    endCall = ({ callUUID }) => {
        console.log("end call......")
        const handle = this.state.calls[callUUID];
        // this.log(`[endCall] ${format(callUUID)}, number: ${handle}`);
        this.removeCall(callUUID);
    };

    hangup = (callUUID) => {
        console.log("hangUp", this.state)
        RNCallKeep.endCall(callUUID);
        this.removeCall(callUUID);
    };
    callbackFunction = (callUUID) => {

        console.log("parent callback...", callUUID);
        console.log("hangUp", this.state)
        RNCallKeep.endCall(callUUID);
        this.removeCall(callUUID);
        console.log("parent callback...", this.state)
        this.setState((state, props) => {
            return {
                current_uuid: "",
                is_call_start: false
            };
        });

        BackgroundTimer.setTimeout(() => {
            console.log("remove....")
            RNCallKeep.removeEventListener('answerCall', this.answerCall);
            RNCallKeep.removeEventListener('didPerformDTMFAction', this.didPerformDTMFAction);
            RNCallKeep.removeEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
            RNCallKeep.removeEventListener('didPerformSetMutedCallAction', this.didPerformSetMutedCallAction);
            RNCallKeep.removeEventListener('didToggleHoldCallAction', this.didToggleHoldCallAction);
            RNCallKeep.removeEventListener('endCall', this.endCall);
        }, 2000);

        BackgroundTimer.setTimeout(() => {
            console.log("add....")
            RNCallKeep.addEventListener('answerCall', this.answerCall);
            RNCallKeep.addEventListener('didPerformDTMFAction', this.didPerformDTMFAction);
            RNCallKeep.addEventListener('didReceiveStartCallAction', this.didReceiveStartCallAction);
            RNCallKeep.addEventListener('didPerformSetMutedCallAction', this.didPerformSetMutedCallAction);
            RNCallKeep.addEventListener('didToggleHoldCallAction', this.didToggleHoldCallAction);
            RNCallKeep.addEventListener('endCall', this.endCall);
        }, 3000);


    }

    setOnHold = (callUUID, held) => {
        const handle = this.state.calls[callUUID];
        RNCallKeep.setOnHold(callUUID, held);
        this.log(`[setOnHold: ${held}] ${format(callUUID)}, number: ${handle}`);
        this.setCallHeld(callUUID, held);
    };

    setOnMute = (callUUID, muted) => {
        const handle = this.state.calls[callUUID];
        RNCallKeep.setMutedCall(callUUID, muted);
        this.log(`[setMutedCall: ${muted}] ${format(callUUID)}, number: ${handle}`);
        this.setCallMuted(callUUID, muted);
    };

    updateDisplay = (callUUID) => {
        const number = this.state.calls[callUUID];
        // Workaround because Android doesn't display well displayName, se we have to switch ...
        if (isIOS) {
            RNCallKeep.updateDisplay(callUUID, 'New Name', number);
        } else {
            RNCallKeep.updateDisplay(callUUID, number, 'New Name');
        }

        this.log(`[updateDisplay: ${number}] ${format(callUUID)}`);
    };

    render() {
        if (!isIOS && DeviceInfo.isEmulator()) {
            console.log(isIOS, "isIOS....", DeviceInfo.isEmulator())
            return <Text style={styles.container}>CallKeep doesn't work on iOS emulator</Text>;

        }
        else if (this.state.is_call_start) {
            console.log("hi....");
            return (<Home parentCallback={this.callbackFunction} current_uuid={this.state.current_uuid}></Home>);
        }
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.displayIncomingCallNow()} style={styles.button} hitSlop={hitSlop}>
                    <Text>Display incoming call now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.displayIncomingCallDelayed()} style={styles.button} hitSlop={hitSlop}>
                    <Text>Display incoming call now in 3s</Text>
                </TouchableOpacity>
                {Object.keys(this.state.calls).map(callUUID => (
                    <View key={callUUID} style={styles.callButtons}>
                        <TouchableOpacity
                            onPress={() => this.setOnHold(callUUID, !this.state.heldCalls[callUUID])}
                            style={styles.button}
                            hitSlop={hitSlop}
                        >
                            <Text>{this.state.heldCalls[callUUID] ? 'Unhold' : 'Hold'} {this.state.calls[callUUID]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.updateDisplay(callUUID)}
                            style={styles.button}
                            hitSlop={hitSlop}
                        >
                            <Text>Update display</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.setOnMute(callUUID, !this.state.mutedCalls[callUUID])}
                            style={styles.button}
                            hitSlop={hitSlop}
                        >
                            <Text>{this.state.mutedCalls[callUUID] ? 'Unmute' : 'Mute'} {this.state.calls[callUUID]}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.hangup(callUUID)} style={styles.button} hitSlop={hitSlop}>
                            <Text>Hangup {this.state.calls[callUUID]}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
                <ScrollView style={styles.logContainer}>
                    <Text style={styles.log}>
                        {this.state.logText}
                    </Text>
                </ScrollView>
            </View>
        );
    }

}

export default CallKit
