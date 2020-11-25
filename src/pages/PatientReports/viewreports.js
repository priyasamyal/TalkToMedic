import React, { Component } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList
} from "react-native";
import {
    Container,
    Icon,
    ActionSheet,
    Picker
} from 'native-base';
import HeaderComponent from '@components/HeaderComponent';
import { colors, constant, data, } from '../../common/index';
import styles from './styles';
import Camera from '@components/Camera';
import {
    showToast,
    postApiRequestWithHeaders,
    openUrl
} from "../../common/user";
import { connect } from "react-redux";
import { setMember } from "../../actions";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
const ReportExtenstions = ["jpg", "png", "jpeg", "pdf"];
var { width, height } = Dimensions.get('window');
class ViewReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iFamilyMemberId: 'MySelf',
            reportsData: [],
            reportImage: "",
            detailedView: { id: "", status: false },
            spinner: false
        }
    }

    getAllLabTestReports = async (familyID = "") => {

        let params = familyID ? { iFamilyMemberId: familyID } : {};
        this.setState({
            spinner: !this.state.spinner
        });
        await postApiRequestWithHeaders(data.api_endpoint.getAllLabTestReports, params, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({ reportsData: data.test_report });
                this.state.reportsData.map((m, index) => {
                    console.log(m, index, "mmm");
                    if (index == 0) {
                        console.log(m, index, "mmmindex");
                        return m.isActive = true
                    } else {
                        return m.isActive = false
                    }
                })
                console.log(data, "reportsdata.....");
                this.setState({ reportsData: this.state.reportsData });
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


    navigator = (action, data) => {
        switch (action) {
            case "back":
                this.props.navigation.goBack();
                break;
            default:
                break;
        }
    }

    renderSeparator = () => {
        return (
            <View style={[styles.divider, { borderColor: colors.sub_theme, borderWidth: .7 }]} />
        )
    }

    itemClicked = (item, index) => {
        this.state.reportsData[index].isActive = !this.state.reportsData[index].isActive;
        this.setState({
            reportsData: this.state.reportsData
        })
        console.log(this.state.reportsData, "fdjfjkkj")
    }

    _renderItems = (itemArray, parentArrayIndex) => {
        return (
            <>
                {
                    !itemArray.isActive && (
                        <View style={{ padding: 10, width: width - 50 }}>
                            <TouchableOpacity
                                activeOpacity={.6}
                                onPress={() => {
                                    this.itemClicked(itemArray, parentArrayIndex)
                                }}>
                                <View style={styles.flexRow}>
                                    <Text style={styles.date}>
                                        {moment(itemArray.dScheduledDate).format("ddd")} | {moment(itemArray.dScheduledDate).format("DD-MM-YYYY")}
                                    </Text>

                                    <Icon name="ios-arrow-down" style={styles.arrow_down} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                {
                    itemArray.isActive ? (
                        <View style={styles.uploadContainer}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                ListHeaderComponent={
                                    <View style={styles.flexRow}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.itemClicked(itemArray, parentArrayIndex)
                                            }}
                                            activeOpacity={.6}
                                            style={[styles.flexRow, { paddingRight: 20 }]}>
                                            <Text style={styles.date}>{moment(itemArray.dScheduledDate).format("ddd")} | {moment(itemArray.dScheduledDate).format("DD-MM-YYYY")}</Text>
                                        </TouchableOpacity>
                                        <View style={styles.flexRow}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate("PatientReports",
                                                    {
                                                        onGoBack: () => this.getAllLabTestReports(),
                                                        data: { appointmentId: itemArray.iAppointmentId, reports: itemArray.reports_history, apptDate: itemArray.dScheduledDate, backScreen: "viewAll" }
                                                    })}
                                                style={[styles.flexRow, { paddingRight: 20 }]}>
                                                <Icon style={[styles.editBtn, { fontSize: 22, paddingRight: 5 }]} name="ios-create" />
                                                <Text style={styles.editBtn}>Edit</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                activeOpacity={.6}
                                                onPress={() => {
                                                    this.itemClicked(itemArray, parentArrayIndex)
                                                }}>
                                                <Icon name="ios-arrow-up" style={styles.arrow_down} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                }
                                data={itemArray.reports_history}
                                renderItem={({ item, index }) => this._renderNested(item, index, itemArray.reports_history.length)}
                                keyExtractor={(item, index) => index.toString()}
                                listKey={parentArrayIndex}
                            />
                        </View>
                    ) : null}

            </>
        )
    }

    _renderNested = (item, index, itemArrayLength) => {
        let imageUri = item.eReportType != "pdf" ? { uri: data.document_url + item.vReportFile } : require("../../assets/imgs/pdf_img.png");
        return (
            <>
                {item.eReportType != "pdf" ? (
                    <TouchableOpacity
                        onPress={() => openUrl(data.document_url + item.vReportFile)}>
                        <View style={styles.contentContainer}>
                            <View style={styles.flexRow}>
                                <View style={[styles.flexRow, { width: width / 2.5 }]}>
                                    <Image
                                        resizeMode="cover"
                                        style={styles.reportImage}
                                        source={imageUri} />
                                    <Text style={styles.filenametext}>{item.vReportFile}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ) :
                    (
                        <TouchableOpacity
                            onPress={() => {
                                console.log(data.document_url + item.vReportFile)
                                openUrl(data.document_url + item.vReportFile)
                            }}>
                            <View style={styles.contentContainer}>
                                <View style={styles.flexRow}>
                                    <View style={[styles.flexRow, { width: width / 2.5 }]}>
                                        <Image
                                            resizeMethod="auto"
                                            resizeMode="contain"
                                            style={styles.reportImage}
                                            source={imageUri} />

                                        <Text style={styles.filenametext}>{item.vReportFile}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                }
                {
                    index != itemArrayLength - 1 ? (
                        this.renderSeparator()
                    ) : null
                }
            </>
        )
    }

    componentDidMount() {
        this.getMembers();
        this.getAllLabTestReports();
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

    onValueChange(value) {

        if (value == "MySelf") {
            this.getAllLabTestReports();
        } else {
            this.getAllLabTestReports(value);
        }
        this.setState({
            iFamilyMemberId: value
        });
    }

    render() {

        return (
            <Container>
                <HeaderComponent
                    show_headingCenter={true}
                    show_menu={true}
                    navigation={this.props.navigation}
                    clickHandler={this.navigator} title="Lab/Test Reports" />
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior="automatic"
                    style={{ flex: 1, paddingTop: 5 }}>
                    <View style={{ alignItems: "center", width: "100%" }}>
                        {/* <Text style={styles.noteText}>5 Test/Report can be Uploaded</Text> */}

                        <View style={[styles.numberInputContainerRow, { flex: 1, fontSize: 20 }]}>
                            <Picker
                                note
                                iosIcon={<Icon name="ios-arrow-down" style={{ color: colors.sub_theme, fontSize: 25 }} />}
                                iosHeader="Relations"
                                mode="dropdown"
                                textStyle={[styles.numberInput]}
                                style={[{ width: "100%" }]}
                                selectedValue={this.state.iFamilyMemberId}
                                onValueChange={this.onValueChange.bind(this)}>
                                <Picker.Item label="MySelf" value="MySelf" />
                                {this.props.family_member.map((value, idx) => {
                                    console.log("idsss", idx, value)
                                    return (
                                        <Picker.Item label={value.vFirstName + " (" + value.eRelationType + ")"} value={value.iFamilyMemberId} />
                                    )
                                })}
                            </Picker>
                        </View>

                        <FlatList
                            data={this.state.reportsData}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            renderItem={({ item, index }) => this._renderItems(item, index)}
                            keyExtractor={(item, index) => item.iAppointmentId}
                            ListEmptyComponent={
                                <Text style={[styles.headingText, { textAlign: 'center', marginTop: 50, fontFamily: 'OpenSans-Regular' }]} >No Lab/Test Reports Found.</Text>
                            }
                        />

                    </View>
                </ScrollView>
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        user_data: state.user.userData,
        family_member: state.family_member,
    }
}

export default connect(mapStateToProps, { setMember })(ViewReports);