//import liraries
import React, { Component } from 'react';
import { View, Text, FlatList, KeyboardAvoidingView, TextInput, TouchableOpacity, Image, Clipboard, Dimensions, Keyboard } from 'react-native';
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
var { width, height } = Dimensions.get('window');
import moment from 'moment';
import HeaderComponent from '@components/HeaderComponent';
import DatePicker from 'react-native-datepicker';
import { colors, constant, data } from '../../common/index';
import SegmentedControlTab from "react-native-segmented-control-tab";
import styles from './styles';
import RefundPopUp from '@rmp_components/RefundPopUp';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
// create a component//e10adc3949ba59abbe56e057f20f883e
class ConsultationFee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fees: [],
            spinner: false,
            showUpcomingMessage: false,
            showLogoutPopUp: false,
            vTransactionId: '',
            fRefundAmount: 'dfg',
            timer: {
                days: '0',
                hours: '0',
                minutes: '0',
                seconds: '0'
            }
        };
    }

    componentDidMount() {
        this.getAppointments();
    }
    getAppointments = () => {
        console.log(this.props.user_data.iUserId, "ids....s")
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.consultation_fees, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.setState({
                    fees: data.fees,

                    showUpcomingMessage: true
                })
                this.setState({
                    spinner: !this.state.spinner
                });
            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'errorrrrrr');
            },
        );
    }
    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };

    buttonAction = (status, data) => {
        console.log(status, data);
        switch (status) {
            case "cancel":
                break;

            case "refund":
                this.getRefundAmount(data);

            default:
                break;
        }
    }

    getRefundAmount = (param) => {
        var param = {
            vTransactionId: param.vTransactionId
        }
        console.log(param, "param....s")
        //  return false;
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        console.log(data.api_endpoint.max_refund_amount, param, "API_URL");
        postApiRequestWithHeaders(data.api_endpoint.max_refund_amount, param, this.props.user_data.vAccessToken).then(
            res => {
                console.log(res, res.fRefundAmount, "data.....");
                if (!res.fRefundAmount) {
                    showToast("Can't initiate refund as refund amount is 0.");
                } else {
                    this.setState({
                        vTransactionId: param.vTransactionId,
                        fRefundAmount: res.fRefundAmount.toString(),
                        showLogoutPopUp: true,

                    })
                }

                // console.log(this.state)
                this.setState({
                    spinner: !this.state.spinner
                });
            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'errorrrrrr');
            },
        );
    }

    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');
                break;
            }
            case 'back': {
                console.log('back');
                this.props.clickHandler('back');
                break;
            }
        }
    }
    popUpClick = (status, amount) => {
        console.log(status, "status....");
        this.setState({ showLogoutPopUp: !this.state.showLogoutPopUp })
        switch (status) {
            case "logout":
                this.logOutApiCall();
                clearLocalStorage('user_details').then(data => {
                    this.props.removeUser();
                    this.logOutApiCall();
                    console.log(data, "remove key")
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'EnterPhoneNumber' }],
                    });

                });
                Keyboard.dismiss();
            case "partial":
                console.log("partial refund", amount);
                this.refundAmount("partial", amount)
                Keyboard.dismiss();
                break;

            default:
                Keyboard.dismiss();
                break;
        }

    }

    refundAmount = (type, amount) => {
        var param = {
            vTransactionId: this.state.vTransactionId,
            fRefundAmount: amount
        }
        console.log(param);
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.refund, param, this.props.user_data.vAccessToken).then(
            data => {
                showToast(data.message);
                this.props.clickHandler('back');
                console.log(data, "data.....");
                this.setState({
                    spinner: !this.state.spinner
                });
            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'errorrrrrr');
            },
        );

    }

    _renderItem = (item) => {
        return (

            <View style={{
                borderBottomWidth: 1, paddingBottom: 20, paddingTop: 5, borderColor: colors.PLACEHOLDER_TEXT,
            }}>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <Text style={styles.secondRow}>{moment(item.item.dScheduledDate).format("DD-MM-YYYY")}</Text>
                    </View>
                    <View>
                        <Text style={styles.secondRow}>{moment(item.item.dScheduledDate).format("hh:mm A")}</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 2 }]}>
                        <Text style={styles.secondRow}>{item.item.vPatientName}</Text>
                    </View>
                    <View >
                        <Text style={styles.secondRow}>{item.item.eMode} Call</Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={styles.thirdRowContainer}>
                        <Text style={styles.thirdRow}>{item.item.iAge}, {item.item.eGender}</Text>
                    </View>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <Text style={styles.thirdRow}>{item.item.eType == "Initial" ? "Initial Consult" : "Follow Up"} </Text>
                    </View>

                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <Text style={styles.secondRow}>Transaction ID </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <Text style={styles.thirdRow}>{item.item.vTransactionId}</Text>
                    </View>
                    <View style={[styles.thirdRowContainer, { borderRightWidth: 0 }]}>
                        <TouchableOpacity onPress={() => Clipboard.setString(item.item.vTransactionId)}>
                            <Text style={[styles.secondRow, { textDecorationLine: "underline" }]}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Text style={[styles.secondRow, { color: colors.THEME_YELLOW, }]}>Rs {item.item.fAppointmentFee}</Text>
                    {item.item.vRefundId == "" && item.item.bCanRefund && (
                        <Button bordered onPress={() => this.buttonAction("refund", item.item)} block light style={{ borderColor: colors.danger }}>
                            <Text style={styles.btnText} >Refund</Text>
                        </Button>
                    )}
                    {item.item.vRefundId == "" && !item.item.bCanRefund && (
                        <Text style={styles.btnText} ></Text>
                    )}
                    {item.item.vRefundId != "" && (
                        <Button bordered block light style={{ borderColor: colors.THEME_YELLOW }}>
                            <Text style={[styles.btnText, { color: colors.THEME_YELLOW }]} >Already Refunded</Text>
                        </Button>

                    )}

                </View>
            </View>

        )
    }


    render() {
        return (
            <Container>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                {this.state.showLogoutPopUp && (
                    <View style={{
                        zIndex: 10,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: width,
                        // height: height,
                    }}>
                        <RefundPopUp
                            clickHandler={this.popUpClick}
                            amount={this.state.fRefundAmount}
                            title="Refund" msg="Select Refund Type"></RefundPopUp>
                    </View>
                )}
                <HeaderComponent
                    show_menu={true}
                    clickHandler={this.navigator}
                    navigation={this.props.navigation}
                    title={constant.page_titles.CONSULTATION_FEE}></HeaderComponent>

                <View style={styles.container}>

                    <View style={styles.mainContainer}>
                        {this.state.showUpcomingMessage && this.state.fees.length == 0 && (
                            <Text style={[styles.headingText, { fontFamily: 'OpenSans-Regular' }]}>No Result Found</Text>
                        )}
                        <FlatList
                            style={{ marginBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                            data={this.state.fees}
                            keyExtractor={item => item.id}
                            horizontal={false}
                            renderItem={(item) => this._renderItem(item)}
                        />
                    </View>
                </View>
            </Container>
        );
    }
}



function mapStateToProps(state) {
    console.log(state, "Verify Number state...")
    return {
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, {})(ConsultationFee);
