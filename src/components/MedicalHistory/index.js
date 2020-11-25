//import liraries
import React, { Component } from 'react';
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
    Toast, Picker
} from 'native-base';
import HeaderComponent from '@components/HeaderComponent';
import { colors, constant, data } from '../../common/index';
import styles from './styles';
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
const history = [{
    eRelationType: "Father",
    iAge: 10,
    eGender: "Male",
    iFamilyMemebrId: "1",
    patient_history: [{
        dScheduledDate: "2020-03-19 13:19:36",
        id: '1'
    },
    {
        dScheduledDate: "2020-03-19 13:19:36",
        id: '2'
    }]
},

{
    eRelationType: "Mother",
    iAge: 30,
    eGender: "Feale",
    iFamilyMemebrId: "2",
    patient_history: [{
        dScheduledDate: "2020-03-19 13:19:36",
        id: '2'
    }]
}
]
class MedicalHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iFamilyMemberId: history[0],
            currentRelationIndex: 0,
            history: [],
            selectedMember: {},
            spinner: false,
            showMessage: false
        };
    }

    componentDidMount() {
        console.log("history props", this.props);
        if (this.props.rmp_prescription_data != undefined) {
            if (this.props.rmp_prescription_data.from == "account") {
                this.medicalHistory();
            } else {
                this.viewMedicalHistoryByRmp();
            }
        } else {
            this.medicalHistory();
        }


    }
    navigator = (page, data) => {
        switch (page) {
            case 'next': {
                console.log('next', data);
                this.props.navigation.push('CommonPage', { type: 'prescription', prescData: { iAppointmentId: data.iAppointmentId, from: "dashboard" } });
                // this.props.clickHandler('move_prescription', data);
                //   this.props.navigation.navigate('CommonPage', { type: 'change_password' });
                break;
            }
            case 'back': {
                console.log('back');
                this.props.clickHandler('back');
                // console.log(this.props.navigation, 'navigationnn');
                // this.props.navigation.state.params.onGoBack();
                // this.props.navigation.goBack();
                break;
            }
        }
    }

    viewMedicalHistoryByRmp = () => {
        var param = {
            iPatientId: this.props.rmp_prescription_data.data.iPatientId,
            iAppointmentId: this.props.rmp_prescription_data.data.iAppointmentId
        }
        console.log(param)
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.folloUpHistory, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                if (data.patient_info.length > 0) {
                    this.setState({
                        history: data.patient_info,
                        selectedMember: data.patient_info[0],
                    })
                    this.state.history[0].patient_history.map((m, index) => {
                        console.log(m, index, "mmm");
                        if (index == 0) {
                            return m.isActive = true
                        } else {
                            return m.isActive = false
                        }
                    })
                }
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true,
                    history: this.state.history
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
    medicalHistory = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        postApiRequestWithHeaders(data.api_endpoint.medical_history, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "data.....");
                if (data.patient_info.length > 0) {
                    this.setState({
                        history: data.patient_info,
                        selectedMember: data.patient_info[0],
                    })
                    this.state.history[0].patient_history.map((m, index) => {
                        console.log(m, index, "mmm");
                        if (index == 0) {
                            return m.isActive = true
                        } else {
                            return m.isActive = false
                        }
                    })
                }
                this.setState({
                    spinner: !this.state.spinner,
                    showMessage: true,
                    history: this.state.history
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
    onFamilyMemberChange = (value) => {
        console.log(value)
        console.log(this.state.history.indexOf(value));
        this.setState({
            selectedMember: value,
            currentRelationIndex: this.state.history.indexOf(value)
        });
        if (this.state.history.indexOf(value) > -1) {
            this.state.history[this.state.history.indexOf(value)].patient_history.map((m, index) => {
                console.log(m, index, "mmm");
                if (index == 0) {
                    return m.isActive = true
                } else {
                    return m.isActive = false
                }
            })
        }
        console.log(this.state)
        this.setState({ history: this.state.history });

        console.log(this.state, ":state.....")
    }

    itemClicked = (item, index) => {
        this.state.history[this.state.currentRelationIndex].patient_history[index].isActive = !this.state.history[this.state.currentRelationIndex].patient_history[index].isActive;
        this.setState({
            history: this.state.history
        })
        console.log(this.state.history)
    }

    render() {

        return (
            <Container>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <HeaderComponent
                    show_headingCenter={true}
                    show_menu={true}
                    clickHandler={this.navigator}
                    navigation={this.props.navigation}
                    title={constant.page_titles.MEDICAL_HISTORY}></HeaderComponent>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContainer}>
                        {this.state.showMessage && this.state.history.length == 0 && (
                            <Text style={[styles.headingText, { textAlign: 'center', marginTop: 50, fontFamily: "OpenSans-Regular" }]}>No Medical History Found</Text>
                        )}
                        {this.state.history.length > 0 && (
                            <View style={{ flex: 1, }}>
                                <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                    <Picker
                                        enabled={this.props.hasOwnProperty("rmp_prescription_data") && this.props.rmp_prescription_data != undefined ? this.props.rmp_prescription_data.from == "account" ? true : false : true}
                                        note
                                        iosIcon={<Icon name="ios-arrow-down" style={{ color: colors.sub_theme, fontSize: 25, }} />}
                                        iosHeader="Relations"
                                        mode="dropdown"
                                        textStyle={[styles.numberInput]}
                                        style={[{ width: "100%", paddingLeft: 10 }]}
                                        selectedValue={this.state.selectedMember}
                                        onValueChange={value => { this.onFamilyMemberChange(value) }}
                                    >
                                        {this.state.history.map((value, idx) => {
                                            console.log(this.state.history, "kk")
                                            return (
                                                <Picker.Item label={value.eRelationType == null ? "My Self" + " | " + value.iAge + " | " + value.eGender : value.eRelationType + " | " + value.iFamilyMemberAge + " | " + value.iFamilyMemberGender} value={value} />
                                            )
                                        })}
                                    </Picker>
                                </View>

                                {
                                    this.state.history[this.state.currentRelationIndex].patient_history.map((value, idx) => {
                                        return (
                                            this._renderItem(value, idx)
                                        )
                                    })
                                }


                            </View>
                        )}

                    </View>
                </ScrollView>
            </Container>
        );
    }

    getBMIValue(vHeightFeet, vHeightInch, vWeight) {
        var feetVariable = parseInt(vHeightFeet)
        var inchesVaraiable = parseInt(vHeightInch)
        var weightVariable = parseInt(vWeight);
        if (this.state.vWeight == '') {
            return " "
        }
        else {

            var meterSquare = [((feetVariable * 12) + inchesVaraiable) / 39.37] * [((feetVariable * 12) + inchesVaraiable) / 39.37]
            var bmiValueVariable = weightVariable / meterSquare
            return bmiValueVariable.toFixed(2);
        }
    }
    _renderItem = (item, index) => {
        console.log(item, index)
        return (
            <View style={[styles.dateContainer, {}]}>
                <View style={[styles.dateInnerContainer, !item.isActive ? { borderWidth: 0 } : {}]}>
                    <TouchableOpacity onPress={() => {
                        this.itemClicked(item, index);
                    }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={[styles.headingText, { marginTop: 0 }]}>{moment(item.dScheduledDate).format("ddd")} | {moment(item.dScheduledDate).format("DD-MM-YYYY")}</Text>
                            <Icon
                                style={[{
                                    alignSelf: 'center',
                                    color: colors.PLACEHOLDER_TEXT,
                                    paddingRight: 5
                                }]}
                                name='ios-arrow-down' />

                        </View>
                    </TouchableOpacity>

                    {item.isActive && (
                        <View>
                            <Text style={[styles.headingSubText, { padding: 5 }]}> Dr.{item.vDoctorName}  | {item.eType == "Initial" ? "Initial Consult" : "Follow Up"} </Text>
                            <Text style={[styles.headingSubText, { padding: 5 }]}> H: {item.vHeightFeet}' {' '}{item.vHeightInch}"  |  W: {item.vWeight}  |  LMP: {item.dLmpDate != null ? moment(item.dLmpDate).format("DD-MM-YYYY") : '---'} </Text>

                            <Text style={[styles.headingSubText, { padding: 5 }]}> BMI: {this.getBMIValue(item.vHeightFeet, item.vHeightInch, item.vWeight)}  |  BP: {item.vBloodPressure}.  |  Temp: {item.vBodyTemp} </Text>
                            <Text style={[styles.headingText, {}]}>SPECIAL INSTRUCTIONS</Text>
                            <Text style={[styles.longText, {}]}>{item.tSpecialInstructions}</Text>

                            <Text style={[styles.headingText, { color: colors.THEME_YELLOW }]}>CHIEF COMPLAINTS</Text>
                            <Text style={[styles.longText, {}]}>{item.tChiefComplaints}</Text>

                            <Text style={[styles.headingText, { color: colors.sub_theme }]}>RELEVANT HISTORY</Text>
                            <Text style={[styles.longText, {}]}>{item.tRelevantHistory}</Text>

                            <Text style={[styles.headingText, { color: colors.THEME_YELLOW }]}>EXAMINATION/ LAB FINDINGS</Text>
                            <Text style={[styles.longText, {}]}>{item.tExaminationLabTest}</Text>

                            <Text style={[styles.headingText, { color: colors.sub_theme }]}>SUGGESTED INVESTIGATIONS</Text>
                            <Text style={[styles.longText, {}]}>{item.tSuggestedInvestigation}</Text>

                            <Text style={[styles.headingText, { color: colors.THEME_YELLOW }]}>DIAGNOSIS/ PROVISIONAL DIAGNOSIS</Text>
                            <Text style={[styles.longText, {}]}>{item.tDiagnosis}</Text>

                            <View style={{ marginTop: 30, }}>
                                <Button style={styles.nextButtonContainer}
                                    onPress={() => {
                                        this.navigator('next', item);
                                    }} >
                                    <Text style={styles.nextButton}>VIEW PRESCRIPTION</Text>
                                </Button>
                            </View>
                        </View>
                    )}
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
export default connect(mapStateToProps, {})(MedicalHistory);
