//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, ScrollView, FlatList, Dimensions, Platform } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
var { width, height } = Dimensions.get('window');
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
import Swiper from 'react-native-refreshed-deck-swiper'
// create a component
var Gender = ["Male", "Female", "Others", "Cancel"];
var CANCEL_INDEX = 3;
const default_user = require('../../assets/imgs/default_user.png');
const calendar = require('../../assets/imgs/calendar.png');
const no_jobs = require('../../assets/imgs/no_jobs.png');
const left = require('../../assets/imgs/left.png');
const right = require('../../assets/imgs/right.png');
import Camera from '@components/Camera';
import { setMember } from "../../actions"
import { connect } from "react-redux";
import Geolocation from '@react-native-community/geolocation';
import { color } from 'react-native-reanimated';
const swiperRef = React.createRef();
class AvailableRMP extends Component {
    onEndReachedCalledDuringMomentum;
    constructor(props) {
        super(props);
        this.state = {
            spinner: false,
            resulted_rmp: this.props.route.params.resulted_rmp.resulted_doctors,
            selectedDoctor: {},
            vLat: '30.7162',
            vLng: '76.7776',
            iCurrentPage: this.props.route.params.resulted_rmp.iCurrentPage,
            iMaxPages: this.props.route.params.resulted_rmp.iMaxPages,

        };
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(info => {
            console.log(info, "current");
            this.setState({
                vLat: String(info.coords.latitude),
                vLng: String(info.coords.longitude)
            })
        }, error => {
            console.log("location error", error);
            this.setState({
                vLat: "30.7162",
                vLng: "76.7776"
            })
            if (error.PERMISSION_DENIED == 1) {
                console.log("denianle")
                Geolocation.requestAuthorization();
            }
        });
    }


    navigator = (action, data) => {
        console.log(action, data, "callback");
        switch (action) {
            case "back":
                console.log(this.state);
                this.props.navigation.goBack();
                break;
            case "book":
                console.log(data);
                this.setState({ selectedDoctor: data });
                console.log(this.state, "booking.....");
                console.log(parseInt(data.fFirstConsultFee) * 100, "fee in int")
                this.startPayment(String(parseInt(data.fFirstConsultFee) * 100));
                //    this.props.navigation.goBack();
                break;
            default:
                break;
        }
    }

    startPayment = (fees) => {
        var options = {
            description: 'Appointment Consultation Fees',
            image: 'https://www.talktomedic.in/assets/web/images/ic_launcher.png',
            currency: 'INR',
            // key: 'rzp_test_tcd4Yy6Q8OlCde',
            key: 'rzp_live_OD0kknoemJXCtm',
            amount: fees,
            name: this.props.user_data.vFirstName,
            prefill: {
                email: '',
                contact: this.props.user_data.vMobileNo,
                name: this.props.user_data.vFirstName + ' ' + this.props.user_data.vLastName
            },
            theme: { color: '#066DAE' },
            payment_capture: 1
        }
        console.log(options, "optins...")
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            console.log(data, "payment succcsess");
            this.bookAppointment(data.razorpay_payment_id)
            //  alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            console.log(error, "payment succcserroress")
            //  alert(`Error: ${error.code} | ${error.description}`);
        });
    }


    bookAppointment = (id) => {
        console.log(this.state, "booking.....");
        console.log("book app", id);
        var param = {
            vTransactionId: id,
            iUserId: this.state.selectedDoctor.iUserId,
            iAvailabilityId: this.state.selectedDoctor.iAvailabilityId,
            treatments: this.props.appt_data.treatments,
            eType: this.props.appt_data.eType,
            ePurpose: this.props.appt_data.ePurpose,
            eMode: this.props.appt_data.eMode,
            dTime: this.props.appt_data.dTime,
            dScheduledDate: this.props.appt_data.dScheduledDate,
            iFamilyMemberId: this.props.appt_data.iFamilyMemberId == "MySelf" ? null : this.props.appt_data.iFamilyMemberId,
            eApptType: "Scheduled",
            iDuration: "15",
            fAppointmentFee: this.props.appt_data.eType === "Initial" ? this.state.selectedDoctor.fFirstConsultFee : this.state.selectedDoctor.fFollowConsultFee,
        }
        console.log(param, "parasm....");

        postApiRequestWithHeaders(data.api_endpoint.book_appointment, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                showToast(data.message);
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'CommonPage', params: { type: 'thanks_booking' } }],
                });
                console.log(this.props)
            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    getAvailibilityDate = (date) => {
        var today = new Date();
        var someDate = new Date(date);
        if (today.getDate() == someDate.getDate() &&
            someDate.getMonth() == today.getMonth() &&
            someDate.getFullYear() == today.getFullYear()) {
            return (
                <Text style={[styles.memberDesc, { color: colors.geen_txt, fontWeight: 'bold' },]}>Available Today</Text>
            )
        } else {
            return (
                <Text style={[styles.memberDesc, { color: colors.danger, fontWeight: 'bold' },]}>Next Available {'\n'} {moment(date).format("ddd, DD MMM")} </Text>
            )
        }

    }
    onDoctorClick = (item) => {
        console.log(item);
        var param = {
            iUserId: item.iUserId,
            dRmpAvailDate: moment().format("DD-MM-YYYY"),
            eRequestType: 'next'
        }
        console.log(param, "kk");
        postApiRequestWithHeaders(data.api_endpoint.doctor_availibility, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.props.navigation.navigate('RmpAvailabilty', { doctor_data: item, doc_avalibility: data });
                // showToast(data.message);
                // this.props.navigation.reset({
                //     index: 0,
                //     routes: [{ name: 'CommonPage', params: { type: 'thanks_booking' } }],
                // });
                // console.log(this.props)
            },
            error => {
                showToast(error);
                //  console.log(error, 'errorrrrrr');
            },
        );
    }

    _renderMemberList = (item) => {
        return (
            <View style={{ marginTop: 5, paddingRight: 10, paddingLeft: 10, marginBottom: 5 }}>
                <TouchableOpacity >
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.PLACEHOLDER_TEXT, paddingBottom: 10 }}>
                        <View style={{
                            flex: 2,
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            padding: 10,
                        }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <View style={{ marginLeft: 12 }}>
                                    <Image
                                        source={default_user}
                                        source={{
                                            uri: data.profile_picture_url + item.item.vProfilePicture,
                                        }}
                                        style={[styles.profileContainer, {
                                            resizeMode: 'contain',
                                            height: 55, width: 55,
                                            alignSelf: "center"
                                        }]}
                                    />
                                    <View style={{ marginTop: 5 }}>
                                        <View style={{}}>
                                            <View style={{ alignItems: 'center' }}>
                                                <Text style={[styles.iconText, { marginBottom: 0, }]}>Rs {item.item.fFirstConsultFee}
                                                </Text>
                                                <Text style={[styles.iconText, { marginBottom: 5, fontSize: 15, textAlign: 'left' }]}>{item.item.iFirstConsultDuration} min call
                                            </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ alignItems: "flex-start", marginLeft: 20, flexWrap: "wrap" }}>
                                    <Text style={[styles.memberName, { paddingTop: 0, flexWrap: "wrap" }]}>Dr. {item.item.vDoctorName} </Text>
                                    <Text style={styles.memberDesc}>{item.item.vSpecialty} </Text>
                                    <Text style={styles.memberDesc}>{item.item.vQualification} </Text>
                                    <Text style={styles.memberDesc}>Reg. No. {item.item.vRegistrationNo} </Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>

                                <View style={{ alignItems: 'center', marginLeft: 5 }}>
                                    <Button style={styles.nextButtonContainer}
                                        onPress={() => {
                                            this.onDoctorClick(item.item)
                                        }} >
                                        <Text style={styles.nextButton}>Book1</Text>
                                    </Button>
                                </View>
                                <View style={{ alignItems: "flex-start", marginLeft: 10 }}>
                                    {item.item.vPracticeArea ? (
                                        <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", width: 200 }}>
                                            <Icon name="pin" style={[styles.memberDesc, { color: colors.GREY_SIDEMENU_COLOR }]} />
                                            <Text style={[styles.memberDesc, { color: colors.GREY_SIDEMENU_COLOR }]}>{item.item.vPracticeArea}</Text>
                                        </View>
                                    ) : null}

                                    {item.item.dNextAvailability != "Available Today" ? this.getAvailibilityDate(item.item.dNextAvailability) : <Text style={[styles.memberDesc, { color: colors.geen_txt, fontWeight: 'bold' },]}>Available Today</Text>}
                                </View>
                            </View>

                            {/* <View style={{ marginTop: 5 }}>
                                <View style={{}}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={[styles.iconText, { marginBottom: 5 }]}>Rs {item.item.fFirstConsultFee}</Text>
                                        <Button style={styles.nextButtonContainer}
                                            onPress={() => {
                                                this.onDoctorClick(item.item)
                                            }} >
                                            <Text style={styles.nextButton}>Book</Text>
                                        </Button>
                                    </View>
                                </View>
                            </View> */}
                        </View>
                        {/* <View style={{ flex: 2, }}>

                            <Text style={styles.memberDesc}>{item.item.vQualification} </Text>
                            <Text style={styles.memberDesc}>Reg. No. {item.item.vRegistrationNo} </Text>
                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" }}>
                                <Icon name="pin" style={[styles.memberDesc, { color: colors.GREY_SIDEMENU_COLOR }]} />
                                <Text style={[styles.memberDesc, { color: colors.GREY_SIDEMENU_COLOR }]}>Phase 7, Mohali, Punjab, 160071</Text>
                            </View>
                            {item.item.dNextAvailability != "Available Today" ? this.getAvailibilityDate(item.item.dNextAvailability) : <Text style={[styles.memberDesc, { color: colors.geen_txt, fontWeight: 'bold' },]}>Available Today</Text>}
                        </View> */}

                    </View>
                </TouchableOpacity>

            </View>
        )
    }

    getDtae = () => {
        console.log("jjejjjwe", swiperRef.current)
    }
    render() {
        console.log(swiperRef.current, "mmmm")
        return (
            <View style={{ flex: 1 }}>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <Container>
                    <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.AVAILABLE_RMP}></HeaderComponent>
                    <View style={{ flex: 1, alignItems: 'center', }}>
                        {this.getSwiper("More will be available soon. Tap below\nto get notified as soon as they're posted.")}
                    </View>
                    {this.state.resulted_rmp.length != 0 && (
                        <View style={[styles.cardBtnContainer, { flexDirection: 'row', bottom: height < 680 ? 20 : 45, justifyContent: 'space-between', }]}>

                            <View style={{}}>
                                {/* {this.getDtae()}
                                 {swiperRef.current != null ?  this.state.resulted_rmp[swiperRef.current.state.firstCardIndex].dNextAvailability =="Available Today"  ?  <Text style={[styles.memberDesc, { color: colors.geen_txt, fontWeight: 'bold', textAlign: 'center' },]}>Available Today {this.state.resulted_rmp[swiperRef.current.state.firstCardIndex].vRegistrationNo}</Text>: this.getAvailibilityDate(this.state.resulted_rmp[swiperRef.current.state.firstCardIndex].dNextAvailability) :<Text></Text>} */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity onPress={() => {
                                        this.swipeCard("next")
                                    }}>
                                        <Image style={[{}]}
                                            source={
                                                left
                                            }
                                        />
                                    </TouchableOpacity>

                                    <Button
                                        style={[styles.continueBtn1, { padding: 20, minHeight: 50, backgroundColor: colors.THEME_YELLOW, marginLeft: 15, marginRight: 15 }]}
                                        onPress={() => {
                                            this.onDoctorClick(this.state.resulted_rmp[swiperRef.current.state.firstCardIndex])
                                        }}>
                                        <Text style={{ color: colors.LIGHT_COLOR, fontFamily: 'OpenSans-Bold', fontSize: 15, }}>Book Appointment</Text>
                                    </Button>

                                    <TouchableOpacity onPress={() => {
                                        this.swipeCard("back")
                                    }}>
                                        <Image style={[{}]}
                                            source={
                                                right
                                            }
                                        />
                                    </TouchableOpacity>

                                </View>

                            </View>

                        </View>
                    )}

                    {/* <FlatList
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        data={this.state.resulted_rmp}
                        keyExtractor={item => item.iUserId}     //has to be unique   
                        horizontal={false}
                        renderItem={(item) => this._renderMemberList(item)}
                        onEndReached={(info) => {
                            console.log(JSON.stringify(info), "ending.....");
                            // this.searchDoctor();
                            if (!this.onEndReachedCalledDuringMomentum) {
                                console.log(JSON.stringify(info), "end");
                                this.searchDoctor();
                                this.onEndReachedCalledDuringMomentum = true;
                            }
                        }}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    /> */}

                </Container >


            </View>
        );
    }

    swipeCard = (type) => {
        console.log(type);
        console.log(swiperRef);

        if (type == "back") {
            swiperRef.current.swipeRight();
        } else {
            swiperRef.current.swipeLeft();
        }
        // this.forceUpdate();
    }

    /**when swipe the ticket card */
    getSwiper = (text) => {

        return (
            <Swiper
                ref={swiperRef}
                all_job
                cards={this.state.resulted_rmp}
                renderCard={(card) =>
                    this.showCard(card, text)
                }
                swipeBackCard={true}
                cardIndex={0}
                infinite
                backgroundColor={"transparent"}
                stackSize={2}
                stackScale={4}
                swipeRight={res => console.log(res, "swipeRight...")}
                stackSeparation={12}
                keyExtractor={(index) => index.toString()}
                // horizontalSwipe={(this.state.resulted_rmp.length == 0) ? false : true}
                // verticalSwipe={(this.state.resulted_rmp.length == 0) ? false : true}
            >
            </Swiper>
        )
    }



    showCard = (card, text) => {
        console.log(card, "lll")
        return (
            <View style={styles.card}>
                {/**When job length = 0 and swipe count > 0  condition start*/}
                {this.state.resulted_rmp.length == 0 && (
                    <View>
                        <Image style={styles.cardImage} source={no_jobs} />
                        <View style={{ alignItems: 'flex-start', marginLeft: 0, padding: 20, paddingLeft: height < 680 ? 10 : 0, paddingTop: 0, }}>
                            <Text style={{ fontFamily: 'OpenSans-Regular', color: colors.BLACK_TEXT, fontSize: 18, paddingBottom: 8, marginLeft: 5 }}>Sorry, No doctor found with selected Treatment Areas</Text>
                        </View>
                    </View>
                )}
                {/**When job length = 0 and swipe count > 0  condition ends*/}
                {/**When job length > 0   condition start*/}
                {this.state.resulted_rmp.length != 0 && (
                    <View style={{ height: "100%", width: "100%", }}>
                        <Image style={[{ height: "46.5%", width: '100%', resizeMode: "cover", backgroundColor: colors.grey_bg }]}
                            source={{
                                uri: data.profile_picture_url + card.vProfilePicture,
                            }}
                        />
                        {card.vPracticeArea != "" && (
                            <Text style={styles.cardLocation}> <Icon name="pin" style={[styles.memberDesc, { color: colors.danger, fontSize: 18 }]} /> {card.vPracticeArea}</Text>
                        )}
                        <View style={[styles.cardTextConatiner1, { padding: 8, paddingTop: 5, paddingBottom: 20 }]}>
                            <View style={{ flexDirection: 'row', paddingBottom: 2, justifyContent: 'space-between', }}>
                                <Text style={[styles.cardTextTitle, { flex: 1 }]}>{card.vDoctorName}</Text>
                                <View style={{ flex: 0.35 }}>
                                    <Text style={styles.cardTextPrice}>Rs {card.fFirstConsultFee}</Text>
                                    <Text style={{ color: colors.sub_theme }}>{card.iFirstConsultDuration} min call</Text>
                                </View>
                            </View>
                            <View style={{}}>
                                <Text style={[styles.cardTextDescriptionSpec]}>
                                    {card.vSpecialty}
                                </Text>
                                <Text style={[styles.cardTextDescription]}>
                                    {card.vQualification}
                                </Text>
                                <Text style={[styles.cardTextDescriptionReg]}>
                                    Reg. {card.vRegistrationNo}
                                </Text>
                                {card.vBio != null && (
                                    <Text style={[styles.cardTextDescriptionReg, { fontSize: 14, }]}>
                                        {card.vBio}
                                    </Text>
                                )}

                            </View>
                        </View>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 10, paddingTop: 5 }}>
                            {card.dNextAvailability != "Available Today" ? this.getAvailibilityDate(card.dNextAvailability) : <Text style={[styles.memberDesc, { color: colors.geen_txt, fontWeight: 'bold', fontSize: 16 },]}>Available Today </Text>}
                        </View>
                    </View>
                )}
                {/**When job length > 0 and swipe count != mod 15  condition start*/}
            </View>
        );
    };

    /**
    * Search Practitioner
    */
    searchDoctor = () => {
        console.log(parseInt(this.state.iCurrentPage), parseInt(this.state.iMaxPages), "enterr")
        if (parseInt(this.state.iCurrentPage) < parseInt(this.state.iMaxPages)) {


            console.log("Hit paginitionn...", this.state.iCurrentPage);
            var param = {
                treatments: this.props.appt_data.treatments,
                iCurrentPage: parseInt(this.state.iCurrentPage) + 1,
                fLatitude: this.state.vLat,
                fLongitude: this.state.vLng,
            }
            console.log(param);
            postApiRequestWithHeaders(data.api_endpoint.search_doctors, param, this.props.user_data.vAccessToken).then(
                data => {
                    console.log(data, "data111.....", data.resulted_doctors);
                    var resulted_rmp = [...this.state.resulted_rmp, ...data.resulted_doctors];
                    console.log(resulted_rmp, "chck.....")
                    this.setState({
                        resulted_rmp: [...this.state.resulted_rmp, ...data.resulted_doctors],
                        iCurrentPage: data.iCurrentPage
                    }, () => {
                    })

                },
                error => {
                    showToast(error);
                },
            );
        }
    };
}

function mapStateToProps(state) {
    console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData,
        family_member: state.family_member,
        appt_data: state.appointment_booking_data

    }
}
export default connect(mapStateToProps, { setMember })(AvailableRMP);
