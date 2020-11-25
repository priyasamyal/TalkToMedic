
import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
    Container,
    ActionSheet,
    Icon,
    Button,
    Body,
    Item,
    CheckBox,
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
import { colors, constant, data, } from '../../common/index';
import styles from './styles';
import Camera from '@components/Camera';
import { openUrl } from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';

var Gender = ["Male", "Female", "Others", "Cancel"];
var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const calendar = require('../../assets/imgs/calendar.png');
import { connect } from "react-redux";
import { setUserData } from "../../actions";
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class PatientRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            // gender: Gender.filter(m => m.startsWith("F")),
            gender: " ",
            dob: '',
            phoneNo: this.props.user_data.phone_number,
            password: '',
            terms_accepted: false,
            is_acknowledged: false,
            showCamera: false,
            uri: '',
            spinner: false,
            image_data: {}
        };
    }

    // Component Did Mount Handling
    componentDidMount() {
        // this.setState({
        //     first_name: this.props.user_data.userData.vFirstName,
        //     last_name: this.props.user_data.userData.vLastName,
        //     gender: this.props.user_data.userData.eGender,
        //     dob: this.props.user_data.userData.dDob != null ? moment(this.props.user_data.userData.dDob).format("DD-MM-YYYY") : "",
        //     uri: this.props.user_data.userData.vProfilePicture != "" ? data.profile_picture_url + this.props.user_data.userData.vProfilePicture : "",
        // })
    }

    checkValidations = () => {

        // console.log("image", {
        //     vProfilePicture_1: 'data:image/jpeg;base64,' + this.state.image_data.base64,
        //         // vProfilePicture_2: 'data:image/jpeg;base64,' + this.state.image_data,
        // });
        if (this.state.first_name == '' && this.state.last_name == ''
            && this.state.dob == '' && this.state.password == ''
            && Object.keys(this.state.image_data).length === 0) {
            showToast("All the fields required.");
            return;
        }
        if (this.state.first_name.trim() == '') {
            showToast(data.ToastMessages.first_name);
        }
        else if (this.state.last_name.trim() == '') {
            showToast(data.ToastMessages.last_name);
        }
        else if (this.state.gender.trim().length === 0) {
            showToast(data.ToastMessages.valid_gender);
        }
        else if (this.state.dob == '') {
            showToast(data.ToastMessages.dob);
        }
        else if (Math.floor(moment(new Date()).diff(moment(this.state.dob, "DD-MM-YYYY"), 'years', true)) < 18) {
            showToast(data.ToastMessages.age);
        }
        else if (this.state.password == '') {
            showToast(data.ToastMessages.password);
        }
        else if (this.state.password.trim().length <= 5) {
            showToast("Password lenght should be minimum six.");
        }
        // else if (Object.keys(this.state.image_data).length === 0) {
        //     showToast(data.ToastMessages.photo);
        // }
        else if (this.state.uri == "") {
            showToast(data.ToastMessages.photo);
        }
        else if (!this.state.terms_accepted) {
            showToast(data.ToastMessages.terms);
        }
        else if (!this.state.is_acknowledged) {
            showToast(data.ToastMessages.ack);
        }
        else {
            // setTimeout(() => {
            //     this.setState({
            //         spinner: !this.state.spinner
            //     });
            // }, 100);

            var param = {
                vMobileNo: this.props.user_data.userData.vMobileNo,
                iCountryCode: this.props.user_data.userData.iCountryCode,
                vFirstName: this.state.first_name,
                vLastName: this.state.last_name,
                // eGender: this.state.gender[0],
                eGender: this.state.gender,
                dDob: this.state.dob,
                vPassword: this.state.password,
                // vProfilePicture: 'data:image/jpeg;base64,' + this.state.image_data.base64,
                vProfilePicture: this.state.uri,
                iRoleId: this.props.user_data.userData.iRoleId,
                vDeviceToken: this.props.user_data.vDeviceToken,
                vPlatform: 'android'

            }
            // console.log("params", param)
            // this.props.setUserData(param);
            // this.registerUser(param);
            this.props.clickHandler("update_profile", param);
            return true;
        }
    }

    registerUser = (param) => {
        postApiRequest(data.api_endpoint.signup, param).then(
            data => {
                console.log(data, 'dataaa');
                this.props.setUserData(data.user);
                showToast("Register Successfully")
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
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
    navigator = (action, data) => {
        console.log(action, data, "dsd");
        switch (action) {
            case "next":
                this.checkValidations();
                break;

            case "camera_click":
                this.setState({ showCamera: false, uri: data.uri, image_data: data.full_object })
                break;
            case "back_camera":
                this.setState({ showCamera: false })
                break;
            case "back":
                this.props.clickHandler("backPage");
                // this.props.navigation.goBack();
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
        console.log(this.state, "all sttes")
    }
    //Function for setting input values to state
    setValues = (setoff, value) => {
        switch (setoff) {
            case 'dob': {
                this.setState({ dob: value });
                break;
            }
        }
    };
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.props.spinner}
                    textContent={''}
                />
                {!this.state.showCamera && (
                    <View>
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled">
                            <HeaderComponent
                                show_headingCenter={true}
                                show_back={true}
                                clickHandler={this.navigator}
                                // title={constant.page_titles.PATIENT_REGISTER}
                                title="Patient Details"
                            >
                            </HeaderComponent>
                            <View style={styles.mainContainer}>
                                <Text style={styles.headingText}>Update your details for book appointment</Text>
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
                                                first_name: name
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
                                                last_name: name
                                            })}
                                            value={this.state.last_name}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Gender</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
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
                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>DOB</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                            <Item style={{
                                                borderBottomWidth: 0,
                                            }} >
                                                <DatePicker
                                                    androidMode="spinner"
                                                    allowFontScaling={true}
                                                    style={{ width: '100%' }}
                                                    showIcon={true}
                                                    iconSource={calendar}
                                                    date={this.state.dob}
                                                    mode="date"
                                                    placeholder="DD-MM-YYYY"
                                                    format="DD-MM-YYYY"
                                                    minDate="01-01-1940"
                                                    maxDate={new Date()}
                                                    confirmBtnText="Select"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                        placeholderText: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            fontSize: 14,
                                                            color: colors.sub_theme,
                                                            padding: 5,
                                                            paddingBottom: 9,
                                                        },
                                                        dateText: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            alignItems: 'flex-start',
                                                            borderWidth: 0,
                                                            fontSize: 18,
                                                        },
                                                        dateInput: {
                                                            fontFamily: 'OpenSans-Regular',
                                                            alignItems: 'flex-start',
                                                            borderWidth: 0,
                                                            fontSize: 18,
                                                            // marginLeft: 36
                                                        },
                                                        btnTextConfirm: {
                                                            color: colors.THEME_YELLOW,
                                                            fontSize: 18,
                                                            fontFamily: 'OpenSans-Bold',
                                                        },
                                                        btnTextCancel: {
                                                            color: colors.jet_black,
                                                            fontSize: 18,
                                                            fontFamily: 'OpenSans-Regular',
                                                        },
                                                        disabled: {
                                                            backgroundColor: colors.card_border,
                                                            borderRadius: 4,
                                                            //  paddingLeft: 5
                                                        }
                                                        // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={date => {
                                                        this.setValues('dob', date);
                                                    }}
                                                />
                                            </Item>

                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Create Password</Text>
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
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                    <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Photo </Text>
                                        <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }}
                                                onPress={() => this.openCamera()}
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
                                                    onPress={() => this.openCamera()}
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
                                                            //  source={this.state.uri}
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
                                        <Text style={styles.nextButton}>Proceed to Payment</Text>
                                    </Button>
                                </View>
                            </View>
                        </KeyboardAwareScrollView>
                    </View >
                )}

                {this.state.showCamera && (
                    <Camera
                        current_image_selection="profile"
                        getImageUri={this.navigator}
                        backButton={this.navigator}
                    ></Camera>
                )}
            </View>
        );
    }
}



function mapStateToProps(state) {
    return {
        user_data: state.user
    }
}
export default connect(mapStateToProps, { setUserData })(PatientRegister);

