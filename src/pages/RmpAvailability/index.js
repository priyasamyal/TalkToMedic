//import liraries
import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    FlatList,
    Dimensions
} from 'react-native';
import {
    Icon,
    Button,
    Item,
    Picker
} from 'native-base';
import StateListing from '@components/StateListing';
import HeaderComponent from '@components/HeaderComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import DatePicker from 'react-native-datepicker';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
import { connect } from "react-redux";
var { width, height } = Dimensions.get('window');
import moment from 'moment';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';

// create a component
import { setCity, setUserData, apptType } from "../../actions";
import { SafeAreaView } from 'react-native-safe-area-context';

const hitSlop = { top: 5, left: 5, right: 5, bottom: 5 };
class RmpAvailabilty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSlot: "",
            selectedDate: "",
            defaultSlotCount: { count: 6, moreBtnCount: 7 },
            slotCount: [],
            doctor_info: this.props.route.params.doctor_data,
            avalibility: this.props.route.params.doc_avalibility.availability
        }
        console.log(this.props, "props.", this.state.avalibility);
        console.log(this.state.avalibility, "alll")
    }

    navigator = (action, data) => {
        console.log(action, "action....", this.state);
        switch (action) {
            case "next":
                var data = {
                    dTime: this.state.selectedSlot,
                    dScheduledDate: this.state.selectedDate,
                    iUserId: this.state.doctor_info.iUserId,
                    fFirstConsultFee: this.state.doctor_info.fFirstConsultFee,
                    fFollowConsultFee: this.state.doctor_info.fFollowConsultFee,
                    iFirstConsultDuration: this.state.doctor_info.iFirstConsultDuration,
                    iFollowConsultDuration: this.state.doctor_info.iFollowConsultDuration,
                }
                console.log(data)
                this.props.apptType(data);
                this.props.navigation.navigate('ApptOption');
                // this.checkValidations();
                break;
            case "back":
                this.props.navigation.goBack();
                break;
            default:
                break;
        }
    }

    renderMore = (containerIndex, stateIndex = "") => {

        let stateArray = this.state.slotCount;
        var newArray = { count: 14, index: containerIndex, moreBtnCount: 15 };
        if (stateArray.length > 0) {
            stateArray.forEach(function (stateItem, index) {
                console.log(index)
                if (stateItem.index == containerIndex) {
                    newArray = {
                        count: stateItem.count + 8,
                        index: containerIndex,
                        moreBtnCount: stateItem.moreBtnCount + 8
                    }
                    stateArray.splice(index, 1);
                }
            });
        }

        stateArray.push(newArray);

        this.setState({ slotCount: stateArray });
    }

    _renderSubItems = (item, index, date, containerIndex, slotsLength) => {
        let selectedSlot = this.state.selectedSlot;
        let selectedDate = this.state.selectedDate;
        let stateArray = this.state.slotCount;

        let matchedArray = stateArray.find(prod => prod.index === containerIndex);
        if (matchedArray) {
            return (
                index <= matchedArray.count ?
                    selectedSlot === item && selectedDate == date ? (
                        <TouchableOpacity
                            onPress={() => this.setState({ selectedSlot: "", selectedDate: '' })}>
                            <View style={[styles.slotContainer,
                            { backgroundColor: colors.geen_txt, borderColor: colors.geen_txt }]}>
                                <Text style={[styles.slotText, { color: colors.LIGHT_COLOR }]}>
                                    {moment(item, "HH:mm:ss").format("hh:mm A")}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                            <TouchableOpacity
                                onPress={() => this.setState({ selectedSlot: item, selectedDate: date })}>
                                <View style={styles.slotContainer}>
                                    <Text style={styles.slotText}>
                                        {moment(item, "HH:mm:ss").format("hh:mm A")}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    : index == matchedArray.moreBtnCount ? (
                        <TouchableOpacity
                            onPress={() => this.renderMore(containerIndex, matchedArray.index)}>
                            <View style={styles.slotContainer}>
                                <Text style={[styles.slotText, { fontWeight: 'bold' }]}>
                                    More
                            </Text>
                            </View>
                        </TouchableOpacity>
                    ) : null
            )
        }

        return (
            index <= this.state.defaultSlotCount.count ?
                this.state.selectedSlot === item && this.state.selectedDate == date ? (
                    <TouchableOpacity
                        onPress={() => this.setState({ selectedSlot: "", selectedDate: '' })}>
                        <View style={[styles.slotContainer,
                        { backgroundColor: colors.geen_txt, borderColor: colors.geen_txt }]}>
                            <Text style={[styles.slotText, { color: colors.LIGHT_COLOR }]}>
                                {moment(item, "HH:mm:ss").format("hh:mm A")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                        <TouchableOpacity
                            onPress={() => this.setState({ selectedSlot: item, selectedDate: date })}>
                            <View style={styles.slotContainer}>
                                <Text style={styles.slotText}>
                                    {moment(item, "HH:mm:ss").format("hh:mm A")}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                : index == this.state.defaultSlotCount.moreBtnCount ? (
                    <TouchableOpacity
                        onPress={() => this.renderMore(containerIndex)}>
                        <View style={styles.slotContainer}>
                            <Text style={[styles.slotText, { fontWeight: 'bold' }]}>
                                More
                        </Text>
                        </View>
                    </TouchableOpacity>
                ) : null
        )
    }

    _renderItems = (availabiltyDate, containerIndex) => {

        return (
            <View style={{
                // flex: 1,
                paddingRight: 5, paddingLeft: 5, marginBottom: 10,
            }}>
                <View>
                    <FlatList
                        ListHeaderComponent={
                            <View>
                                <View style={styles.flexRow}>
                                    <Text style={styles.headingText}> {moment(availabiltyDate.date).format("ddd, DD MMM")}</Text>
                                    {moment(moment().format("YYYY-MM-DD")).isSame(moment(availabiltyDate.date).format("YYYY-MM-DD")) ? (
                                        <View style={{ padding: 5, backgroundColor: colors.sub_theme, borderRadius: 2, marginLeft: 5 }}>
                                            <Text style={{ fontFamily: "OpenSans-Regular", color: colors.LIGHT_COLOR, fontSize: 12 }}>
                                                Today
                                            </Text>
                                        </View>
                                    ) : null}
                                </View>
                                {availabiltyDate.slots.length == 0 ? <Text style={[styles.headingText, { textAlign: 'center', color: colors.danger, paddingTop: 10 }]}>Not Available </Text> : <View></View>}
                            </View>
                        }
                        keyExtractor={(item, index) => item + index}
                        scrollEnabled={true}
                        ref={myScroll => (this._myScroll = myScroll)}
                        // maxHeight={150}
                        // style={{ height: 200 }}
                        marginBottom={5}
                        contentContainerStyle={{ flex: 1 }}
                        data={availabiltyDate.slots}
                        numColumns={4}
                        renderItem={({ item, index }) => (

                            this._renderSubItems(item, index, availabiltyDate.date, containerIndex, availabiltyDate.slots.length)


                        )}
                        listkey={containerIndex}
                    />
                </View>
            </View>
        )
    }

    getAvailibilty = (type) => {
        var param = {
            iUserId: this.state.doctor_info.iUserId,
            dRmpAvailDate: type == "next" ? moment(this.state.avalibility.slots[this.state.avalibility.slots.length - 1].date).add(1, 'days').format("DD-MM-YYYY") : moment(this.state.avalibility.slots[0].date).add(-7, 'days').format("DD-MM-YYYY"),
            eRequestType: "next"
        }
        postApiRequestWithHeaders(data.api_endpoint.doctor_availibility, param, this.props.user_data.vAccessToken).then(data => {
            console.log(data, "data.....");
            this.setState({
                avalibility: data.availability
            })
        },
            error => {
                showToast(error);
            },
        );
        console.log(param)
    }


    render() {
        return (
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                nestedScrollEnabled={true}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
            // style={{ flex: 1 }}
            >
                <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={"Select Availability"}></HeaderComponent>
                <View style={styles.mainContainer}>
                    <View style={[styles.subContainer, { borderBottomWidth: 1, flex: 1, width: width, borderColor: colors.BORDER_COLOR, }]}>
                        <View style={[styles.flexRowSpace, { marginBottom: 20, marginTop: 5 }]}>
                            <View style={{ borderRadius: 50, paddingLeft: 20, }}>
                                <Image
                                    source={{
                                        uri: data.profile_picture_url + this.state.doctor_info.vProfilePicture,
                                    }}
                                    style={[styles.profileContainer, {
                                        resizeMode: 'contain',
                                        height: 55, width: 55
                                    }]}
                                />
                            </View>
                            <View style={styles.drDetails}>
                                <Text style={styles.DrName}>{this.state.doctor_info.vDoctorName}</Text>
                                <Text style={styles.headingInfoText}>{this.state.doctor_info.vSpecialty}</Text>

                                <Text style={styles.headingInfoText}>{this.state.doctor_info.vQualification}</Text>
                                <Text style={styles.headingInfoText}>Reg. No. {this.state.doctor_info.vRegistrationNo}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[{ flex: 1, marginTop: 0, marginLeft: 5, marginRight: 15, padding: 20 }]}>
                        <Text style={[styles.headingInfoText, { fontSize: 15, marginBottom: 20, }]}>Displaying Availability For</Text>
                        <View style={[styles.flexRowSpace, { justifyContent: "space-between" }]}>
                            <Text style={styles.headingDateText}>{moment(this.state.avalibility.slots[0].date).format("DD MMM")} - {moment(this.state.avalibility.slots[this.state.avalibility.slots.length - 1].date).format("DD MMM")}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                {moment(moment().format("YYYY-MM-DD")).isSame(moment(this.state.avalibility.slots[0].date).format("YYYY-MM-DD")) == false && (
                                    <TouchableOpacity
                                        transparent
                                        hitSlop={hitSlop}
                                        style={{ marginRight: 20 }}
                                        onPress={() => { this.getAvailibilty("prev") }}>
                                        <Icon
                                            style={[
                                                styles.black_text,
                                            ]}
                                            name="ios-arrow-back"
                                        />
                                    </TouchableOpacity>
                                )}


                                <TouchableOpacity
                                    transparent
                                    hitSlop={hitSlop}
                                    style={{}}
                                    onPress={() => { this.getAvailibilty("next") }}>
                                    <Icon
                                        style={[
                                            styles.black_text,
                                        ]}
                                        name="ios-arrow-forward"
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>
                        <Text style={styles.headingSubInfoText}>Choose a time slot with {this.state.doctor_info.vDoctorName} that work for you</Text>
                    </View>
                    <View style={{ padding: 20, paddingTop: 0 }}>

                        <FlatList
                            nestedScrollEnabled={true}
                            // contentContainerStyle={{ flex: 1 }}
                            data={this.state.avalibility.slots}
                            renderItem={({ item, index }) => (
                                this._renderItems(item, index)
                            )}
                            // maxHeight={150}
                            keyExtractor={(item, index) => item.day + index}
                            ListFooterComponent={
                                this.state.slotCount.length > 0 && this.state.selectedSlot ? (
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ slotCount: [] })}
                                            style={{ padding: 6, alignItems: 'flex-end' }}>
                                            <View style={[styles.slotContainer, { backgroundColor: colors.geen_txt, borderColor: colors.geen_txt, width: 100 }]}>
                                                <Text style={[styles.slotText, { color: colors.LIGHT_COLOR, fontSize: 15, width: 100, textAlign: 'center' }]}>
                                                    Show Less
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View
                                            style={{ marginTop: 15, }}>
                                            <Button style={styles.nextButtonContainer}
                                                onPress={() => {
                                                    this.navigator('next');
                                                }} >
                                                <Text style={styles.nextButton}>Next</Text>
                                            </Button>
                                        </View>
                                    </View>
                                ) :
                                    this.state.slotCount.length > 0 && !this.state.selectedSlot ? (
                                        <TouchableOpacity
                                            onPress={() => this.setState({ slotCount: [] })}
                                            style={{ padding: 6, alignItems: 'flex-end' }}>
                                            <View style={[styles.slotContainer, { backgroundColor: colors.geen_txt, borderColor: colors.geen_txt, width: 100 }]}>
                                                <Text style={[styles.slotText, { color: colors.LIGHT_COLOR, fontSize: 15, width: 100, textAlign: 'center' }]}>
                                                    Show Less
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) : this.state.slotCount.length <= 0 && this.state.selectedSlot ? (
                                        <View
                                            style={{ marginTop: 15, }}>
                                            <Button style={styles.nextButtonContainer}
                                                onPress={() => {
                                                    this.navigator('next');
                                                }} >
                                                <Text style={styles.nextButton}>Next</Text>
                                            </Button>
                                        </View>
                                    ) : null
                            }
                        />
                    </View>

                </View>
            </ScrollView>
        );
    }
}



function mapStateToProps(state) {
  //  console.log(state, "state,,,,,")
    return {
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, { setUserData, apptType })(RmpAvailabilty);
