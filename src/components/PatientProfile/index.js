//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import {
    Container,
    ActionSheet,
    Icon,
    Button,

    Item,
} from 'native-base';
import StateListing from '@components/StateListing';
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import { connect } from "react-redux";
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
// create a component
// var Gender = ["Male", "Female", "Other", "Cancel"];
var Gender = ["Male", "Female", "Other"];
// var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const calendar = require('../../assets/imgs/calendar.png');
import moment from 'moment';
import Camera from '@components/Camera';
import { setCity, setUserData } from "../../actions"
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class PatientProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vFirstName: this.props.user_data.vFirstName,
            vLastName: this.props.user_data.vLastName,
            eGender: this.props.user_data.eGender,
            // eGender: constant.GENDER.filter(m => m.startsWith(this.props.user_data.eGender)),
            //     dDob: moment(this.props.user_data.dDob).format("DD-MM-YYYY"),
            dDob: this.props.user_data.dDob != null ? moment(this.props.user_data.dDob).format("DD-MM-YYYY") : "",
            selectedState: this.props.user_data.iStateId == null ? [{}] : this.props.states.filter(m => m.iStateid == this.props.user_data.iStateId),
            selectedCity: this.props.user_data.iCityId == null ? [{}] : [{}],

            eIdentificationType: this.props.user_data.eIdentificationType,
            image_data: data.profile_picture_url + this.props.user_data.vProfilePicture,
            front_image_data: this.props.user_data.vIdentificationDocumentFront == null ? "" : data.document_url + this.props.user_data.vIdentificationDocumentFront,
            back_image_data: this.props.user_data.vIdentificationDocumentBack == null ? "" : data.document_url + this.props.user_data.vIdentificationDocumentBack,
            current_image_selection: '',
            tAddress: this.props.user_data.tAddress == null ? "" : this.props.user_data.tAddress,
            vZipCode: this.props.user_data.vZipCode == null ? "" : this.props.user_data.vZipCode,

            showCamera: false,
            dropDownTitle: "Select State",
            modalVisible: false,

        };

        this.modalRef = React.createRef();
    }

    navigator = (action, data) => {
        console.log(action, "action....", this.state);
        switch (action) {
            case "next":
                this.checkValidations();
                //this.props.navigation.navigate('Login');
                break;
            case "back":
                this.props.navigation.goBack();
                // this.props.clickHandler('back');
                break;
            case "back_camera":
                this.setState({ showCamera: false })
                break;

            case "camera_click":
                if (this.state.current_image_selection == "front_doc") {
                    this.setState({ showCamera: false, front_image_data: data.uri })
                } else if (this.state.current_image_selection == "profile") {
                    this.setState({ showCamera: false, image_data: data.uri })
                }
                else if (this.state.current_image_selection == "back_doc") {
                    this.setState({ showCamera: false, back_image_data: data.uri })
                }

                break;

            default:
                break;
        }
    }

    checkValidations = () => {
        let numberRegex = /^[0-9]+$/;
        let stringRegex = /^[a-zA-Z ]*$/;
        console.log(this.states);
        if (this.state.vFirstName == '') {
            showToast(data.ToastMessages.first_name);
        }
        else if (!this.state.vFirstName.match(stringRegex)) {
            showToast(data.ToastMessages.valid_firstname);
        }
        else if (this.state.vLastName == '') {
            showToast(data.ToastMessages.last_name);
        }
        else if (!this.state.vLastName.match(stringRegex)) {
            showToast(data.ToastMessages.valid_lastname);
        }
        else if (Math.floor(moment(new Date()).diff(moment(this.state.dDob, "DD-MM-YYYY"), 'years', true)) < 18) {
            showToast(data.ToastMessages.age);
        }
        else if (Object.keys(this.state.selectedState).length === 0) {
            showToast(data.ToastMessages.state);
        }
        else if (Object.keys(this.state.selectedCity).length === 0) {
            showToast(data.ToastMessages.city);
        }
        else if (this.state.tAddress == '') {
            showToast(data.ToastMessages.address);
        }
        else if (this.state.vZipCode == '') {
            showToast(data.ToastMessages.zip);
        }
        else if (!this.state.vZipCode.match(numberRegex)) {
            showToast(data.ToastMessages.valid_zip);
        }
        else if (this.state.eIdentificationType == null) {
            showToast(data.ToastMessages.doc_type);
        }
        else if (this.state.front_image_data === '') {
            showToast(data.ToastMessages.doc_front);
        }
        else if (this.state.back_image_data === '') {
            showToast(data.ToastMessages.doc_back);
        }

        else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);
            var param = {
                vFirstName: this.state.vFirstName,
                vLastName: this.state.vLastName,
                eGender: this.state.eGender,
                dDob: this.state.dDob,
                iStateId: this.state.selectedState[0].iStateid,
                iCityId: this.state.selectedCity[0].iCityId,
                tAddress: this.state.tAddress,
                vZipCode: this.state.vZipCode,
                eIdentificationType: this.state.eIdentificationType,
                vIdentificationDocumentBack: this.state.back_image_data,
                vIdentificationDocumentFront: this.state.front_image_data,
                vProfilePicture: this.state.image_data,
                vDeviceToken: this.props.user_data.vDeviceToken,
                fLatitude: 30.7046,
                fLongitude: 76.7179,
            }
            console.log("params-edit", param);
            this.editProfileAPI(param);
        }
    }

    editProfileAPI = (param) => {
        postApiRequestWithHeaders(data.api_endpoint.update_profile, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.props.setUserData(data.user);
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast("Profile Updated Successfully.");
                setTimeout(() => {
                    this.props.navigation.goBack();
                }, 100);
                // this.props.clickHandler('back');
            },
            error => {

                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    openCameraForImage = (status) => {
        this.setState({ current_image_selection: status }, () => {
            setTimeout(() => {
                this.setState({ showCamera: true })
            }, 500);

        })
    }


    //Function for setting input values to state
    setValues = (setoff, value) => {
        switch (setoff) {
            case 'dob': {
                this.setState({ dDob: value });
                break;
            }

        }
    };

    componentDidMount() {
        console.log(this.state, "state.....");
        if (this.props.user_data.iStateId != null) {
            var param = {
                iStateId: this.props.user_data.iStateId
            }
            postApiRequest(data.api_endpoint.getCities, param).then(
                data => {
                    console.log(data, 'dataaa of city');
                    this.props.setCity(data.cities);
                    data.cities.filter(m => m.iCityId == this.props.user_data.iCityId);
                    this.setState({
                        selectedCity: data.cities.filter(m => m.iCityId == this.props.user_data.iCityId)
                    })

                },
                error => {

                },
            );
        }

    }
    openOrCloseModal = (status) => {
        console.log('as', this.child, this.state);
        switch (status) {
            case "states":
                this.setState({ dropDownTitle: "Select State" }, () => {
                    this.child.setModalVisibility(true, this.state.selectedState[0], status)
                })
                break;
            case "city":
                this.setState({ dropDownTitle: "Select City" }, () => {
                    this.child.setModalVisibility(true, this.state.selectedCity[0], status)
                })
                break;
            default:
                break;
        }
    };

    getCitiesList = (selectedState) => {
        console.log(selectedState, "id....")
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        var param = {
            iStateId: selectedState.iStateid
        }
        postApiRequest(data.api_endpoint.getCities, param).then(
            data => {
                console.log(data, 'dataaa');
                this.props.setCity(data.cities)
                setTimeout(() => {
                    this.setState({
                        spinner: !this.state.spinner
                    });
                }, 100);
            },
            error => {
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'error111');
                showToast(error);
            },
        );
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {!this.state.showCamera && (
                    <View>
                        <KeyboardAwareScrollView
                            showsVerticalScrollIndicator={false}
                            //  style={styles.mainContent}
                            //  contentContainerStyle={styles.mainContent}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled">
                            <Spinner
                                color={colors.sub_theme}
                                visible={this.state.spinner}
                                textContent={''}
                            />
                            <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.PATIENT_PROFILE}></HeaderComponent>

                            <View style={styles.mainContainer}>
                                {/* <KeyboardAvoidingView
                                    style={styles.mainContent}
                                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}> */}
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Mobile Number</Text>
                                    <View style={[styles.numberInputContainer, { backgroundColor: colors.BORDER_COLOR }]}>
                                        <TextInput
                                            editable={false}
                                            selectTextOnFocus={false}
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            // autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            // onChangeText={name => this.disableButton(name)}
                                            value={this.props.user_data.vMobileNo}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>First Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput

                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            //  autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            // onChangeText={name => this.disableButton(name)}
                                            value={this.state.vFirstName}
                                            onChangeText={name => this.setState({ vFirstName: name })}

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
                                            // onChangeText={name => this.disableButton(name)}
                                            value={this.state.vLastName}
                                            onChangeText={name => this.setState({ vLastName: name })}
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
                                                        // cancelButtonIndex: CANCEL_INDEX,
                                                        title: "Gender"
                                                    },
                                                    buttonIndex => {
                                                        console.log(buttonIndex)
                                                        buttonIndex >= 0 ?
                                                            this.setState({ eGender: Gender[buttonIndex] }) : null;
                                                    }
                                                )}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                    <Text style={[styles.numberInput, { paddingLeft: 0, fontSize: 17 }]}>
                                                        {this.state.eGender ? this.state.eGender : "Select Gender"}
                                                    </Text>
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
                                                    date={this.state.dDob}
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
                                                            color: colors.PLACEHOLDER_TEXT,
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
                                    <Text style={styles.headingText}>Address</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            //   autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ tAddress: name.trimStart() })}
                                            value={this.state.tAddress}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>State/UT</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                            <TouchableOpacity onPress={() => {
                                                this.openOrCloseModal("states");
                                            }
                                            }>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.numberInput}>{this.state.selectedState[0].vStateName}{" "}</Text>
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

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>City</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                            <TouchableOpacity onPress={() => {
                                                this.openOrCloseModal("city");
                                            }
                                            }>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={styles.numberInput}>{this.state.selectedCity[0].vCityName}{" "}</Text>
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
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>PIN Code</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            keyboardType="number-pad"
                                            ref={ref => (this.textInputRef = ref)}
                                            //   autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vZipCode: name.trimStart() })}
                                            value={this.state.vZipCode}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Choose Document</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                            <TouchableOpacity onPress={() =>
                                                ActionSheet.show(
                                                    {
                                                        options: constant.DOCUMENT,
                                                        // cancelButtonIndex: 3,
                                                        title: "Documents"
                                                    },
                                                    buttonIndex => {
                                                        console.log("b", buttonIndex)
                                                        buttonIndex >= 0 &&
                                                            this.setState({ eIdentificationType: constant.DOCUMENT[buttonIndex] });
                                                    }
                                                )}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                    <Text style={[styles.numberInput, { paddingLeft: 0 }]}> {this.state.eIdentificationType}</Text>
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
                                        <Text style={styles.headingText}>Upload Front of Document {this.state.showCamera} </Text>
                                        <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.openCameraForImage("front_doc")}>
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
                                                    onPress={() => this.openCameraForImage("front_doc")}
                                                >
                                                    {this.state.front_image_data == '' && (
                                                        <Image
                                                            source={default_user}
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                height: 55, width: 55
                                                            }]}
                                                        />
                                                    )}
                                                    {this.state.front_image_data != '' && (
                                                        <Image
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                width: 105,
                                                                height: 105,
                                                                borderRadius: 5,
                                                                backgroundColor: colors.PLACEHOLDER_TEXT
                                                            }]}
                                                            source={{
                                                                uri: this.state.front_image_data,
                                                            }}
                                                        //  source={this.state.front_image_data}

                                                        />

                                                    )}
                                                </TouchableOpacity>
                                            </Item>

                                        </View>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                    <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Upload Back of Document </Text>
                                        <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.openCameraForImage("back_doc")}>
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
                                                    {this.state.back_image_data == '' && (
                                                        <Image
                                                            source={default_user}
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                height: 55, width: 55
                                                            }]}
                                                        />
                                                    )}
                                                    {this.state.back_image_data != '' && (
                                                        <Image
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                width: 105,
                                                                height: 105,
                                                                borderRadius: 5,
                                                                backgroundColor: colors.PLACEHOLDER_TEXT
                                                            }]}
                                                            source={{
                                                                uri: this.state.back_image_data,
                                                            }}
                                                        //  source={this.state.back_image_data}

                                                        />

                                                    )}
                                                </TouchableOpacity>
                                            </Item>

                                        </View>
                                    </View>

                                </View>
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                    <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Photo </Text>
                                        <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.openCameraForImage("profile")}>
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
                                                    {this.state.image_data == '' && (
                                                        <Image
                                                            source={default_user}
                                                            style={[{
                                                                resizeMode: 'contain',
                                                                height: 55, width: 55
                                                            }]}
                                                        />
                                                    )}
                                                    {this.state.image_data != '' && (
                                                        <Image
                                                            style={[{
                                                                resizeMode: 'cover',
                                                                width: 105,
                                                                height: 105,
                                                                borderRadius: 5,
                                                                backgroundColor: colors.PLACEHOLDER_TEXT
                                                            }]}
                                                            source={{
                                                                uri: this.state.image_data,
                                                            }}
                                                        //   source={this.state.image_data}

                                                        />

                                                    )}
                                                </TouchableOpacity>
                                            </Item>

                                        </View>
                                    </View>
                                </View>



                                <View style={{ marginTop: 15, }}>
                                    <Button style={styles.nextButtonContainer}
                                        onPress={() => {
                                            this.navigator('next');
                                        }} >
                                        <Text style={styles.nextButton}>Update</Text>
                                    </Button>
                                </View>

                                {/* </KeyboardAvoidingView> */}
                            </View>


                            <StateListing
                                childRef={ref => (this.child = ref)}
                                modalVisible={this.state.modalVisible}
                                closeModal={selectedState => {
                                    if (selectedState) {
                                        switch (this.state.dropDownTitle) {
                                            case "Select State":
                                                this.setState({ selectedState: [selectedState] });
                                                this.getCitiesList(selectedState);
                                                this.setState({
                                                    selectedCity: [{}]
                                                })
                                                console.log(this.state, "staes...")
                                                break;

                                            case "Select City":
                                                this.setState({ selectedCity: [selectedState] });
                                                console.log(this.state, "staes...")
                                                break;

                                            default:
                                                break;
                                        }
                                        //  this.setState({ selectedCountry: selectedCountry });
                                    }

                                    console.log(selectedState);
                                }}
                                navigation={this.props.navigation}
                                titleText={this.state.dropDownTitle}
                            ></StateListing>
                        </KeyboardAwareScrollView>
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
}



function mapStateToProps(state) {
    //console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData,
        states: state.states,
        city: state.city
    }
}
export default connect(mapStateToProps, { setCity, setUserData })(PatientProfile);
