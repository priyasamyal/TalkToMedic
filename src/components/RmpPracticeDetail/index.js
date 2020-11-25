//import liraries
import React, { Component } from 'react';
import { View, Text, Keyboard, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
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
import YearMonthPicker from './yearMonthPicker';
import StateListing from '@components/StateListing';
import HeaderComponent from '@components/HeaderComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
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
var Gender = ["Male", "Female", "Other", "Cancel"];
var CANCEL_INDEX = 3;
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

/**
 * var arr=[{id:1, name:'pr'},{id:2, name:'fgd'}];
var arr1=[1];
var filter_arr=[];
arr.map(m=>{
arr1.map(m1=>{

m.id ==m1? filter_arr.push(m):''

}

)
})
console.log(filter_arr)
 */

class RmpPracticeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {

            vRegistrationNo: '',
            iRegistrationYear: '',
            iMedicalCouncilId: '',
            vQualification: '',
            vPracticeName: '',
            vPracticeAddress: '',
            iPracticeStateId: '',
            vPracticeCity: '',
            vPracticeZipCode: '',
            iSpecialtyIds: '',
            selectedItems: [],

            selectedState: [{}],
            selectedCity: [{}],
            image_data: "",
            current_image_selection: '',


            showCamera: false,
            dropDownTitle: "Select State",
            modalVisible: false,

            startYear: 1980,
            endYear: new Date().getFullYear(),
            custom_treatments: []
        };

        this.modalRef = React.createRef();
    }

    componentDidMount() {
        console.log(this.state, "state.....");

        this.getPracticeLocation();

    }
    getTreatmentBySpeciality = (id) => {
        console.log(id, "id....")

        var param = {
            iSpecialtyId: id
        }
        postApiRequestWithHeaders(data.api_endpoint.get_treatment_byid, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "getTreatmentBySpeciality data.....", id);
                this.setState({ custom_treatments: data.treatments });
            },
            error => {

                console.log(error, 'errorrrrrr');
            },
        );



    }


    getPracticeLocation = () => {
        this.setState({
            spinner: !this.state.spinner
        });
        postApiRequestWithHeaders(data.api_endpoint.rmp_get_practice, {}, this.props.user_data.vAccessToken).then(
            res => {
                console.log(data, "data.....rmp_get_practice ", data.document_url + res.practice_location.vRegCertificatePhoto);
                this.setState({
                    vRegistrationNo: res.practice_location.vRegistrationNo,
                    iRegistrationYear: res.practice_location.iRegistrationYear,
                    iMedicalCouncilId: res.practice_location.iMedicalCouncilId,
                    vQualification: res.practice_location.vQualification,
                    vPracticeName: res.practice_location.vPracticeName,
                    vPracticeAddress: res.practice_location.vPracticeAddress,
                    iPracticeStateId: res.practice_location.iPracticeStateId,
                    vPracticeCity: res.practice_location.iPracticeCityId,
                    vPracticeZipCode: res.practice_location.vPracticeZipCode,
                    iSpecialtyIds: res.practice_location.iSpecialtyId,
                    selectedItems: res.practice_location.treatments.map(m => {
                        return m.iTreatmentAreaId
                    }),
                    image_data: res.practice_location.vRegCertificatePhoto != "" ? data.document_url + res.practice_location.vRegCertificatePhoto : "",
                    selectedState: res.practice_location.iPracticeStateId == null ? [{}] : this.props.states.filter(m => m.iStateid == res.practice_location.iPracticeStateId),

                })
                if (res.practice_location.iSpecialtyId != "0") {
                    this.getTreatmentBySpeciality(res.practice_location.iSpecialtyId)
                }
                if (res.practice_location.iPracticeStateId != null) {
                    var param = {
                        iStateId: res.practice_location.iPracticeStateId
                    }
                    postApiRequest(data.api_endpoint.getCities, param).then(
                        data => {
                            console.log(data, 'dataaa of city');
                            this.props.setCity(data.cities);
                            data.cities.filter(m => m.iCityId == res.practice_location.iPracticeCityId).length > 0 ?
                                this.setState({
                                    selectedCity: data.cities.filter(m => m.iCityId == res.practice_location.iPracticeCityId)
                                }) : ''
                            // data.cities.filter(m => m.iCityId == res.practice_location.iPracticeCityId);
                            // this.setState({
                            //     selectedCity: data.cities.filter(m => m.iCityId == res.practice_location.iPracticeCityId)
                            // })
                        },
                        error => {

                        },
                    );
                }
                this.setState({
                    spinner: !this.state.spinner
                });

            },
            error => {

                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'errorrrrrr');
            },
        );
    }
    onSelectedItemsChange = selectedItems => {
        this.setState({ selectedItems });
    };

    navigator = (action, data) => {
        console.log(action, "action....", this.state);
        switch (action) {
            case "next":
                this.checkValidations();
                break;
            case "back":
                // this.props.clickHandler('back');
                this.props.navigation.goBack();
                break;
            case "back_camera":
                this.setState({ showCamera: false })
                break;

            case "camera_click":
                if (this.state.current_image_selection == "back_doc") {
                    this.setState({ showCamera: false, image_data: data.uri })
                }
                // if (this.state.current_image_selection == "profile") {
                //     this.setState({ showCamera: false, image_data: data.uri })
                // }
                break;

            default:
                break;
        }
    }

    checkValidations = () => {
        console.log(this.states);
        if (this.state.vRegistrationNo == '') {
            showToast(data.ToastMessages.reg_no);
            return false;
        }
        else if (this.state.iRegistrationYear == '') {
            showToast(data.ToastMessages.reg_year);
            return false;
        }
        else if (this.state.vQualification == '') {
            showToast(data.ToastMessages.qua);
            return false;
        }
        else if (this.state.vPracticeName == '') {
            showToast(data.ToastMessages.prac_name);
            return false;
        }
        else if (this.state.vPracticeName == '') {
            showToast(data.ToastMessages.prac_add);
            return false;
        }
        else if (this.state.vPracticeName == '') {
            showToast(data.ToastMessages.prac_add);
            return false;
        }
        else if (this.state.selectedState[0].iStateid === undefined) {
            showToast(data.ToastMessages.state);
            return false;
        }
        else if (this.state.selectedCity[0].iCityId === undefined) {
            showToast(data.ToastMessages.city);
            return false;
        }
        else if (this.state.vPracticeZipCode == '') {
            showToast(data.ToastMessages.praczip);
            return false;
        }
        else if (this.state.iSpecialtyIds == '') {
            showToast(data.ToastMessages.prac_spec);
            return false;
        }
        else if (this.state.selectedItems.length == 0) {
            showToast(data.ToastMessages.prac_treat);
            return false;
        }
        else {
            setTimeout(() => {
                this.setState({
                    spinner: !this.state.spinner
                });
            }, 100);
            var treatments = [];
            this.props.treatments.map(m => {
                this.state.selectedItems.map(m1 => {
                    m.iTreatmentAreaId == m1 ? treatments.push(m) : ''
                })
            })
            var param = {
                vRegistrationNo: this.state.vRegistrationNo,
                iRegistrationYear: this.state.iRegistrationYear,
                iMedicalCouncilId: this.state.iMedicalCouncilId,
                vQualification: this.state.vQualification,
                vPracticeName: this.state.vPracticeName,
                vPracticeAddress: this.state.vPracticeAddress,
                iPracticeStateId: this.state.selectedState[0].iStateid,
                iPracticeCityId: this.state.selectedCity[0].iCityId,
                vPracticeZipCode: this.state.vPracticeZipCode,
                iSpecialtyId: this.state.iSpecialtyIds,
                treatments: treatments,
                vRegCertificatePhoto: this.state.image_data
            }
            console.log(param);
            this.editProfileAPI(param);
        }
    }

    editProfileAPI = (param) => {
        postApiRequestWithHeaders(data.api_endpoint.rmp_add_practice, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.setState({
                    spinner: !this.state.spinner
                });
                this.props.setUserData(data.user);
                showToast("Practice Details Updated Successfully.");
                // this.props.clickHandler('back');
                this.props.navigation.goBack();
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

    showPicker = () => {
        const { startYear, endYear, iRegistrationYear, selectedMonth } = this.state;
        console.log(selectedMonth);
        this.picker
            .show({ startYear, endYear, iRegistrationYear, selectedMonth })
            .then(({ year, month }) => {
                console.log(year, month, 'monthhhhhhh');
                this.setState({
                    iRegistrationYear: year,
                });
            });
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
                            //  contentContainerStyle={styles.mainContent}
                            keyboardDismissMode="interactive"
                            keyboardShouldPersistTaps="handled">
                            <Spinner
                                color={colors.sub_theme}
                                visible={this.state.spinner}
                                textContent={''}
                            />
                            <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.PRACTICE_DETAIL}></HeaderComponent>
                            <View style={styles.mainContainer}>

                                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

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
                                        <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                            <TouchableOpacity onPress={() => {
                                                Keyboard.dismiss()
                                                this.showPicker()
                                            }} >
                                                {/* <Text style={styles.numberInput}>{this.state.iRegistrationYear}</Text> */}
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



                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.headingText}>State Medical Council</Text>
                                    <View style={[styles.numberInputContainer, {}]}>
                                        <Picker
                                            note
                                            iosIcon={<Icon name="ios-arrow-down" style={{ color: colors.sub_theme, fontSize: 25 }} />}
                                            iosHeader="Select"
                                            mode="dropdown"
                                            textStyle={[styles.stateCouncilTxt]}
                                            style={[{ width: "100%" }]}
                                            selectedValue={this.state.iMedicalCouncilId}
                                            onValueChange={value => {
                                                console.log("medical ")
                                                this.setState({
                                                    iMedicalCouncilId: value
                                                })
                                            }
                                            }
                                        >
                                            {this.props.state_council.map((value, idx) => {
                                                return (
                                                    <Picker.Item label={value.vCouncilName} value={value.iMedicalCouncilId} />
                                                )
                                            })}
                                        </Picker>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                                    <View style={{ flex: 2, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Your Registration Certificate Photo</Text>
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
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Highest Qualification</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput

                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            // autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => { this.setState({ vQualification: name }) }}
                                            value={this.state.vQualification}
                                        >
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Practice Name</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput

                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            //  autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            // onChangeText={name => this.disableButton(name)}
                                            value={this.state.vPracticeName}
                                            onChangeText={name => this.setState({ vPracticeName: name })}

                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={styles.headingText}>Practice Address</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="default"
                                            maxLength={32}
                                            ref={ref => (this.textInputRef = ref)}
                                            //   autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            // onChangeText={name => this.disableButton(name)}
                                            value={this.state.vPracticeAddress}
                                            onChangeText={name => this.setState({ vPracticeAddress: name })}
                                        >
                                        </TextInput>
                                    </View>
                                </View>



                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Practice State</Text>
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
                                        <Text style={styles.headingText}>Practice City</Text>
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
                                    <Text style={styles.headingText}>Practice ZIP Code</Text>
                                    <View style={styles.numberInputContainer}>
                                        <TextInput
                                            style={styles.numberInput}
                                            keyboardType="number-pad"
                                            maxLength={10}
                                            ref={ref => (this.textInputRef = ref)}
                                            //   autoFocus={true}
                                            selectionColor={colors.THEME_YELLOW}
                                            onChangeText={name => this.setState({ vPracticeZipCode: name.trim() })}
                                            value={this.state.vPracticeZipCode}
                                        >
                                        </TextInput>
                                    </View>
                                </View>

                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Speciality</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                            <Picker
                                                // note
                                                iosIcon={<Icon name="ios-arrow-down" style={{ color: colors.sub_theme, fontSize: 25 }} />}
                                                iosHeader="Select"
                                                mode="dropdown"
                                                textStyle={[styles.stateCouncilTxt]}
                                                style={[{ width: "100%" }]}
                                                selectedValue={this.state.iSpecialtyIds}
                                                // onValueChange={() => this.onValueChange.bind(this)}
                                                onValueChange={value => {
                                                    this.setState({
                                                        iSpecialtyIds: value
                                                    }, () => {
                                                        console.log("value update", this.state);
                                                        this.getTreatmentBySpeciality(value)
                                                        this.setState({ selectedItems: [] });
                                                    })
                                                }
                                                }
                                            >
                                                {this.props.specialities.map((value, idx) => {
                                                    // console.log("id..", value, idx)
                                                    return (
                                                        <Picker.Item label={value.vSpecialty} value={value.iSpecialtyId} />
                                                    )
                                                })}
                                            </Picker>

                                        </View>
                                    </View>

                                </View>
                                <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                    <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                        <Text style={styles.headingText}>Treatment Areas</Text>
                                        <View style={[styles.numberInputContainerRow, { fontSize: 15, padding: 5, margin: 0 }]}>
                                            <MultiSelect
                                                hideTags
                                                items={this.state.custom_treatments}
                                                //  items={this.props.treatments}
                                                // items={items}
                                                uniqueKey="iTreatmentAreaId"
                                                ref={(component) => { this.multiSelect = component }}
                                                onSelectedItemsChange={this.onSelectedItemsChange}
                                                selectedItems={this.state.selectedItems}
                                                selectText="Select Treatments"
                                                searchInputPlaceholderText="Search Items..."
                                                onChangeInput={(text) => console.log(text)}

                                                altFontFamily="OpenSans-Regular"
                                                tagRemoveIconColor="#CCC"
                                                tagBorderColor="#CCC"
                                                tagTextColor="#CCC"
                                                selectedItemTextColor={colors.sub_theme}
                                                selectedItemIconColor={colors.sub_theme}
                                                itemTextColor="#000"
                                                displayKey="vTreatmentName"
                                                submitButtonColor={colors.sub_theme}
                                                submitButtonText="Select"

                                                searchInputStyle={{ padding: 15, fontFamily: 'OpenSans-Regular', fontSize: 18, }}
                                                styleDropdownMenuSubsection={{ alignItems: 'center', borderWidth: 0, borderColor: 'transparent', padding: 0, paddingLeft: 5, backgroundColor: 'transparent' }}
                                                styleRowList={{ padding: 5 }}
                                                // styleMainWrapper={{ backgroundColor: 'transparent', paddingBottom: 0 }}
                                                styleTextDropdownSelected={{ color: colors.sub_theme, fontFamily: 'OpenSans-Regular', fontSize: 15, }}
                                                styleTextDropdown={{ color: colors.PLACEHOLDER_TEXT, fontFamily: 'OpenSans-Regular', fontSize: 18, }}
                                                // styleListContainer={{ maxHeight: 150 }}
                                                fixedHeight={false}
                                                hideDropdown={true}
                                            // styleSelectorContainer={{ backgroundColor: '' }}
                                            />
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
                        <YearMonthPicker ref={picker => (this.picker = picker)} />
                    </View>

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
        city: state.city,
        state_council: state.state_council,
        specialities: state.specialities,
        treatments: state.treatments
    }
}
export default connect(mapStateToProps, { setCity, setUserData })(RmpPracticeDetail);
