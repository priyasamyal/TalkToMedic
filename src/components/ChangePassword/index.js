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
class ChangePassword extends Component {
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
                this.props.navigation.goBack();
                // this.props.clickHandler('back');
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
                showToast(data.message);
                console.log(data, 'login response');
                // this.props.clickHandler('back');
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 1000);
                

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
                <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.CHANGE_PASSWORD}></HeaderComponent>

                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainContainer}>

                        <View style={styles.mainContent}>
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingTextLabel}>Current Password</Text>
                                <View style={styles.numberInputContainer}>
                                    <TextInput
                                        style={styles.numberInput}
                                        keyboardType="default"
                                        maxLength={32}
                                        ref={ref => (this.textInputRef = ref)}
                                        secureTextEntry={true}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={name => this.setState({
                                            vOldPassword:
                                                name
                                        })}
                                        value={this.state.vOldPassword}
                                    >
                                    </TextInput>
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingTextLabel}>New Password</Text>
                                <View style={styles.numberInputContainer}>
                                    <TextInput
                                        style={styles.numberInput}
                                        keyboardType="default"
                                        maxLength={32}
                                        ref={ref => (this.textInputRef = ref)}
                                        secureTextEntry={true}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={name => this.setState({
                                            vPassword:
                                                name
                                        })}
                                        value={this.state.vPassword}
                                    >
                                    </TextInput>
                                </View>
                            </View>
                            <View style={{ marginTop: 20 }}>
                                <Text style={styles.headingTextLabel}>Confirm New Password</Text>
                                <View style={styles.numberInputContainer}>
                                    <TextInput
                                        style={styles.numberInput}
                                        keyboardType="default"
                                        maxLength={32}
                                        ref={ref => (this.textInputRef = ref)}
                                        secureTextEntry={true}
                                        selectionColor={colors.THEME_YELLOW}
                                        onChangeText={name => this.setState({
                                            vConfirmPassword:
                                                name
                                        })}
                                        value={this.state.vConfirmPassword}
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
                                <Text style={styles.nextButton}>Update Password</Text>
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
export default connect(mapStateToProps, {})(ChangePassword);


