import React, { Component } from 'react';
import styles from './styles';

import { View, Image, Text } from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Title,
    Icon,
    Button
} from 'native-base';

import { connect } from "react-redux";
import AppIntroSlider from 'react-native-app-intro-slider';
import { getItem, setItem, openUrl, showToast } from '../../common/user';
import { alertWithSingleBtn, postApiRequest } from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';
import { data, colors } from '../../common/index';
import { setUserType, setUserData, } from "../../actions";
import { AppEventsLogger } from "react-native-fbsdk";
const patient_slides = [
    {
        key: 'first',
        title: 'Register as Patient',
        text:
            'Register using your \n mobile number  and \n get started',
        image: require('../../assets/imgs/slider1.jpg'),
    },
    {
        key: 'second',
        title: 'Book Appointment',
        text:
            'Choose your problem/\n symptoms, pick a date and time\n and book an appointment with\n Doctor',
        image: require('../../assets/imgs/slider2.jpg'),
    },
    {
        key: 'third',
        title: 'Audio/ Video\n   Consultation',
        text:
            'Consult with your doctor\n via Secure Live Audio/ Video Call',
        image: require('../../assets/imgs/slider3.jpg'),
    },
    {
        key: 'fourth',
        title: 'Get Prescription',
        text:
            'We will notify you when your\n Medical Report and Prescription\n are ready',
        image: require('../../assets/imgs/slider4.jpg'),
    },
];

const rmp_slides = [
    {
        key: 'first',
        title: 'Register as Medical Practitioner',
        text:
            'Register using your \n mobile number  and \n get started',
        image: require('../../assets/imgs/sliderRMP1.jpg'),
    },
    {
        key: 'second',
        title: 'Setup Availability \nSchedule',
        text:
            'Setup your Appointment\n Availability. \n\nIt should take just 5 minutes',
        image: require('../../assets/imgs/sliderRMP2.jpg'),
    },
    {
        key: 'third',
        title: 'Audio/ Video\n  Consultation',
        text:
            'Consult with your patient\n via Secure Live \n Audio/ Video Call',
        image: require('../../assets/imgs/slider3.jpg'),
    },
    {
        key: 'fourth',
        title: 'Write Prescription\n and Get Paid ',
        text:
            'Write Medical History,\n Prescribe Medicine and\nGet Paid Instantly.',
        image: require('../../assets/imgs/slider4.jpg'),
    },
];
class Introduction extends Component {
    constructor(props) {
        super(props);
        console.log(props, 'in introduction');
        this.state = { switch1Value: false, spinner: false };
    }
    _onDone = () => {
        if (data.current_version < this.props.app_version) {
            alertWithSingleBtn(
                "Update Required",
                data.ToastMessages.update_app_msg,
                'Update'
            ).then(data => {
                console.log(data);
                if (data) {
                    openUrl("https://play.google.com/store/apps/details?id=com.talktomedic.app");
                }
            });
        } else {
            if (this.props.user.iRoleId != 1) {
                this.props.navigation.navigate('RmpRegister');
                return;
            }

            var param = {
                vMobileNo: this.props.user.vMobileNo,
                iCountryCode: this.props.user.iCountryCode,
                vFirstName: "Guest",
                vLastName: "Patient",
                iRoleId: this.props.user.iRoleId,
                vDeviceToken: this.props.user.vDeviceToken,
                vPlatform: 'android'
            }
            this.registerPatient(param);

            // this.props.user.iRoleId == 1 ? this.props.navigation.navigate('PatientRegister') : this.props.navigation.navigate('RmpRegister')
            // setItem('is_first_time', 'false').then(
            //     res => {
            //         if (res) {
            //             console.log('Storage set', res);
            //             this.props.navigation.navigate('PatientRegister');
            //         }
            //     },
            //     err => { },
            // );
        }
    };

    registerPatient = (param) => {
        postApiRequest(data.api_endpoint.signup, param).then(
            data => {
                this.props.setUserData(data.user);
                AppEventsLogger.logEvent("Patient Register", {});
                showToast("Register Successfully.")
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

    _renderItem = item => {
        return (
            <Container>
                <Header transparent style={styles.header}>
                    <Left />
                    <Body style={{ flex: 2 }}>
                        <Title style={styles.pageTitle}>TalkToMedic</Title>
                    </Body>
                    <Right >
                        <Button hasText transparent onPress={() => {
                            this._onDone()
                        }} >
                            <Text style={styles.skipText}>Skip</Text>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={styles.mainContent}>
                        <Image style={styles.image} source={item.item.image} />
                        <View style={styles.content_block}>
                            <Text style={styles.title}>{item.item.title}</Text>
                            <Text style={styles.text}>{item.item.text}</Text>
                        </View>

                    </View>
                </Content>
            </Container>
        );
    };



    render() {
        return (
            <>
                {/* // <View>
                <Text>Hi</Text>
                <AppIntroSlider renderItem={this._renderItem} data={slides} onDone={this._onDone} />
            </View> */}
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />

                <AppIntroSlider
                    data={this.props.user.iRoleId == 1 ? patient_slides : rmp_slides}
                    renderItem={this._renderItem}
                    doneLabel="Get Started"
                    activeDotStyle={styles.activeDot}
                    dotStyle={styles.dotStyle}
                    buttonStyle={styles.nextBtn}
                    buttonTextStyle={styles.nextBtnTxt}
                    onDone={() => this._onDone()}
                    renderDoneButton={this._renderDoneButton}
                    bottomButton
                />
            </>


        );
    }
}

function mapStateToProps(state) {
    console.log(state, "state...")
    return {
        app_version: state.user.app_version,
        user: state.user
    }
}
export default connect(mapStateToProps, { setUserData })(Introduction);


