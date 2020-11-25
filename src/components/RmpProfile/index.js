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
    ListItem, Picker
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// create a component
var Gender = ["Male", "Female", "Other"];
// var Gender = ["Male", "Female", "Other", "Cancel"];
// var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const calendar = require('../../assets/imgs/calendar.png');
import moment from 'moment';
import Camera from '@components/Camera';
import { setCity, setUserData } from "../../actions"
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from 'react-native-multiple-select';
const items = [{
    id: '92iijs7yta',
    name: 'Ondo'
}, {
    id: 'a0s0a8ssbsd',
    name: 'Ogun'
}, {
    id: '16hbajsabsd',
    name: 'Calabar'
}, {
    id: 'nahs75a5sg',
    name: 'Lagos'
}, {
    id: '667atsas',
    name: 'Maiduguri'
}, {
    id: 'hsyasajs',
    name: 'Anambra'
}, {
    id: 'djsjudksjd',
    name: 'Benue'
}, {
    id: 'sdhyaysdj',
    name: 'Kaduna'
}, {
    id: 'suudydjsjd',
    name: 'Abuja'
}
];
console.log(moment('2019-09-01', 'YYYY-MM-DD').isValid(), "is valid........");
class RmpProfile extends Component {
    constructor(props) {
        super(props);
        // console.log("date", this.props.user_data.dDob)
        this.state = {
            vFirstName: this.props.user_data.vFirstName,
            vLastName: this.props.user_data.vLastName,
            eGender: this.props.user_data.eGender,
            // eGender: constant.GENDER.filter(m => m.startsWith(this.props.user_data.eGender)),
            //     dDob: moment(this.props.user_data.dDob).format("DD-MM-YYYY"),
            //: moment(this.props.user_data.dDob).format("DD-MM-YYYY"),

            dDob: moment(this.props.user_data.dDob, 'YYYY-MM-DD').isValid() ? moment(this.props.user_data.dDob).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY"),
            selectedState: this.props.user_data.iStateId == null ? [{}] : this.props.states.filter(m => m.iStateid == this.props.user_data.iStateId),
            selectedCity: this.props.user_data.iCityId == null ? [{}] : [{}],


            image_data: data.profile_picture_url + this.props.user_data.vProfilePicture,


            current_image_selection: '',
            tAddress: this.props.user_data.tAddress == null ? "" : this.props.user_data.tAddress,
            vZipCode: this.props.user_data.vZipCode == null ? "" : this.props.user_data.vZipCode,

            showCamera: false,
            dropDownTitle: "Select State",
            modalVisible: false,

            vQualification: '',
            iSpecialityId: '',
            selectedItems: [],

            modalVisible: false,
        };

        this.modalRef = React.createRef();
    }

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
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    navigator = (action, data) => {
        console.log(action, "action....", this.state);
        switch (action) {
            case "next":
                this.checkValidations();
                //this.props.navigation.navigate('Login');
                break;
            case "back":
                this.props.clickHandler('back');
                break;
            case "back_camera":
                this.setState({ showCamera: false })
                break;

            case "camera_click":
                if (this.state.current_image_selection == "profile") {
                    this.setState({ showCamera: false, image_data: data.uri })
                }


                break;

            default:
                break;
        }
    }

    checkValidations = () => {
        console.log(this.states);
        let numberRegex = /^[0-9]+$/;
        if (this.state.vFirstName == '') {
            showToast(data.ToastMessages.first_name);
        }
        else if (this.state.vLastName == '') {
            showToast(data.ToastMessages.last_name);
        }
        else if (Math.floor(moment(new Date()).diff(moment(this.state.dDob, "DD-MM-YYYY"), 'years', true)) < 18) {
            showToast(data.ToastMessages.age);
        }
        else if (Object.keys(this.state.selectedState).length === 0) {
            showToast(data.ToastMessages.state);
        }

        else if (this.state.selectedCity[0].iCityId === undefined) {
            showToast(data.ToastMessages.city);
            return false;
        }

        else if (this.state.tAddress == '') {
            showToast(data.ToastMessages.address);
        }
        else if (this.state.vZipCode == '') {
            showToast(data.ToastMessages.zip);
        } else if (!this.state.vZipCode.match(numberRegex)) {
            showToast(data.ToastMessages.valid_zip);
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
                vProfilePicture: this.state.image_data,
                vDeviceToken: this.props.user_data.vDeviceToken,
                fLatitude: 30.7046,
                fLongitude: 76.7179,


            }
            console.log(param);
            this.editProfileAPI(param);
        }
    }

    editProfileAPI = (param) => {
        postApiRequestWithHeaders(data.api_endpoint.rmp_update_profile, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.props.setUserData(data.user);
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast("Profile Updated Successfully.");
                this.props.clickHandler('back');
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
                            <HeaderComponent show_headingCenter={true} show_menu={true} navigation={this.props.navigation} clickHandler={this.navigator} title={constant.page_titles.PATIENT_PROFILE}></HeaderComponent>


                            <View style={styles.mainContainer}>
                                <KeyboardAvoidingView
                                    style={styles.mainContent}
                                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
                                    <View style={{ marginTop: 15 }}>
                                        <Text style={styles.headingText}>Mobile Number</Text>
                                        <View style={styles.numberInputContainer}>
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
                                                        // buttonIndex => { console.log(buttonIndex)
                                                        //     buttonIndex ?
                                                        //         this.setState({ eGender: Gender[buttonIndex] }) : null;
                                                        // }
                                                        buttonIndex => { this.setState({ eGender: Gender[buttonIndex] });}
                                                    )}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                                        <Text style={[styles.numberInput, { paddingLeft: 0 }]}>
                                                            {/* {this.state.eGender} */}
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
                                                onChangeText={name => this.setState({ tAddress: name })}
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
                                                keyboardType="number-pad"
                                                maxLength={10}
                                                ref={ref => (this.textInputRef = ref)}
                                                //   autoFocus={true}
                                                selectionColor={colors.THEME_YELLOW}
                                                onChangeText={name => this.setState({ vZipCode: name })}
                                                value={this.state.vZipCode}
                                            >
                                            </TextInput>
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                            <Text style={styles.headingText}>Photo </Text>
                                            <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                                <TouchableOpacity onPress={() => this.openCameraForImage("profile")}>
                                                    <Icon
                                                        style={[{
                                                            paddingLeft: 5,
                                                            fontSize: 55, color: colors.sub_theme,
                                                            alignSelf: 'center'
                                                        }]}
                                                        name='ios-camera' />
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

                                    {/* 
                          

                                  */}






                                    <View style={{ marginTop: 15, }}>
                                        <Button style={styles.nextButtonContainer}
                                            onPress={() => {
                                                this.navigator('next');
                                            }} >
                                            <Text style={styles.nextButton}>Update</Text>
                                        </Button>
                                    </View>

                                </KeyboardAvoidingView>
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
    // console.log(state, "Verify Number state...");
    // console.log(moment('2019-09-01', 'YYYY-MM-DD').isValid(), "is valid........");
    return {
        user_data: state.user.userData,
        states: state.states,
        city: state.city
    }
}
export default connect(mapStateToProps, { setCity, setUserData })(RmpProfile);
