//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
import CommonPopUp from '@components/CommonPopUp';
import StateListing from '@components/StateListing';
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
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import moment from 'moment';
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';
// create a component
var Gender = ["Male", "Female", "Others", "Cancel"];
var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const calendar = require('../../assets/imgs/calendar.png');
import Camera from '@components/Camera';
import { setMember } from "../../actions"
import { connect } from "react-redux";
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
class AddMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vFirstName: "",
            vLastName: "",
            eGender: " ",
            dDob: '',
            eRelationType: " ",
            vProfilePicture: "",
            selectedRelation: { name: "Father", id: 1 },
            modalVisible: false,
            showCamera: false,
            image_data: "",
            spinner: false,
            addMemberClick: false,
            btnTitle: 'Add',
            iFamilyMemberId: '',
            showDeletePopUp: false,
            deletedItem: {}
        };
    }

    componentDidMount() {
        this.getMembers();
    }

    getMembers = () => {
        postApiRequestWithHeaders(data.api_endpoint.getMember, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.props.setMember(data.family_members);
            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }
    navigator = (action, data) => {
        console.log(action, data, "callback");
        switch (action) {
            case "next":
                this.checkValidation();
                break;
            case "camera_click":
                this.setState({ showCamera: false, image_data: data.uri })
                break;
            case "openCamera":
                this.setState({ showCamera: true })
                break;

            case "addMember":
                console.log("add")
                this.setState({ addMemberClick: !this.state.addMemberClick, btnTitle: "Add" })
                break;
            case "back":
                console.log(this.state);
                if (this.state.addMemberClick) {
                    this.setState({ addMemberClick: !this.state.addMemberClick })
                } else {
                    // this.props.clickHandler('back');
                    this.props.navigation.goBack();
                }
                break;

            case "back_camera":
                this.setState({ showCamera: false })
                break;
            default:
                break;
        }
    }

    checkValidation = () => {

        console.log(this.state.selectedRelation.name, "relation");
        // return;

        if (this.state.vFirstName == '') {
            showToast(data.ToastMessages.first_name);
        }
        else if (this.state.vLastName == '') {
            showToast(data.ToastMessages.last_name);
        }
        else if (this.state.eGender == ' ') {
            showToast(data.ToastMessages.gender);
        }
        else if (this.state.dDob == '') {
            showToast(data.ToastMessages.dob);
        }
        else if (this.state.image_data == "") {
            showToast(data.ToastMessages.photo);
        } else {
            this.setState({
                spinner: !this.state.spinner
            });
            console.log(this.state);
            var param = {
                vFirstName: this.state.vFirstName,
                vLastName: this.state.vLastName,
                dDob: this.state.dDob,
                eGender: this.state.eGender,
                eRelationType: this.state.selectedRelation.name,
                vProfilePicture: this.state.image_data
            }
            console.log(param, "param");
            // return;
            if (this.state.btnTitle == "Update") {
                param.iFamilyMemberId = this.state.iFamilyMemberId;

            }

            this.addMemberAPI(param);
        }
    }
    manageMember = (item, operation) => {
        console.log(item)
        switch (operation) {
            case "edit":
                this.setState({
                    vFirstName: item.item.vFirstName,
                    vLastName: item.item.vLastName,
                    eGender: item.item.eGender,
                    dDob: moment(item.item.dDob).format("DD-MM-YYYY"),
                    eRelationType: item.item.eRelationType,
                    vProfilePicture: "",
                    selectedRelation: { name: item.item.eRelationType, id: 1 },
                    modalVisible: false,
                    showCamera: false,
                    image_data: data.profile_picture_url + item.item.vProfilePicture,
                    spinner: false,
                    addMemberClick: !this.state.addMemberClick,
                    iFamilyMemberId: item.item.iFamilyMemberId,
                    btnTitle: "Update"
                })
                break;

            case "delete":
                this.setState({ showDeletePopUp: !this.state.showDeletePopUp });
                this.setState({ deletedItem: item.item });
                // this.setState({
                //     spinner: !this.state.spinner
                // });
                // var param = {
                //     iFamilyMemberId: item.item.iFamilyMemberId
                // }
                // console.log(param);
                // postApiRequestWithHeaders(data.api_endpoint.deleteMember, param, this.props.user_data.vAccessToken).then(
                //     data => {
                //         this.setState({
                //             spinner: !this.state.spinner
                //         });
                //         console.log(data, "data.....");
                //         this.props.setMember(data.family_members);
                //         showToast(data.message);
                // this.props.clickHandler('back');
                // this.props.navigation.goBack();
                //     },
                //     error => {
                //         this.setState({
                //             spinner: !this.state.spinner
                //         });
                //         showToast(error);
                //     },
                // );
                break;
            default:
                break;
        }
    }

    addMemberAPI = (param) => {
        postApiRequestWithHeaders(data.api_endpoint.addMember, param, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(data, "data.....");
                this.props.setMember(data.family_members);

                showToast(data.message);
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


    //Function for setting input values to state
    setValues = (setoff, value) => {
        switch (setoff) {
            case 'dob': {
                this.setState({ dDob: value });
                break;
            }

        }
    };

    openOrCloseModal = () => {
        console.log('as', this.child);
        this.child.setModalVisibility(true, this.state.selectedRelation)
    };

    _renderMemberList = (item) => {
        console.log(item)
        return (
            <View style={{ marginTop: 5 }}>
                {item.index == 0 && (
                    <View style={{ marginTop: 15, }}>
                        <Button style={styles.nextButtonContainer}
                            onPress={() => {
                                this.navigator('addMember');
                            }} >
                            <Text style={styles.nextButton}>Add Family Member</Text>
                        </Button>
                    </View>
                )}
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={default_user}
                            source={{
                                uri: data.profile_picture_url + item.item.vProfilePicture,
                            }}
                            style={[styles.profileContainer, {
                                resizeMode: 'contain',
                                height: 55, width: 55
                            }]}
                        />
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.memberName}>{item.item.vFirstName}  {item.item.vLastName}</Text>
                        <Text style={styles.memberDesc}>  {item.item.eGender}{'  '}|{'  '}{moment(item.item.dDob).format("DD-MM-YYYY")}</Text>
                        <Text style={styles.memberDesc}>  {item.item.eRelationType} </Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={() => this.manageMember(item, "edit")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon
                                            style={[{
                                                color: colors.PLACEHOLDER_TEXT,
                                                fontSize: 25
                                            }]} name='md-create' />
                                        <Text style={[styles.iconText, { marginLeft: 5, marginRight: 25 }]}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.manageMember(item, "delete")} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Icon
                                            style={[{
                                                color: colors.PLACEHOLDER_TEXT,
                                                fontSize: 25
                                            }]}
                                            name='ios-trash' />
                                        <Text style={[styles.iconText, { marginLeft: 5 }]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>


                        </View>
                    </View>
                </View>
            </View>
        )
    }

    popUpClick = (status) => {
        console.log(status, "status.....");
        this.setState({ showDeletePopUp: !this.state.showDeletePopUp })
        switch (status) {
            case "delete":
                console.log(this.state.deletedItem, "Deleted Item");
                this.setState({
                    spinner: !this.state.spinner
                });
                var param = {
                    iFamilyMemberId: this.state.deletedItem.iFamilyMemberId
                }
                console.log(param);
                postApiRequestWithHeaders(data.api_endpoint.deleteMember, param, this.props.user_data.vAccessToken).then(
                    data => {
                        this.setState({
                            spinner: !this.state.spinner
                        });
                        console.log(data, "data.....");
                        this.props.setMember(data.family_members);
                        showToast(data.message);
                        // this.props.clickHandler('back');
                        this.props.navigation.goBack();
                    },
                    error => {
                        this.setState({
                            spinner: !this.state.spinner
                        });
                        showToast(error);
                    },
                );
                break;

            default:
                break;
        }

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
                    <Container>
                        {this.state.showDeletePopUp && (
                            <View style={{
                                zIndex: 10,
                                position: 'absolute',
                                left: 0,
                                bottom: 0,
                                width: width,
                                height: height,
                            }}>
                                <CommonPopUp clickHandler={this.popUpClick} title="Delete" msg="Are you sure you want to delete this member?"></CommonPopUp>
                            </View>
                        )}
                        <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.ADD_MEMBER}></HeaderComponent>
                        {this.props.family_member.length != 0 && !this.state.addMemberClick && (
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.props.family_member}
                                keyExtractor={item => item.iFamilyMemberId}     //has to be unique   
                                horizontal={false}
                                renderItem={(item) => this._renderMemberList(item)}
                            />
                        )}
                        {(this.props.family_member.length == 0 || this.state.addMemberClick) && (
                            <ScrollView showsVerticalScrollIndicator={false}>

                                <View style={styles.mainContainer}>
                                    <KeyboardAvoidingView
                                        style={styles.mainContent}
                                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                                        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>

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
                                                        vFirstName:
                                                            name
                                                    })}
                                                    value={this.state.vFirstName}
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
                                                    selectionColor={colors.THEME_YELLOW}
                                                    onChangeText={name => this.setState({
                                                        vLastName:
                                                            name
                                                    })}
                                                    value={this.state.vLastName}
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
                                                                options: constant.GENDER,
                                                                cancelButtonIndex: CANCEL_INDEX,
                                                                title: "Gender"
                                                            },
                                                            buttonIndex => {
                                                                this.setState({ eGender: constant.GENDER[buttonIndex] });
                                                            }
                                                        )}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={styles.numberInput}>{this.state.eGender}</Text>
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

                                        <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>

                                            <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                                                <Text style={styles.headingText}>This member is my</Text>
                                                <View style={[styles.numberInputContainerRow, { fontSize: 15 }]}>
                                                    <TouchableOpacity onPress={() => this.openOrCloseModal()
                                                    }>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={styles.numberInput}>{this.state.selectedRelation.name}</Text>
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
                                                <Text style={styles.headingText}>Photo </Text>
                                                <View style={[{ fontSize: 15, alignItems: 'flex-start' }]}>
                                                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.navigator("openCamera")}>
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
                                                            onPress={() => this.navigator("openCamera")}
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
                                                                    //  source={this.state.image_data}
                                                                    source={{
                                                                        uri: this.state.image_data,
                                                                    }}
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
                                                <Text style={styles.nextButton}>{this.state.btnTitle}</Text>
                                            </Button>
                                        </View>

                                    </KeyboardAvoidingView>
                                </View>

                            </ScrollView>
                        )}

                        <StateListing
                            childRef={ref => (this.child = ref)}
                            modalVisible={this.state.modalVisible}
                            closeModal={selectedState => {
                                if (selectedState) {
                                    this.setState({ selectedRelation: selectedState });
                                }

                                console.log(selectedState, "hell", this.state);
                            }}
                            navigation={this.props.navigation}
                            titleText="Select Relation"
                        ></StateListing>


                    </Container >
                )}

                {this.state.showCamera && (
                    <Camera getImageUri={this.navigator}
                        current_image_selection="profile"
                        backButton={this.navigator}
                    ></Camera>
                )}
            </View>
        );
    }
}



function mapStateToProps(state) {
    console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData,
        family_member: state.family_member

    }
}
export default connect(mapStateToProps, { setMember })(AddMember);
