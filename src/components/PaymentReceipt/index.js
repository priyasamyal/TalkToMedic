//import liraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import styles from './styles';
import {
    Container,
    Header,
    Left,
    Button,
    Body,
    Right,
    Icon,
    Title,
    CheckBox,
} from 'native-base';
import HeaderComponent from '@components/HeaderComponent';
import { colors, constant, data, user } from '../../common/index';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler, openUrl
} from '../../common/user';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from "react-redux";
// create a component
class PaymentReceipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receipts: [],
            spinner: false,
            showMessage: false
        };
    }
    componentDidMount() {
        this.getPaymentReceipt();
    }
    navigator = (page) => {
        switch (page) {
            case 'next': {
                console.log('next');

                break;
            }
            case 'back': {
                console.log('back');
                // this.props.clickHandler('back');
                this.props.navigation.goBack();
                break;
            }
        }
    }
    getPaymentReceipt = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.payment_receipt, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                this.setState({ receipts: data.receipts });
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true
                });
            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true
                });
            },
        );
    }

    viewReceipt = (item) => {
        //  openUrl('https://www.talktomedic.in/assets/web/user_documents/t2m_invoice_15891811435607861.pdf');
        console.log(item);
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        var param = {
            iAppointmentId: item.iAppointmentId
        }
        postApiRequestWithHeaders(data.api_endpoint.payment_receipt_pdf, param, this.props.user_data.vAccessToken).then(
            res => {
                console.log(res, "data.....");
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true
                });
                setTimeout(() => {
                    openUrl(data.document_url + res.invoice);
                }, 1000);

            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true
                });
            },
        );

    }
    render() {
        return (
            <Container>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.PAYMENT_RECEIPT}></HeaderComponent>

                {this.state.showMessage && this.state.receipts.length == 0 && (
                    <Text style={styles.headingText}>No Payment Receipt Found</Text>
                )}
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.receipts}
                    keyExtractor={item => item.iAppointmentId}  //has to be unique   
                    horizontal={false}
                    renderItem={(item) => this._renderItem(item)}
                />
            </Container>
        );
    }


    _renderItem = (item) => {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                    <Text style={[styles.boldText, styles.normalFontSize, { flex: 1 }]}> {moment(item.dScheduledDate).format("DD-MM-YYYY")} </Text>

                    <Text style={[styles.boldText, styles.normalFontSize, { flex: 1 }]}>  {moment(item.item.dScheduledDate).format("hh:mm A")}</Text>
                </View>

                <Text style={[styles.boldText, styles.largeFontSize, { marginBottom: 5 }]}> Dr {item.item.vDoctorName} {'  |  '} {item.item.eType == "Initial" ? "Initial Consult" : "Follow Up"} </Text>

                <Text style={[styles.normalFont, styles.largeFontSize, { color: colors.sub_theme, marginBottom: 5 }]}>{item.item.vSpecialty}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[styles.largeFontSize, { flex: 1, fontFamily: "OpenSans-Bold", color: colors.THEME_YELLOW }]}> Rs {item.item.fAppointmentFee}</Text>
                    <Button
                        onPress={() => {
                            this.viewReceipt(item.item);
                        }}
                        bordered style={{ flex: 1, justifyContent: 'center', borderColor: colors.danger, }}>
                        <Text style={{ textAlign: 'center', color: colors.danger, fontFamily: "OpenSans-Bold", }}>View Receipt</Text>

                    </Button>
                </View>
            </View>
        )
    }
}


function mapStateToProps(state) {
    return {
        user_data: state.user.userData
    }
}
export default connect(mapStateToProps, {})(PaymentReceipt);
