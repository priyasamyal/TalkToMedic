import React, { Component } from 'react';
import styles from './styles';
import {
    View,
    TouchableOpacity,
    Platform,
    Text,
    TextInput,
    ScrollView

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
    Toast,
} from 'native-base';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import { colors, constant, data } from '../../common/index';
import HeaderComponent from '@components/HeaderComponent';
import { connect } from "react-redux";
import { setOtp } from "../../actions"
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

import Spinner from 'react-native-loading-spinner-overlay';
class PharmacyMobile extends Component {
    componentDidMount() {
        console.log(commonData.signUpObj, "verification object...");
        //this.setState({ verificationCode: commonData.signUpObj.verification_code });
        this.setState({ disabled: false });
    }
    constructor(props) {
        super(props);
        this.state = {
            vMobileNo: "",
            loader: false,
        };
        console.log(this.props, "kkll")
    }



    /**
     * Action when user clicks back or next button
     */
    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');
                this.verfiyApiCall()
                //   this.props.clickHandler('pharmacy_otp', "data");
                break;
            }
            case 'back': {
                console.log('back');
                this.props.clickHandler('back');
                break;
            }
        }
    }
    refresh = () => {
        console.log('I have asasa');
        setTimeout(() => {
            console.log('aaaaa');
            this.textInputRef.focus();
        }, 100);
    };

    /**
     * Check if entered code is corrent or wrong
     */
    verfiyApiCall = () => {
        console.log(this.state, this.props.user_data);
        if (this.state.vMobileNo == '') {
            showToast(data.ToastMessages.phone);
            return false;
        } else {
            const param = {
                vMobileNo: this.state.vMobileNo,
                iAppointmentId: this.props.pharmcyMobile.iAppointmentId,
                iPrescriptionId: this.props.pharmcyMobile.iPrescriptionId
            };
            console.log(param);
            this.sendOtp(param);
        }
    };

    sendOtp = (param) => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(commonData.api_endpoint.pharmacy_otp, param, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(data, 'login response');
                var payload = {
                    vMobileNo: this.state.vMobileNo,
                    vOtp: data.vOtp,
                    iPrescriptionActivityId: data.iPrescriptionActivityId
                }
                this.props.clickHandler('pharmacy_otp', payload);
                //this.props.clickHandler('back');
                showToast(data.message);

            },
            error => {
                console.log(error, 'error');
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });

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
                <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.PHARMACY}></HeaderComponent>

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainContainer}>

                        <View style={styles.mainContent}>
                            <Text style={styles.headingText}>Please enter {'\n'}Pharmacy's Mobile Number </Text>
                            <View style={{ marginTop: 20 }}>

                                <View style={styles.numberInputContainer}>
                                    <TextInput
                                        placeholder="Enter Mobile Number"
                                        style={styles.numberInput}
                                        keyboardType="number-pad"
                                        maxLength={14}
                                        ref={ref => (this.textInputRef = ref)}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={name => this.setState({
                                            vMobileNo:
                                                name
                                        })}
                                        value={this.state.vMobileNo}
                                    >
                                    </TextInput>
                                </View>
                            </View>


                        </View>

                        <View style={{ marginTop: 30 }}>
                            <Button style={styles.nextButtonContainer}
                                onPress={() => {
                                    this.navigator('next');
                                }} >
                                <Text style={styles.nextButton}>Generate OTP</Text>
                            </Button>
                        </View>

                    </View>
                </KeyboardAwareScrollView>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData,

    }
}
export default connect(mapStateToProps, {})(PharmacyMobile);


