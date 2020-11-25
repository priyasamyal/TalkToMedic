import React, { Component } from 'react';
import styles from './styles';
import {
    View,
    TouchableOpacity,
    Platform,
    Text,
    TextInput
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
    ActionSheet, Picker, CheckBox
} from 'native-base';
import { postApiRequestWithHeaders, setItem, showToast } from '../../common/user';
import { colors, constant, data } from '../../common/index';
import HeaderComponent from '@components/HeaderComponent';

import { setOtp } from "../../actions"
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';

// var Gender = ["Current", "Savings", "Cancel"];
var Gender = ["Current", "Savings"];

var CANCEL_INDEX = 2;
class WithdrawFunds extends Component {
    componentDidMount() {
        this.getBankDetail();
    }
    constructor(props) {
        super(props);
        this.state = {
            vEmail: "",
            vBusinessName: "",
            eBusinessType: "individual",
            vIfscCode: "",
            vBankName: "",
            vBeneficiaryName: "",
            tAccountType: "Current",
            iAccountNumber: "",
            bTncAccepted: false,
            BusinessType: [{
                id: "llp",
                name: "LLP"
            },
            {
                id: "ngo",
                name: "NGO"
            },
            {
                id: "other",
                name: "Other"
            },
            {
                id: "individual",
                name: "Individual"
            },
            {
                id: "partnership",
                name: "Partnership"
            },
            {
                id: "proprietorship",
                name: "Proprietorship"
            },
            {
                id: "public_limited",
                name: "Public Limited"
            },
            {
                id: "trust",
                name: "Trust"
            },
            {
                id: "society",
                name: "LLP"
            },
            {
                id: "not_yet_registered",
                name: "Not yet Registered"
            },
            {
                id: "educational_institutes",
                name: "Educational Institutes"
            }],
            spinner: false,
            isExist: false,
            acc_detail: {}
        };
    }



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


    verfiyApiCall = () => {
        if (this.state.vEmail.trim() == "") {
            showToast("Please enter your email address.");
            return false
        }
        else if (this.state.vBusinessName.trim() == "") {
            showToast("Please enter your Business name.");
            return false
        }
        else if (this.state.vBankName.trim() == "") {
            showToast("Please enter bank name.");
            return false
        }
        else if (this.state.vIfscCode.trim() == "") {
            showToast("Please enter IFSC Code.");
            return false
        }
        
        else if (this.state.vBeneficiaryName.trim() == "") {
            showToast("Please enter beneficiary name.");
            return false
        }
        else if (this.state.tAccountType.trim() == "") {
            showToast("Please select Account type.");
            return false
        }
        else if (this.state.iAccountNumber.trim() == "") {
            showToast("Please enter Account number.");
            return false
        }
        else if (!this.state.bTncAccepted) {
            showToast("Please accept the terms and conditions.");
            return false
        } else {
            this.addBackAccount();
        }
    };

    getBankDetail = () => {
        postApiRequestWithHeaders(commonData.api_endpoint.get_bank_account, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log("getBankDetail", data);
                this.setState({
                    isExist: true,
                    acc_detail: data.account_details
                })
            },
            error => {
                this.setState({
                    isExist: false
                })
                console.log(error, 'error');
            },
        );
    }
    addBackAccount = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        const param = {
            "vEmail": this.state.vEmail,
            "vBusinessName": this.state.vBusinessName,
            "eBusinessType": this.state.eBusinessType,
            "vIfscCode": this.state.vIfscCode,
            "vBeneficiaryName": this.state.vBeneficiaryName,
            "tAccountType": this.state.tAccountType.toLowerCase(),
            "iAccountNumber": this.state.iAccountNumber,
            "bTncAccepted": this.state.bTncAccepted,
            vBankName: this.state.vBankName
        };
        console.log(param, 'param');
        postApiRequestWithHeaders(commonData.api_endpoint.bank_account, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log("data", data)
                this.setState({
                    spinner: !this.state.spinner
                });
                if (data.message == "Bank Details Added Successfully") {
                    // this.props.clickHandler('back')
                    this.props.navigation.goBack();
                }
                showToast(data.message);
            },
            error => {
                console.log(error, 'error');
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(error.message);
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
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.WITHDRAW}></HeaderComponent>
                    {this.state.isExist && (
                        <View style={{ padding: 20 }}>
                            <Text style={styles.headingText}>
                                Currently Linked Bank Account
                                                </Text>
                            <Text style={[styles.headingTextLabel, { fontFamily: 'OpenSans-Bold', }]}>Bank Name</Text>
                            <Text style={[styles.checkboxText, {}]}>{this.state.acc_detail.vBankName}</Text>
                            <Text style={[styles.headingTextLabel, { fontFamily: 'OpenSans-Bold', marginTop: 20 }]}>Account Number</Text>
                            <Text style={[styles.checkboxText, {}]}>{this.state.acc_detail.vAccountNumber}</Text>
                        </View>

                    )}
                    {!this.state.isExist && (
                        <View style={styles.mainContainer}>

                            <View style={styles.mainContent}>
                                <Text style={styles.headingText}>
                                    {' '}
                                    Please provide your Bank Account Details in which you want to withdraw your funds.
                        </Text>
                                <View style={{ marginTop: 0 }}>
                                    <Text style={styles.headingTextLabel}>Email</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="email-address"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            autoCapitalize='none'
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vEmail: name })}
                                            value={this.state.vEmail}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>Bussiness Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}

                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vBusinessName: name })}
                                            value={this.state.vBusinessName}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>Bussiness Type</Text>
                                    <View style={styles.numberInputContainer}>
                                        <Picker
                                            note
                                            iosIcon={<Icon name="ios-arrow-down" style={{ color: colors.sub_theme, fontSize: 25 }} />}
                                            iosHeader="Select"
                                            mode="dropdown"
                                            textStyle={[styles.stateCouncilTxt]}
                                            style={[{ width: "100%", }]}
                                            selectedValue={this.state.eBusinessType}
                                            onValueChange={(value) => {
                                                this.setState({
                                                    eBusinessType: value
                                                });
                                            }}
                                        >
                                            {this.state.BusinessType.map((value, idx) => {
                                                console.log(value, idx)
                                                return (
                                                    <Picker.Item label={value.name} value={value.id} />
                                                )
                                            })}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>Bank Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}

                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vBankName: name })}
                                            value={this.state.vBankName}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>IFSC Code</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}

                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vIfscCode: name })}
                                            value={this.state.vIfscCode}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>Beneficiary Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}

                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vBeneficiaryName: name })}
                                            value={this.state.vBeneficiaryName}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>Account Type</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TouchableOpacity onPress={() =>
                                            ActionSheet.show(
                                                {
                                                    options: Gender,
                                                    cancelButtonIndex: CANCEL_INDEX,
                                                    title: "Account Type"
                                                },
                                                buttonIndex => {
                                                    console.log(buttonIndex)
                                                    buttonIndex != 2 ? this.setState({ tAccountType: Gender[buttonIndex] }) : '';
                                                }
                                            )}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.numberInput}>{this.state.tAccountType}</Text>
                                                <Icon
                                                    style={[{
                                                        alignSelf: 'center',
                                                        color: colors.sub_theme,
                                                        paddingRight: 5
                                                    }]}
                                                    name='ios-arrow-down' />
                                            </View>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingTextLabel}>Account Number</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="number-pad"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}

                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ iAccountNumber: name })}
                                            value={this.state.iAccountNumber}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>
                                    <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                                        checked={this.state.bTncAccepted}
                                        hitSlop={hitSlop}
                                        onPress={() => this.setState({ bTncAccepted: !this.state.bTncAccepted })}
                                    />
                                    <Body>
                                        <TouchableOpacity onPress={() => this.setState({ bTncAccepted: !this.state.bTncAccepted })}>
                                            <Text style={styles.checkboxText}>I accept and Agree to Terms & Conditions</Text>
                                        </TouchableOpacity>
                                    </Body>
                                </View>
                                <View style={{ marginTop: 15, }}>
                                    <Button full style={styles.nextButtonContainer}
                                        onPress={() => {
                                            this.navigator('next');
                                        }} >
                                        <Text style={styles.nextButton}>Submit</Text>
                                    </Button>
                                </View>

                            </View>
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </Container>

        );
    }
}

function mapStateToProps(state) {
    return {
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, {})(WithdrawFunds);
