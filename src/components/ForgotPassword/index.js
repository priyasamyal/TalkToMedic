import React, { Component } from 'react';
import styles from './styles';
import {
    View,
    TouchableOpacity,
    Platform,
    Text,
    TextInput,
    Dimensions
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
import { postApiRequest, setItem, showToast } from '../../common/user';
import { colors, constant, data } from '../../common/index';
import HeaderComponent from '@components/HeaderComponent';
import { connect } from "react-redux";
import { setOtp } from "../../actions"
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

import Spinner from 'react-native-loading-spinner-overlay';

var { width, height } = Dimensions.get('window');

class ForgotPassword extends Component {
    componentDidMount() {
        console.log(commonData.signUpObj, "verification object...");
        //this.setState({ verificationCode: commonData.signUpObj.verification_code });
        this.setState({ disabled: false });
    }
    constructor(props) {
        super(props);
        this.state = {

            vMobileNo: "",

            verificationCode: '',
            modalVisible: false,
            disabled: true,
            loader: false,
        };
    }


    /**
     * Enable disable next button for valid input
     */
    disableButton(text) {
        this.setState({ verificationCode: text });
        const namePattern = /^[0-9]*$/;
        let code = namePattern.test(text);
        text.length == 4 && code
            ? this.setState({ disabled: false })
            : this.setState({ disabled: true });
    }
    /**
     * Action when user clicks back or next button
     */
    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');
                this.verfiyApiCall();
                break;
            }
            case 'back': {
                console.log('back');
                this.props.clickHandler('back');
                // console.log(this.props.navigation, 'navigationnn');
                // this.props.navigation.state.params.onGoBack();
                // this.props.navigation.goBack();
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
        this.forgotApiCall();
        // this.props.clickHandler('back');
        // console.log(
        //     this.state.verificationCode,
        //     commonData.signUpObj.verificationCode,
        // );
        // if (this.state.verificationCode == commonData.signUpObj.verification_code) {
        //     this.props.navigation.navigate('EnterName', {
        //         onGoBack: () => this.refresh(),
        //     });
        // } else {
        //     Toast.show({
        //         text: commonData.ToastMessages.verfication_error,
        //         position: 'bottom',
        //         duration: 3000,
        //     });

        // }
    };

    forgotApiCall = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        const param = {
            vMobileNo: this.state.vMobileNo,
            iCountryCode: "91",
        };
        console.log(param, 'param');
        postApiRequest(commonData.api_endpoint.forgot_password, param).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                this.props.clickHandler('back');
                console.log(data, 'forgot response');


            },
            error => {
                console.log(error, 'error');
                this.setState({
                    spinner: !this.state.spinner
                });

                showToast(error);
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
                <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.ENTER_PASSWORD}></HeaderComponent>
                <View style={styles.mainContainer}>
                    <KeyboardAvoidingView
                        style={styles.mainContent}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 50}>
                        <View style={styles.mainContent}>
                            <Text style={styles.headingText}>
                                {' '}
                                Enter your Register Mobile Number & we'll SMS you a new Password.
                            </Text>

                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingTextLabel}>Mobile Number</Text>
                                <View style={styles.numberInputContainer}>
                                    <TextInput
                                        style={styles.numberInput}
                                        keyboardType="numeric"
                                        maxLength={20}
                                        ref={ref => (this.textInputRef = ref)}
                                        autoFocus={true}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={name => this.setState({ vMobileNo: name.trim() })}
                                        value={this.state.vMobileNo}
                                    >
                                    </TextInput>
                                </View>
                            </View>

                            <View style={[styles.nextButtonContainer]}>
                                <TouchableOpacity
                                    style={{ alignSelf: 'flex-end', padding: 10, right : 20 }}
                                    hitSlop={hitSlop}
                                    onPress={() => this.navigator('next')}
                                    disabled={this.state.disabled}>
                                    <Text
                                        style={[
                                            styles.nextButton,
                                            { opacity: this.state.disabled ? 0.4 : 1 },
                                        ]}>
                                        Submit
                  </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Container>
        );
    }
}

export default ForgotPassword;


