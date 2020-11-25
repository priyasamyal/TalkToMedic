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
import BackgroundTimer from 'react-native-background-timer';
import { colors, constant, data } from '../../common/index';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import HeaderComponent from '@components/HeaderComponent';
import { connect } from "react-redux";
import { setOtp } from "../../actions"
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
import { ScrollView } from 'react-native-gesture-handler';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
var { width, height } = Dimensions.get('window');
class VerifyNumber extends Component {
    componentDidMount() {
        // console.log(this.props.user.vOtp, "this.props.user.vOtp")
        let timer = setInterval(() => {
            var num = (Number(this.state.seconds_Counter) - 1).toString();
            if (Number(this.state.seconds_Counter) == 0) {
                num = '00';
            }
            if (this.state.seconds_Counter == "01") {
                console.log("clear");
                clearInterval(timer)
            }
            this.setState({
                seconds_Counter: num.length == 1 ? '0' + num : num
            });
        }, 1000);
    }
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: "",
            disabled: true,
            loader: false,
            minutes_Counter: '00',
            seconds_Counter: '30'
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
        console.log("donnnnnee")
        switch (page) {
            case 'next': {
                console.log('next');
                if (this.state.verificationCode.trim() == "") {
                    showToast(data.ToastMessages.verfication_empty);
                } else {
                    this.verfiyApiCall();
                }

                break;
            }
            case 'back': {
                console.log('back');
                console.log(this.props.navigation, 'navigationnn');
                this.props.navigation.goBack();
                break;
            }
            case 'resend': {
                this.Resend();
                this.setState({ verificationCode: "" });
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


    Resend = () => {
        const param = {
            vMobileNo: this.props.user.vMobileNo,
            iCountryCode: "91",
        };
        console.log(param, "param")
        postApiRequest(data.api_endpoint.verfiy_user, param).then(
            data => {
                console.log(data, 'dataaa');
                if (data.is_registerd) {
                    this.props.navigation.navigate('EnterPassword');
                } else {
                    /** Modified on 17-08-2020 */
                    showToast("OTP has been sent successfully.");
                    setTimeout(() => {
                        this.props.setOtp({ otp: data.vOtp });
                    }, 100);
                }

            },
            error => {
                console.log(error, 'error111');
                showToast(error);
            },
        );
    };

    /**
     * Check if entered code is corrent or wrong
     */
    verfiyApiCall = () => {
        console.log(this.props)
        if (this.state.verificationCode == this.props.user.vOtp) {
            this.props.navigation.navigate('SelectUser');
        }
        else {
            Toast.show({
                text: commonData.ToastMessages.verfication_error,
                position: 'bottom',
                duration: 3000,
            });

        }
    };

    render() {
        return (
            <Container>
                <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.LOGO}></HeaderComponent>

                <ScrollView style={styles.mainContainer}>
                    <KeyboardAvoidingView
                        style={styles.mainContent}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 65 : 50}>
                        <View
                            style={styles.mainContent}
                        >
                            <Text style={styles.headingText}>
                                {' '}
                                Verify your number by typing {'\n'} the verification code we
                                just {'\n'} sent you
                            </Text>

                            <View style={styles.numberInputContainer}>
                                <TextInput
                                    placeholder="Verification Code"
                                    style={styles.numberInput}
                                    keyboardType="number-pad"
                                    ref={ref => (this.textInputRef = ref)}
                                    autoFocus={true}
                                    maxLength={4}
                                    selectionColor={colors.THEME_YELLOW}
                                    onChangeText={verificationCode =>
                                        this.disableButton(verificationCode)
                                    }
                                    value={this.state.verificationCode}></TextInput>
                            </View>

                            <View style={{ marginTop: 30 }}>
                                {this.state.seconds_Counter != "00" && (
                                    <View>
                                        <Icon
                                            style={[{
                                                alignSelf: 'center',
                                                color: colors.sub_theme,
                                                paddingRight: 5,
                                                fontSize: 40
                                            }]}
                                            name='ios-timer' />
                                        <Text style={[styles.headingText, { marginTop: 0, fontWeight: 'bold' }]}>
                                            {this.state.minutes_Counter}:{this.state.seconds_Counter}</Text>
                                    </View>

                                )}
                                {this.state.seconds_Counter == "00" && (
                                    <TouchableOpacity hitSlop={hitSlop}
                                        onPress={() => this.navigator('resend')}
                                    >
                                        <Text style={[styles.headingText, { textDecorationLine: 'underline', marginBottom: 30, }]}> Resend OTP</Text>
                                    </TouchableOpacity>
                                )}

                            </View>


                            {/* <View style={[styles.nextButtonContainer, { width: width - 80 }]}>
                                <TouchableOpacity
                                    style={{ 
                                            alignSelf: 'flex-end', 
                                            padding: 10 }}
                                    hitSlop={hitSlop}
                                    onPress={() => this.navigator('next')}
                                    disabled={this.state.disabled}>
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
                        <View style={[styles.continueBtnContainer, { position: "absolute", bottom: 10 }]}>
                            <Button style={styles.continueBtn} onPress={() => this.navigator('next')}>
                                <Text style={styles.continueBtnTxt}>Next</Text>
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Container>
        );
    }
}
function mapStateToProps(state) {
    console.log(state, "kk")
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, { setOtp })(VerifyNumber);


