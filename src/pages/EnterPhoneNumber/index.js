//import liraries
import React, { Component } from 'react';
import HeaderComponent from '@components/HeaderComponent';
import styles from './styles';
import {
    View,
    TouchableOpacity,
    Platform,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    Dimensions
} from 'react-native';
import {
    Container, Button
} from 'native-base';
import { colors, constant, data } from '../../common/index';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
    networkCheck
} from '../../common/user';
import RNCallKeep from 'react-native-callkeep';
import CommonPopUp from '@components/CommonPopUp';
import { connect } from "react-redux";

import { setUser, setOtp } from "../../actions";
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
var { width, height } = Dimensions.get('window');

import Spinner from 'react-native-loading-spinner-overlay';
class EnterPhoneNumber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNo: '',
            disabled: true,
            text: "Enter",
            spinner: false,
            showNetworkPopup: false,
            fieldFocus: false
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
    }

    // maskNumber(text) {
    //     this.setState({ phoneNo: text.trim() });
    //     // var x = text.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,6})/);
    //     // let maskedValue = !x[2]
    //     //     ? x[1]
    //     //     : '' + x[1] + ' ' + x[2] + (x[3] ? ' ' + x[3] : '');

    //     // this.setState({ phoneNo: maskedValue }, () => {
    //     this.state.phoneNo.length >= 6
    //         ? this.setState({ disabled: false })
    //         : this.setState({ disabled: true });
    //     // });
    // }

    maskNumber = async (text) => {
        this.setState({ phoneNo: text }, () => {
            console.log(this.state);
            this.state.phoneNo.length >= 6
                ? this.setState({ disabled: false })
                : this.setState({ disabled: true });
        });

    }

    navigator = action => {
        console.log(action);
        if (action == "SplashScreen") {
            networkCheck().then(data => {
                if (!data) {
                    this.setState({
                        showNetworkPopup: true,
                    })
                } else {
                    this.setState({
                        showNetworkPopup: false,
                        fieldFocus: true
                    });
                    this.props.navigation.navigate(action);
                }
            });
        } else {
            this.props.navigation.goBack();
        }
    }

    refresh = () => {
        console.log('I have asasa');
        setTimeout(() => {
            console.log('aaaaa');
            this.textInputRef.focus();
        }, 200);
    };

    nextClicked() {

        console.log(this.props, 'next clicked', this.textInputRef, this.textInputRef._lastNativeText);
        if (this.state.phoneNo.trim() == "") {
            showToast(data.ToastMessages.phone_number);
        }
        if (this.state.phoneNo.trim().length <= 4) {
            if (this.state.phoneNo.trim().length != 0)
                showToast(data.ToastMessages.phone_number_validation);
        } else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);
            console.log("yes...")
            if (this.state.text == 'Enter') {
                const param = {
                    vMobileNo: this.state.phoneNo,
                    iCountryCode: "91",
                };
                this.verfiyUser(param);
            } else {
                //     console.log('update api call');

                //     this.updatePhoneNumber({
                //       phone_number: this.state.phoneNo,
                //       user_id: commonData.user_details.user_id,
                //     });
            }
        }
    }
    //   Verfiy user api call

    verfiyUser = param => {
        Keyboard.dismiss();
        postApiRequest(data.api_endpoint.verfiy_user, param).then(
            data => {
                this.props.setUser(param);
                console.log(data, 'dataaa');
                if (data.is_registerd) {
                    this.props.navigation.navigate('EnterPassword', { routeParam: data });
                } else {
                    this.props.setOtp({ otp: data.vOtp });
                    this.props.navigation.navigate('VerifyNumber');
                }
                setTimeout(() => {
                    this.setState({
                        spinner: !this.state.spinner
                    });
                }, 100);
            },
            error => {
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'error111');
                showToast(error);
            },
        );
    };


    render() {
        return (
            <Container>
                {this.state.showNetworkPopup && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.navigator} title="Internet Connectivity" msg="You don't have any internet connection."></CommonPopUp>
                    </View>
                )}
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <HeaderComponent show_headingCenter={true} show_back={false} clickHandler={this.navigator} title={constant.page_titles.LOGO}></HeaderComponent>
                <View style={styles.mainContainer}>
                    <KeyboardAvoidingView
                        keyboardShouldPersistTaps="handled"
                        style={styles.mainContent}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 50}>
                        <View style={styles.mainContent}>
                            <Text style={styles.headingText}>
                                {' '}
                                {this.state.text} your mobile {'\n'} number to continue
                       </Text>

                            <View style={styles.numberInputContainer}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        placeholder="Mobile Number"
                                        ref={ref => (this.textInputRef = ref)}
                                        style={styles.numberInput}
                                        keyboardType="number-pad"
                                        autoFocus={this.state.fieldFocus}
                                        maxLength={14}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={phoneNo => this.maskNumber(phoneNo)}
                                        blurOnSubmit={true}
                                        value={this.state.phoneNo}></TextInput>
                                </View>
                            </View>
                            {/* <View style={styles.nextButtonContainer}>
                                <TouchableOpacity
                                    style={{ alignSelf: 'flex-end', padding: 10 }}
                                    hitSlop={hitSlop}
                                    onPress={this.nextClicked.bind(this)}
                                    disabled={this.state.disabled}
                                >
                                    <Text
                                        style={[
                                            styles.nextButton,
                                            { opacity: this.state.disabled ? 0.4 : 1 },
                                        ]}>
                                        Next
                                </Text>
                                </TouchableOpacity>
                            </View> */}

                        </View>
                        <View style={styles.continueBtnContainer}>
                            <Button style={styles.continueBtn} onPress={this.nextClicked.bind(this)}>
                                <Text style={styles.continueBtnTxt}>Next</Text>
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Container>
        );
    }


}

function mapStateToProps(state) {
    console.log(state, "state...")
    return {
    }
}
export default connect(mapStateToProps, { setUser, setOtp })(EnterPhoneNumber);


