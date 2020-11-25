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
class PharmacyOTP extends Component {
    componentDidMount() {
        console.log(commonData.signUpObj, "verification object...");
        //this.setState({ verificationCode: commonData.signUpObj.verification_code });
        this.setState({ disabled: false });
    }
    constructor(props) {
        super(props);
        this.state = {
            vOtp: "",
            vPassword: "",
            vConfirmPassword: "",
            disabled: true,
            loader: false,
        };
    }

    componentDidMount() {
        console.log(this.props, "props in OTP")
    }

    /**
     * Action when user clicks back or next button
     */
    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');
                this.verfiyApiCall();
                //  this.props.clickHandler('pharmacy_mobile', "data");
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
        if (this.state.vOtp == '') {
            showToast("Please enter OTP");
            return false
        }
        else if (this.state.vOtp != this.props.pharmcyData.vOtp) {
            showToast("Please enter valid OTP");
            return false
        }
        else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);
            const param = {
                "vMobileNo": this.props.pharmcyData.vMobileNo,
                "iPrescriptionActivityId": this.props.pharmcyData.iPrescriptionActivityId,
            };
            console.log(param);
            this.sendLink(param);
        }
    };

    sendLink = (param) => {
        postApiRequestWithHeaders(commonData.api_endpoint.send_pharm_link, param, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(data, 'login response');
                this.props.clickHandler('thanksPharm');
                //  this.props.clickHandler('back');
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
                <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.PHARMACY_OTP}></HeaderComponent>

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainContainer}>

                        <View style={styles.mainContent}>
                            <Text style={styles.headingText}>Please Enter the OTP {'\n'}
                                Received by Pharmacy </Text>
                            <View style={{ marginTop: 20 }}>

                                <View style={styles.numberInputContainer}>
                                    <TextInput
                                        placeholder="Enter OTP"
                                        style={styles.numberInput}
                                        keyboardType="number-pad"
                                        maxLength={4}
                                        ref={ref => (this.textInputRef = ref)}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={name => this.setState({
                                            vOtp:
                                                name
                                        })}
                                        value={this.state.vOtp}
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
                                <Text style={styles.nextButton}>Send Prescription Link</Text>
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
export default connect(mapStateToProps, {})(PharmacyOTP);


