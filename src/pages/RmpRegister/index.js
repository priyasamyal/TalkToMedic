//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
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
    Picker
} from 'native-base';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import Camera from '@components/Camera';
import { openUrl } from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';
// create a component
var Gender = ["Male", "Female", "Others", "Cancel"];
var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const default_doc = require('../../assets/imgs/default_doc.png');
const calendar = require('../../assets/imgs/calendar.png');
import { connect } from "react-redux";
import { setUserData } from "../../actions";
import moment from 'moment';
import YearMonthPicker from './yearMonthPicker';
import { AppEventsLogger } from "react-native-fbsdk";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class RmpRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            // gender: Gender.filter(m => m.startsWith("F")),
            gender: " ",

            phoneNo: this.props.user_data.phone_number,
            password: '',
            terms_accepted: false,
            is_acknowledged: false,
            showCamera: false,
            uri: '',
            spinner: false,
            image_data: {},
            iMedicalCouncilId: '',
            vRegistrationNo: '',
            iRegistrationYear: ' ',
            vRegistrationCert: '',

            startYear: 1960,
            endYear: new Date().getFullYear(),
            selectedMonth: '',
            current_image_selection: '',
        };
    }

    componentDidMount() {
        console.log("log", this.props.state_council)
    }
    checkValidations = () => {

        if (this.state.first_name == '' && this.state.last_name == ''
            && this.state.iMedicalCouncilId == '' && this.state.iRegistrationYear == ''
            && this.state.vRegistrationCert == '' && this.state.password == '') {
            showToast("All the fields required.");
            return;
        }

        if (this.state.first_name == '') {
            showToast(data.ToastMessages.first_name);
        }
        else if (this.state.last_name == '') {
            showToast(data.ToastMessages.last_name);
        }
        else if (this.state.gender.trim().length === 0) {
            showToast(data.ToastMessages.valid_gender);
        }
        else if (this.state.password == '') {
            showToast(data.ToastMessages.password);
        }
        else if (this.state.password.trim().length <= 5) {
            showToast("Password lenght should be minimum six.");
        }
        else if (this.state.iMedicalCouncilId == '') {
            showToast(data.ToastMessages.med_council);
        }
        else if(this.state.vRegistrationNo == ''){
            showToast("Please enter registration no.");
        }
        else if (this.state.iRegistrationYear.trim().length == 0) {
            showToast(data.ToastMessages.reg_year);
        }
        // else if (this.state.vRegistrationCert == '') {
        //     showToast(data.ToastMessages.reg_cer);
        // }
        else if (Object.keys(this.state.image_data).length === 0) {
            showToast(data.ToastMessages.photo);
        }
        else if (!this.state.terms_accepted) {
            showToast(data.ToastMessages.terms);
        }
        else if (!this.state.is_acknowledged) {
            showToast(data.ToastMessages.ack);
        } else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);

            var param = {
                vMobileNo: this.props.user_data.vMobileNo,
                iCountryCode: this.props.user_data.iCountryCode,
                vFirstName: this.state.first_name,
                vLastName: this.state.last_name,
                eGender: this.state.gender,
                vPassword: this.state.password,
                // vProfilePicture: 'data:image/jpeg;base64,' + this.state.image_data.base64,
                vProfilePicture: this.state.uri,
                iRoleId: this.props.user_data.iRoleId,
                vDeviceToken: this.props.user_data.vDeviceToken,
                iMedicalCouncilId: this.state.iMedicalCouncilId,
                vRegistrationNo: this.state.vRegistrationNo,
                iRegistrationYear: this.state.iRegistrationYear,
                vRegCertificatePhoto: this.state.vRegistrationCert,
                vPlatform: 'android'

            }
            console.log(param);
            this.registerUser(param)

        }
    }

    registerUser = (param) => {
        postApiRequest(data.api_endpoint.rmpSignup, param).then(
            data => {
                console.log(data, 'dataaa');
                this.props.setUserData(data.user);
                // this.props.navigation.navigate('Login');
                showToast("Register Successfully");
                AppEventsLogger.logEvent("RMP Register", {});
                //   this.props.navigation.navigate('Login');
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount', params: { type: 'practice_detail' } }],
                });
                setTimeout(() => {
                    this.setState({
                        spinner: !this.state.spinner
                    });
                }, 100);
            },
            error => {
                setTimeout(() => {
                    this.setState({
                        spinner: !this.state.spinner
                    });
                }, 100);
                console.log(error, 'error111');
                showToast(error);

            },
        );
    }

    openCamera = () => {
        this.setState({ showCamera: true })
    }
    onValueChange(value) {
        this.setState({
            iMedicalCouncilId: value
        });
    }
    navigator = (action, data) => {
        switch (action) {
            case "next":
                console.log(this.state, this.props);
                this.checkValidations();
                break;

            case "camera_click":
                if (this.state.current_image_selection == "back_doc") {
                    this.setState({ showCamera: false, vRegistrationCert: data.uri })
                } else {
                    this.setState({ showCamera: false, uri: data.uri, image_data: data.full_object })
                }

                break;
            case "back_camera":
                this.setState({ showCamera: false })
                break;
            case "back":
                this.props.navigation.goBack();
                break;
            case "terms":
                openUrl("https://www.talktomedic.in/terms")
                break;
            case "privacy":
                openUrl("https://www.talktomedic.in/privacy")
                break;
            default:
                break;
        }
    }

    openCameraForImage = (status) => {
        this.setState({ current_image_selection: status }, () => {
            setTimeout(() => {
                this.setState({ showCamera: true })
            }, 500);

        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                {!this.state.showCamera && (
                    <View>
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            //  style={styles.mainContent}
                            //  contentContainerStyle={styles.mainContent}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled">
                            <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.RMP_REGISTER}></HeaderComponent>
                            {/* <ScrollView showsVerticalScrollIndicator={false}> */}

                            <View style={[styles.mainContainer]}>
                                <Text style={[styles.headingText, {fontSize: 20, 
                                        fontFamily : "OpenSans-Bold", 
                                        alignSelf: "flex-start", paddingLeft: 20}]}>Medical Practitioner</Text>
                                {/* <KeyboardAvoidingView
                                    style={styles.mainContent}
                                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}> */}

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>First Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({
                                                first_name:
                                                    name
                                            })}
                                            value={this.state.first_name}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Last Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            //   autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({
                                                last_name:
                                                    name
                                            })}
                                            value={this.state.last_name}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Gender</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TouchableOpacity onPress={() =>
                                            ActionSheet.show(
                                                {
                                                    options: Gender,
                                                    cancelButtonIndex: CANCEL_INDEX,
                                                    title: "Gender"
                                                },
                                                buttonIndex => {
                                                    buttonIndex != 3 ? this.setState({ gender: Gender[buttonIndex] }) : '';
                                                }
                                            )}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.numberInput}>{this.state.gender}</Text>
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

                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.headingText}>Password</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({
                                                password: name.trim()
                                            })}
                                            value={this.state.password}
                                            secureTextEntry={true}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>State Medical Council</Text>
                                    <View style={[styles.numberInputContainer, {}]}>
                                        <Picker
                                            // note
                                            mode="dropdown"
                                            placeholder="Select"
                                            iosIcon={<Icon name="ios-arrow-down"
                                                style={{ color: colors.sub_theme, fontSize: 25 }} />}
                                            iosHeader="Select"
                                            mode="dropdown"
                                            textStyle={[styles.stateCouncilTxt]}
                                            style={[{ width: "100%" }]}
                                            selectedValue={this.state.iMedicalCouncilId}
                                            // onValueChange={this.onValueChange.bind(this)}
                                            onValueChange={(itemValue, itemIndex) =>
                                                // console.log("val", itemValue)
                                                this.setState({
                                                    iMedicalCouncilId: itemValue
                                                })
                                            }>
                                            {
                                                // this.props.state_council.forEach(element => {
                                                //     <Picker.Item label={element.vCouncilName} value={element.iMedicalCouncilId} />
                                                // })
                                                this.props.state_council.map((value, idx) => {
                                                    console.log(value, idx)
                                                    return (
                                                        <Picker.Item label={value.vCouncilName} value={value.iMedicalCouncilId} />
                                                    )
                                                })
                                            }
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Registration No.</Text>
                                        <View style={styles.numberInputContainerRow}>
                                            <TextInput
                                                style={styles.numberInput}
                                                keyboardType="default"
                                                maxLength={32}
                                                ref={ref => (this.textInputRef = ref)}
                                                //   autoFocus={true}
                                                selectionColor={colors.THEME_YELLOW}
                                                onChangeText={name => this.setState({
                                                    vRegistrationNo:
                                                        name
                                                })}
                                                value={this.state.vRegistrationNo}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Year of Reg.</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                            <TouchableOpacity onPress={() => {
                                                Keyboard.dismiss()
                                                this.showPicker()
                                            }} >
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.numberInput}>{this.state.iRegistrationYear}</Text>
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
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Your Registration Certificate Photo  <Text style={{ fontWeight: 'bold', textDecorationLine: 'underline' }}>(Optional)</Text></Text>
                                        <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }}
                                                onPress={() => this.openCameraForImage("back_doc")}
                                            >
                                                <Icon
                                                    style={[{
                                                        paddingLeft: 5,
                                                        fontSize: 55, color: colors.sub_theme,
                                                        alignSelf: 'center'
                                                    }]}

                                                    name='ios-camera' />
                                                <Text style={[{
                                                    paddingLeft: 15,
                                                    fontSize: 15, color: colors.PLACEHOLDER_TEXT,
                                                    alignSelf: 'center',
                                                    fontFamily: 'OpenSans-Regular',
                                                }]}>Tap to open Camera</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5, alignItems: 'flex-end' }}>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15, alignItems: 'center', borderStyle: 'dashed', height: 100, width: 100, justifyContent: 'center' }]}>
                                            <Item style={{
                                                borderBottomWidth: 0,
                                            }} >
                                                <TouchableOpacity
                                                    onPress={() => this.openCameraForImage("back_doc")}
                                                >
                                                    {this.state.vRegistrationCert == '' && (
                                                        <Image
                                                            source={default_doc}
                                                            style={[{
                                                                resizeMode: 'contain',
                                                                height: 55, width: 55
                                                            }]}
                                                        />
                                                    )}
                                                    {this.state.vRegistrationCert != '' && (
                                                        <Image
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                width: 105,
                                                                height: 105,
                                                                borderRadius: 5
                                                            }]}

                                                            source={{
                                                                uri: this.state.vRegistrationCert,
                                                            }}

                                                        />

                                                    )}
                                                </TouchableOpacity>
                                            </Item>

                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                    <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Photo</Text>
                                        <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }}
                                                onPress={() => this.openCameraForImage("profile")}
                                            >
                                                <Icon
                                                    style={[{
                                                        paddingLeft: 5,
                                                        fontSize: 55, color: colors.sub_theme,
                                                        alignSelf: 'center'
                                                    }]}

                                                    name='ios-camera' />
                                                <Text style={[{
                                                    paddingLeft: 15,
                                                    fontSize: 15, color: colors.PLACEHOLDER_TEXT,
                                                    alignSelf: 'center',
                                                    fontFamily: 'OpenSans-Regular',
                                                }]}>Tap to open Camera</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5, alignItems: 'flex-end' }}>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15, alignItems: 'center', borderStyle: 'dashed', height: 100, width: 100, justifyContent: 'center' }]}>
                                            <Item style={{
                                                borderBottomWidth: 0,
                                            }} >
                                                <TouchableOpacity
                                                    onPress={() => this.openCameraForImage("profile")}
                                                >
                                                    {this.state.uri == '' && (
                                                        <Image
                                                            source={default_user}
                                                            style={[{
                                                                resizeMode: 'contain',
                                                                height: 55, width: 55
                                                            }]}
                                                        />
                                                    )}
                                                    {this.state.uri != '' && (
                                                        <Image
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                width: 105,
                                                                height: 105,
                                                                borderRadius: 5
                                                            }]}
                                                            source={{
                                                                uri: this.state.uri,
                                                            }}

                                                        />

                                                    )}
                                                </TouchableOpacity>
                                            </Item>

                                        </View>
                                    </View>
                                </View>


                                {/* <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>

                                    <CheckBox style={[styles.checkboxContainer, { marginRight: 20 }]} color={colors.sub_theme}
                                        checked={this.state.terms_accepted}
                                        onPress={() => this.setState({ terms_accepted: !this.state.terms_accepted })}
                                    />
                                    <Body style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={() => this.setState({ terms_accepted: !this.state.terms_accepted })}>
                                            <Text style={styles.checkboxText}>I accept and agree to </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }} onPress={() => this.navigator("terms")}><Text style={[styles.checkboxText, { textDecorationLine: 'underline' }]}>Terms & Conditions</Text></TouchableOpacity>
                                    </Body>
                                </View> */}
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>

                                    <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                                        checked={this.state.terms_accepted}
                                        onPress={() => this.setState({ terms_accepted: !this.state.terms_accepted })}
                                    />
                                    <Body style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row' }}
                                            onPress={() => this.navigator("privacy")}>
                                            <Body style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                                <TouchableOpacity onPress={() => this.setState({ terms_accepted: !this.state.terms_accepted })}>
                                                    <Text style={styles.checkboxText}>I accept and agree to </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{ flexDirection: 'row' }}
                                                    onPress={() => this.navigator("terms")}>
                                                    <Text style={[styles.checkboxText, { textDecorationLine: 'underline' }]}>
                                                        Terms & Conditions
                                                    </Text>
                                                </TouchableOpacity>
                                                <Text style={styles.checkboxText}> and </Text>
                                                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.navigator("privacy")}><Text style={[styles.checkboxText, { textDecorationLine: 'underline' }]}>Privacy Policy</Text></TouchableOpacity>
                                            </Body>
                                        </TouchableOpacity>
                                    </Body>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>
                                    <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                                        checked={this.state.is_acknowledged}
                                        onPress={() => this.setState({ is_acknowledged: !this.state.is_acknowledged })}
                                    />
                                    <Body>
                                        <TouchableOpacity onPress={() => this.setState({ is_acknowledged: !this.state.is_acknowledged })}>
                                            <Text style={styles.checkboxText}>I affirm that the information submitted by me is true to the best of my knowledge & take responsibility of its accuracy & authenticity</Text>
                                        </TouchableOpacity>
                                    </Body>
                                </View>

                                <View style={{ marginTop: 15, }}>
                                    <Button style={styles.nextButtonContainer}
                                        onPress={() => {
                                            this.navigator('next');
                                        }} >
                                        <Text style={styles.nextButton}>Create My Account</Text>
                                    </Button>
                                </View>

                                {/* </KeyboardAvoidingView> */}
                            </View>
                            {/* </ScrollView> */}


                        </KeyboardAwareScrollView>
                        <YearMonthPicker ref={picker => (this.picker = picker)} />
                    </View >
                )}

                {this.state.showCamera && (
                    <Camera
                        current_image_selection={this.state.current_image_selection}
                        getImageUri={this.navigator}
                        backButton={this.navigator}
                    ></Camera>
                )}
            </View>
        );
    }


    showPicker = () => {
        const { startYear, endYear, iRegistrationYear, selectedMonth } = this.state;
        console.log(selectedMonth);
        this.picker
            .show({ startYear, endYear, iRegistrationYear, selectedMonth })
            .then(({ year, month }) => {
                this.setState({
                    iRegistrationYear: year,
                    selectedMonth: month,
                });
            });
    };
}



function mapStateToProps(state) {
    return {
        user_data: state.user,
        state_council: state.state_council
    }
}
export default connect(mapStateToProps, { setUserData })(RmpRegister);

