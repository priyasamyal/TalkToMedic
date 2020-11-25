import React, { Component, useEffect } from 'react';
import styles from './styles';
import {
    View,
    TouchableOpacity,
    Platform,
    Text,
    TextInput,
    ScrollView,
    FlatList,

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

import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
import { colors, constant, data } from '../../common/index';
import HeaderComponent from '@components/HeaderComponent';
import { connect } from "react-redux";
import { setProblems } from "../../actions"
import { setOtp } from "../../actions"
import { KeyboardAvoidingView, Keyboard } from 'react-native';
import commonData from '../../common/data.js';
import { SafeAreaView } from 'react-native-safe-area-context';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import MultiSelect from 'react-native-multiple-select';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
    clearLocalStorage,
    networkCheck,
    getApiRequest
} from '../../common/user';
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions';
import CommonPopUp from '@components/CommonPopUp';
import { removeUser, setLocation, setComplete, setStateList, setTreatment, setStateCouncil, setSpeciality, setRelation, setAppVersion } from "../../actions";
import RNCallKeep from 'react-native-callkeep';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class ChooseProblem extends Component {
    temp_treatments = this.props.treatments;
    routeParams = this.props.route.params
    constructor(props) {
        super(props);
        console.log(this.routeParams, "this.props.route.params");
        this.state = {
            treatments: this.props.treatments,
            temp_treatments: this.props.treatments,
            seletectedTreatments: [],
            vLat: '30.7162',
            vLng: '76.7776',
            search_txt: "",
            noResutFound: false,
            isLogoutShow: true,
            showUpdatePopup: false,
            showNetworkPopup: false
        };
    }

    componentDidMount() {

        // if (this.props.route.params && this.props.route.params.type == "logout") {
        //     this.setState({
        //         isLogout: true
        //     })
        // }
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

        Geolocation.getCurrentPosition(info => {
            console.log(info, "current");
            this.setState({
                vLat: String(info.coords.latitude),
                vLng: String(info.coords.longitude)
            })
            this.props.setLocation({ lat: String(info.coords.latitude), lng: String(info.coords.longitude) });
        }, error => {
            console.log("location error", error);
            this.setState({
                vLat: "30.7162",
                vLng: "76.7776"
            })
            this.props.setLocation({ lat: "30.7162", lng: "76.7776" })
            if (error.PERMISSION_DENIED == 1) {
                console.log("denianle")
                request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                // Geolocation.requestAuthorization();
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

    /**
     * Action when user clicks back or next button -PKQnE
     */
    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');
                if (this.state.seletectedTreatments.length == 0) {
                    showToast("Select atleast one health problem to continue.")
                } else {
                    console.log(this.state, "mmmm")
                    var data = {
                        treatments: this.state.seletectedTreatments,
                        vLat: this.state.vLat,
                        vLng: this.state.vLng
                    }
                    console.log(data, "data")
                    this.props.setProblems(data);
                    //  this.props.navigation.navigate('ApptOption');
                    var param = {
                        treatments: this.state.seletectedTreatments,
                        fLatitude: this.state.vLat,
                        fLongitude: this.state.vLng,
                        iCurrentPage: 0
                    }
                    this.searchDoctor(param);

                }
                //  this.verfiyApiCall();
                break;
            }
            case 'back': {
                this.props.clickHandler('back');
                break;
            }
        }
    }

    /**
 * Search Practitioner
 */
    searchDoctor = (param) => {
        // this.props.navigation.push('AvailableRMP', { resulted_rmp: [] });
        // return false;
        this.setState({
            spinner: !this.state.spinner
        });
        postApiRequestWithHeaders(data.api_endpoint.search_doctors, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.setState({
                    spinner: !this.state.spinner
                });
                this.props.navigation.navigate('AvailableRMP', { resulted_rmp: data });

            },
            error => {
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    };

    isActive = (item) => {
        if (this.state.seletectedTreatments.indexOf(item.item) > -1) {
            return true
        } else {
            return false
        }

    }


    removeCategory = (item) => {
        this.state.seletectedTreatments = this.state.seletectedTreatments.filter(treatment => treatment !== item.item);
        this.setState({ seletectedTreatments: this.state.seletectedTreatments, search_txt: "", temp_treatments: this.props.treatments, });
    }

    addCategory = (item) => {
        this.state.seletectedTreatments = this.state.seletectedTreatments.concat([item.item]);
        this.setState({ seletectedTreatments: this.state.seletectedTreatments, search_txt: "", temp_treatments: this.props.treatments, });

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

    popUpClick = (action) => {
        console.log(action, "actionnnnn")

        switch (action) {
            case "cancel":
                // this.props.navigation.navigate("Book Appointment");
                this.setState({
                    isLogoutShow: false
                })
                break;
        
            default:
                break;
        }

        if (action == "SplashScreen") {
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
        if (action == "logout") {
            clearLocalStorage('user_details').then(data => {
                this.props.removeUser();
                console.log(data, "remove key")
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'EnterPhoneNumber' }],
                });

            });
        }
    }


    _renderItem = (item) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    this.isActive(item) ? this.removeCategory(item) : this.addCategory(item)
                }
                style={[styles.numberInputContainer, this.isActive(item) ? { backgroundColor: colors.geen_txt } : {}]}>
                <View style={{}}>
                    <Text style={[
                        styles.body_style, this.isActive(item) ? { color: colors.LIGHT_COLOR } : {}, { textDecorationStyle: 'dotted' }
                    ]}> {item.item.vTreatmentName}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <Container keyboardShouldPersistTaps={'handled'}>
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
                {this.props.route.params && this.props.route.params.type == "logout" && this.state.isLogoutShow && (
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
                <HeaderComponent show_headingCenter={true} show_menu={true} show_logout={true}
                    navigation={this.props.navigation}
                    clickHandler={this.navigator} title={constant.page_titles.CHOOSE_TREATMENT}></HeaderComponent>
                <View style={styles.mainContainer}>

                    <Text style={styles.headingText}>
                        Search Problem/Treatment Area
                    </Text>
                    <View style={{ marginTop: 0 }}>
                        <View style={styles.numberInputContainer1}>
                            <Icon
                                style={[{
                                    alignSelf: 'center',
                                    color: colors.PLACEHOLDER_TEXT,
                                    paddingRight: 3,
                                    paddingLeft: 2,
                                    fontSize: 25,
                                }]}
                                name='search' />
                            <TextInput
                                placeholder="Search Problem/Treatment Area "
                                style={styles.numberInput}
                                keyboardType="default"
                                selectionColor={colors.THEME_YELLOW}
                                onChangeText={text => this.onChangeSearchText(text)}
                                value={this.state.search_txt}
                            >
                            </TextInput>
                            {this.state.search_txt != "" && (
                                <TouchableOpacity hitSlop={hitSlop}
                                    style={{ right: 5, top: 5 }}
                                    onPress={() => {
                                        this.setState({ search_txt: "", temp_treatments: this.props.treatments });
                                        this.temp_treatments = this.props.treatments;
                                    }
                                    }>
                                    <Icon
                                        style={[{
                                            alignSelf: 'center',
                                            color: colors.PLACEHOLDER_TEXT,

                                            fontSize: 28,
                                        }]}
                                        name='close' />
                                </TouchableOpacity>
                            )}

                        </View>
                        <View style={{ marginLeft: 0, marginTop: 0, marginBottom: 0, flexWrap: 'wrap', }}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
                                <FlatList
                                    style={{ flexGrow: 0, maxHeight: 150, flexWrap: 'wrap', }}
                                    showsVerticalScrollIndicator={false}
                                    data={this.state.seletectedTreatments}
                                    keyExtractor={item => item.iTreatmentAreaId}
                                    horizontal={false}
                                    numColumns={2}
                                    renderItem={(item) =>
                                        <View style={{ flexDirection: 'row', borderColor: colors.geen_txt, borderWidth: 1, borderRadius: 5, margin: 2, backgroundColor: colors.geen_txt, flexWrap: 'wrap', }}>
                                            <Text style={{
                                                flexWrap: 'wrap',
                                                color: colors.LIGHT_COLOR, fontFamily: 'OpenSans-Regular',
                                                fontSize: 13,
                                                padding: 3,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>{item.item.vTreatmentName}</Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.removeCategory(item)
                                                }
                                                hitSlop={hitSlop} style={{

                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <Icon
                                                    style={[{
                                                        fontSize: 20,
                                                        alignSelf: 'center',
                                                        color: colors.LIGHT_COLOR,
                                                        paddingRight: 5
                                                    }]}
                                                    name='ios-close-circle-outline' />
                                            </TouchableOpacity>
                                        </View>

                                    }
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.mainContent}>
                        <Text style={styles.headingText}>
                            Or Choose from options below
                </Text>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            //      data={this.state.treatments}
                            data={this.state.temp_treatments}
                            ListEmptyComponent={<Text style={[styles.headingText, { fontFamily: 'OpenSans-Regular', alignSelf: "center", marginTop: 35 }]}>No Search Found</Text>}
                            keyExtractor={item => item.iTreatmentAreaId}     //has to be unique   
                            horizontal={false}
                            numColumns={2}
                            renderItem={(item) => this._renderItem(item)}
                        />
                        <View style={{ marginTop: 10, }}>
                            <Button style={styles.nextButtonContainer}
                                onPress={() => {
                                    this.navigator('next');
                                }} >
                                <Text style={styles.nextButton}>Next</Text>
                            </Button>
                        </View>

                    </View>

                </View>
            </Container >
        );
    }

    onChangeSearchText = text => {
        this.setState({ search_txt: text });
        this.temp_treatments = this.props.treatments;
        var val = text;
        if (val && val.trim() != '') {
            this.temp_treatments = this.temp_treatments.filter(item => {
                //return item.vTreatmentName.toLowerCase().indexOf(val.toLowerCase()) > -1;
                return item.vTreatmentName.toLowerCase().startsWith(val.toLowerCase()) == true;
            });

            this.setState({
                temp_treatments: this.temp_treatments
            })
        }
        if (this.temp_treatments.length == 0) {
            this.setState({ noResutFound: true });
        } else {
            this.setState({ noResutFound: false });
        }

    }
}


function mapStateToProps(state) {
    //  console.log(state, "sMyAccounttate...")
    return {
        app_version: state.user.app_version,
        treatments: state.treatments,
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, { setProblems, removeUser, setLocation, setComplete, setStateList, setTreatment, setStateCouncil, setSpeciality, setRelation, setAppVersion })(ChooseProblem);


