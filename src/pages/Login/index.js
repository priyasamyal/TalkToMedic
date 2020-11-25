//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
    Container,
    ActionSheet,
    Icon,
    Content,
    Left,
    Button,
    Body,
    Right,
    Title,
    Toast,
    Item,
    CheckBox,
    ListItem,
} from 'native-base';

import { StackActions, NavigationActions } from '@react-navigation/stack';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
import HeaderComponent from '@components/HeaderComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import {
    showToast,
    postApiRequest, setItem,
} from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';
import { setUserData } from "../../actions";
import { connect } from "react-redux";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            password: '',
            spinner: false,
        };
    }

    checkValidations = () => {
        if (this.state.phone_number == '') {
            showToast(data.ToastMessages.phone);
        }
        else if (this.state.password == '') {
            showToast(data.ToastMessages.password);
        } else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);
            var param = {
                vMobileNo: this.state.phone_number,
                iCountryCode: this.props.user.iCountryCode,
                vPassword: this.state.password,
                vDeviceToken: this.props.user.vDeviceToken,
            }

            postApiRequest(data.api_endpoint.login, param).then(
                data => {
                    console.log(data, 'login response');
                    this.props.setUserData(data.users);
                    setItem('user_details', JSON.stringify(data.users)).then(
                        res => {
                            if (res) {
                                console.log(res, "set Storage");
                                this.props.navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'MyAccount' }],
                                });
                            }
                        },
                        err => { },
                    );

                    this.setState({
                        spinner: !this.state.spinner
                    });

                },
                error => {
                    console.log(error, 'error');

                    showToast(error);
                    setTimeout(() => {
                        this.setState({
                            spinner: !this.state.spinner
                        });
                    }, 100);
                },
            );

        }
    }
    navigator = action => {
        console.log(action);
        switch (action) {
            case "next":
                this.checkValidations();
                break;
            case 'forgot':
                this.props.navigation.navigate('CommonPage', { type: 'forgot_password' });

            default:
                break;
        }

    }

    render() {
        return (
            <Container>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <HeaderComponent show_back={false} clickHandler={this.navigator} title={constant.page_titles.LOGIN}></HeaderComponent>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.mainContainer}>

                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.headingText}>Mobile Number</Text>
                            <View style={styles.numberInputContainer}>
                                <TextInput
                                    style={styles.numberInput}
                                    keyboardType="number-pad"
                                    maxLength={32}
                                    ref={ref => (this.textInputRef = ref)}
                                    selectionColor={colors.THEME_YELLOW}
                                    onChangeText={name => this.setState({
                                        phone_number:
                                            name
                                    })}
                                    value={this.state.phone_number}
                                >
                                </TextInput>
                            </View>
                        </View>



                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.headingText}>Password</Text>
                            <View style={styles.numberInputContainer}>
                                <TextInput
                                    style={styles.numberInput}
                                    keyboardType="default"
                                    maxLength={32}
                                    ref={ref => (this.textInputRef = ref)}
                                    selectionColor={colors.THEME_YELLOW}
                                    onChangeText={name => this.setState({
                                        password:
                                            name
                                    })}
                                    value={this.state.password}
                                >
                                </TextInput>
                            </View>
                        </View>

                        <View style={{ marginTop: 20, alignItems: 'flex-end', width: "100%", marginRight: 50, width: width }}>
                            <TouchableOpacity onPress={() => {
                                this.navigator('forgot');
                            }}>
                                <Text style={styles.forgot_text}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 20, }}>
                            <Button style={styles.nextButtonContainer}
                                onPress={() => {
                                    this.navigator('next');
                                }} >
                                <Text style={styles.nextButton}>Login</Text>
                            </Button>
                        </View>

                        <View style={{ marginTop: 20, }}>
                            <TouchableOpacity>
                                <Text style={[styles.forgot_text, { color: colors.sub_theme }]}>How It Works?</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </KeyboardAwareScrollView>
            </Container >
        );
    }
}


function mapStateToProps(state) {
    return {
        user: state.user
    }
}
export default connect(mapStateToProps, { setUserData })(Login);

