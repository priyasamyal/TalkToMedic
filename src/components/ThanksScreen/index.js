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
class ThanksScreen extends Component {
    componentDidMount() {
        console.log(commonData.signUpObj, "verification object...");
        //this.setState({ verificationCode: commonData.signUpObj.verification_code });
        this.setState({ disabled: false });
    }
    constructor(props) {
        super(props);
        this.state = {
            vOldPassword: "",
            vPassword: "",
            vConfirmPassword: "",
            disabled: true,
            loader: false,
        };
    }



    /**
     * Action when user clicks back or next button
     */
    navigator = (page) => {
        switch (page) {
            case 'next': {
                this.props.clickHandler('consult');
                break;
            }
            case 'account': {
                this.props.clickHandler('HomeAccount');
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
        if (this.state.vOldPassword == '') {
            showToast(data.ToastMessages.old_pass);
        }
        else if (this.state.vPassword == '') {
            showToast(data.ToastMessages.new_pass);
        }
        else if (this.state.vConfirmPassword == '') {
            showToast(data.ToastMessages.confirm_pass);
        }
        else if (this.state.vConfirmPassword != this.state.vPassword) {
            showToast(data.ToastMessages.not_match);
        } else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);
            const param = {
                vOldPassword: this.state.vOldPassword,
                vNewPassword: this.state.vPassword,
            };
            console.log(param);
            this.changePasswordApi(param);
        }
    };

    changePasswordApi = (param) => {
        postApiRequestWithHeaders(commonData.api_endpoint.change_password, param, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(data, 'login response');
                this.props.clickHandler('back');
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

                {this.props.type == "thanks_booking" && (<View style={styles.mainContent}>
                    <Text style={[styles.headingText, { fontFamily: 'OpenSans-Bold', fontSize: 25, }]}>Your appointment {'\n'} is confirmed </Text>
                    <Text style={styles.headingText}>You will receive Appointment{'\n'}
                        link via SMS </Text>
                    <Text style={styles.headingText}>OR {'\n'}{'\n'} Click the button below{'\n'}
                        to view your appointments</Text>
                    <View style={{ marginTop: 30 }}>
                        <Button style={styles.nextButtonContainer}
                            onPress={() => {
                                this.navigator('next');
                            }} >
                            <Text style={styles.nextButton}>Go to My Appointments</Text>
                        </Button>
                    </View>
                </View>)}


                {this.props.type != "thanks_booking" && (<View style={styles.mainContent}>
                    <Text style={[styles.headingText, { fontFamily: 'OpenSans-Bold', fontSize: 30, }]}>Thanks </Text>
                    <Text style={styles.headingText}>Prescription link has send{'\n'}
                        to Pharmacy </Text>
                    <Text style={[styles.headingText, { color: colors.danger }]}>Please note that link will be Active {'\n'}for next 20 mins</Text>

                    <View style={{ marginTop: 30 }}>
                        <Button style={styles.nextButtonContainer}
                            onPress={() => {
                                this.navigator('account');
                            }} >
                            <Text style={styles.nextButton}>Dashboard</Text>
                        </Button>
                    </View>
                </View>
                )}





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
export default connect(mapStateToProps, {})(ThanksScreen);


