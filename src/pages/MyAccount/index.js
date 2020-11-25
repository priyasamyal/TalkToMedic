//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView, FlatList, } from 'react-native';
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
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
import HeaderComponent from '@components/HeaderComponent';
import styles from './styles';
import { colors, constant, data } from '../../common/index';
import { connect } from "react-redux";
const default_user = require('../../assets/imgs/default_user.png');
import CommonPopUp from '@components/CommonPopUp';
import { openUrl, clearLocalStorage, getApiRequest, postApiRequestWithHeaders, showToast, networkCheck } from '../../common/user';
import { removeUser, setLocation, setComplete, setStateList, setTreatment, setStateCouncil, setSpeciality, setRelation, setAppVersion } from "../../actions";
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import RNCallKeep from 'react-native-callkeep';
// create a component
class MyAccount extends Component {
    constructor(props) {
        super(props);
       // console.log(props, "My Account...")
        this.state = {
            showLogoutPopUp: false,
            showUpdatePopup: false,
            showNetworkPopup: false
        };
    }
    componentDidMount() {

        networkCheck().then(data => {
            if (!data) {
                this.setState({
                    showNetworkPopup: true,
                })
            } else {
                this.setState({
                    showNetworkPopup: false,
                    fieldFocus: true
                })
            }
        });
     //   console.log(this.props.app_version, "state.....!");

        Geolocation.getCurrentPosition(info => {
           // console.log(info, "current");
            this.props.setLocation({ lat: String(info.coords.latitude), lng: String(info.coords.longitude) });
        }, error => {
           // console.log("location error", error);
            this.props.setLocation({ lat: "30.7162", lng: "76.7776" })
            if (error.PERMISSION_DENIED == 1) {
                console.log("denianle")
            }

        });

        check(PERMISSIONS.ANDROID.CAMERA)
            .then((result) => {
                switch (result) {
                    case RESULTS.DENIED:
                        request(PERMISSIONS.ANDROID.CAMERA);
                        break;
                    case RESULTS.GRANTED:
                        RNCallKeep.setup({
                            ios: {
                                appName: "TalkToMedic",
                                imageName: 'calling'
                            },
                            android: {
                                alertTitle: 'Permissions required',
                                alertDescription: 'This application needs to access your phone accounts',
                                cancelButton: 'Cancel',
                                okButton: 'ok',
                            },
                        });
                        break;
                    case RESULTS.BLOCKED:
                        request(PERMISSIONS.ANDROID.CAMERA);
                        break;
                }
            });

        setTimeout(() => {
          //  console.log("datalength", this.props.app_version.length);
            if (this.props.app_version.length > 0) {
                const isPopup = data.current_version >= this.props.app_version ? false : true;
                this.setState({ showUpdatePopup: isPopup });
            }
        }, 1000)

        if (this.props.route != undefined) {
            if (this.props.route.params != undefined) {
                if (this.props.route.params.type == 'my_appt') {
                    this.props.navigation.navigate('CommonPage', { type: 'appointments' });
                }
                else if (this.props.route.params.type == 'consult') {
                    this.props.navigation.navigate('CommonPage', { type: 'consult_doctor' });
                }
                else if (this.props.route.params.type == 'practice_detail') {
                    showToast("You must fill in your practice details.")
                    this.props.navigation.navigate('CommonPage', { type: 'practice_detail' });
                }
                else if (this.props.route.params.type == 'ViewPatientReports') {
                    this.props.navigation.navigate('ViewPatientReports');
                }
            }
        }
        if (this.props.user_data.iRoleId != constant.ROLE_PATIENT) {
            this.checkCompletess();
        }

    }
    checkCompletess = (token) => {
        postApiRequestWithHeaders(data.api_endpoint.user_complete, {}, this.props.user_data.vAccessToken).then(
            data => {
               // console.log(data, "checkCompletess");
                this.props.setComplete(data.profile_status);
            },
            error => {
               // console.log(error, 'errorrrrrr');
            },
        );
    }


    navigator = (item, index) => {
       // console.log(item.item_name)
        switch (item.item_name) {
            case "Book Appointment":
               // console.log(item, index);
                this.props.navigation.push('CommonPage', { type: 'consult_doctor' });
                //this.props.navigation.push('CommonPage', { type: 'rmp_conclusion' });
                break;
            case "Appointments":
             //   console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'appointments' });
                break;
            case "My Appointments":
               // console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'appointments' });
                break;
            case "Medical History/ Prescriptions":
                //  this.props.navigation.navigate('CommonPage', { type: 'medical_history' });
                this.props.navigation.navigate('CommonPage', { rmp_prescription_data: { from: "account" }, type: 'medical_history' });
                break
            case "Payment Receipts":
                this.props.navigation.navigate('CommonPage', { type: 'payment_receipts' });
                break
            case "My Earnings":
                this.props.navigation.navigate('CommonPage', { type: 'consultation_fee' });
                break
            case "Edit Profile":
                this.props.user_data.iRoleId == constant.ROLE_PATIENT ? this.props.navigation.navigate('CommonPage', { type: 'edit_profile' }) : this.props.navigation.navigate('CommonPage', { type: 'edit_profile_rmp' })
                break;
            case "Audio/Video Settings":
             //   console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'audio_setting' });
                break;
            case "Change Password":
              //  console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'change_password' });
                break;
            case "Family Member":
              //  console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'family_member' });
                break;
            case "Practice Details":
             //   console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'practice_detail' });
                break;
            case "Manage Bank Details":
              //  console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'withdraw' });
                break;
            case "Manage Availability":
               // console.log(item, index);
                this.props.navigation.navigate('CommonPage', { type: 'manage_avail' });
                break;
            case "Lab Test/ Reports":
              //  console.log(item, index);
                this.props.navigation.navigate('ViewPatientReports');
                break;
            case "Logout":
                this.onLogoutClick();
                break;
            default:
                break;
        }
    }

    /**LogOut Click */

    onLogoutClick = () => {
      //  console.log("clicking..")
        this.setState({ showLogoutPopUp: !this.state.showLogoutPopUp })

    }

    getCommonDetails = () => {
        getApiRequest(data.api_endpoint.get_countries).then(
            data => {
             //   console.log(data, "getCommonDetailsall data....")
                this.props.setStateList(data.states);
                this.props.setTreatment(data.treatments);
                this.props.setStateCouncil(data.medical_councils);
                this.props.setSpeciality(data.specialties);
                this.props.setRelation(data.famility_relations);
                this.props.setAppVersion(data.app_version);
            },
            error => {
              //  console.log(error, 'errorrrrrr');
            },
        );
    };

    popUpClick = (status) => {
      //  console.log(status);
        if (status == "SplashScreen") {
            networkCheck().then(data => {
                if (!data) {
                    this.setState({
                        showNetworkPopup: true,
                    })
                } else {
                    this.setState({
                        showNetworkPopup: false,
                    });
                    this.getCommonDetails();
                }
            });
            return;
        }

        this.setState({ showLogoutPopUp: !this.state.showLogoutPopUp })
        switch (status) {

            case "logout":
                clearLocalStorage('user_details').then(data => {
                    this.props.removeUser();
                    console.log(data, "remove key")
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'EnterPhoneNumber' }],
                    });

                });
                break;
            default:
                break;
        }

    }

    render() {
        return (
            <Container>
                {this.state.showNetworkPopup && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title="Internet Connectivity" msg="You don't have any internet connection."></CommonPopUp>
                    </View>
                )}

                {this.state.showLogoutPopUp && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title="Logout" msg="Are you sure you want to logout?"></CommonPopUp>
                    </View>
                )}
                {this.state.showUpdatePopup && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp title="Update Required" msg="You are using an older version of the app. Please, update it to the latest version."></CommonPopUp>
                    </View>
                )}
                <HeaderComponent clickHandler={this.navigator} show_headingCenter={true} show_back={false} title={constant.page_titles.ACCOUNT}></HeaderComponent>

                <View style={[styles.mainContainer]}>
                    <FlatList
                        data={this.props.user_data.iRoleId == "1" ? data.patient_account_items : data.rmp_account_items}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => (
                            <View>
                                {index == 0 && (
                                    <View style={{ alignItems: 'center' }}>
                                        <Image
                                            source={{
                                                uri: data.profile_picture_url + this.props.user_data.vProfilePicture,
                                            }}
                                            style={[styles.profileContainer]}
                                        />
                                        <Text style={[styles.userName]}>{this.props.user_data.vFirstName} {this.props.user_data.vLastName}</Text>
                                    </View>
                                )}
                                <TouchableOpacity
                                    onPress={() => {
                                        this.navigator(item, index);
                                    }}
                                >
                                    <View style={{
                                        flexDirection: 'row',
                                        borderBottomWidth: item.show_separator ? 1 : 0, borderColor: colors.GREY_TEXT, paddingBottom: item.show_separator ? 10 : 0,
                                        marginBottom: index == data.patient_account_items.length - 1 ? 20 : 0
                                    }}>
                                        <Icon
                                            style={[styles.itemIcon]}
                                            name={item.icon} />
                                        <Text style={styles.itemText}>{item.item_name}</Text>
                                        {item.item_name == "Manage Availability" && !this.props.completeness.bAvailability && (
                                            <Text style={[styles.itemText, { color: colors.danger, fontSize: 12, textDecorationLine: 'underline', marginLeft: 5 }]}>(Incomplete)</Text>
                                        )}
                                        {item.item_name == "Practice Details" && !this.props.completeness.bPracticeDetails && (
                                            <Text style={[styles.itemText, { color: colors.danger, fontSize: 12, textDecorationLine: 'underline', marginLeft: 5 }]}>(Incomplete)</Text>
                                        )}
                                        {item.item_name == "Manage Bank Details" && !this.props.completeness.bAccountDetails && (
                                            <Text style={[styles.itemText, { color: colors.danger, fontSize: 12, textDecorationLine: 'underline', marginLeft: 5 }]}>(Incomplete)</Text>
                                        )}
                                        {item.item_name == "Edit Profile" && !this.props.completeness.bProfileDetails && (
                                            <Text style={[styles.itemText, { color: colors.danger, fontSize: 12, textDecorationLine: 'underline', marginLeft: 5 }]}>(Incomplete)</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                        )}
                        keyExtractor={item => item.id}
                    />
                </View>

            </Container>
        );
    }
}




function mapStateToProps(state) {
    //console.log(state, "sMyAccounttate...")
    return {
        app_version: state.user.app_version,
        user_data: state.user.userData,
        completeness: state.compleFields
    }
}
export default connect(mapStateToProps, { removeUser, setLocation, setComplete, setStateList, setTreatment, setStateCouncil, setSpeciality, setRelation, setAppVersion })(MyAccount);

