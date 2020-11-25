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
    Container, Icon,
} from 'native-base';
import HeaderComponent from '@components/HeaderComponent';
import { colors, constant, data, } from '../../common/index';
import styles from './styles';
import Camera from '@components/ReportsCamera';
import {
    showToast,
    postApiRequestWithHeaders,
    openUrl
} from "../../common/user";
import { connect } from "react-redux";
import moment from 'moment';
import { setUserData } from "../../actions";
import { cos } from "react-native-reanimated";
import CommonPopUp from '@components/CommonPopUp';
import Spinner from 'react-native-loading-spinner-overlay';
const ReportExtenstions = ["jpg", "png", "jpeg", "pdf"];
var { width, height } = Dimensions.get('window');
const maxCount = 5;
class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appointmentID: this.props.route.params.data.appointmentId,
            reportsData: this.props.route.params.data,
            userRole: this.props.route.params.data.role ? this.props.route.params.data.role : 1,
            reportsByAppt: "",
            showCamera: false,
            showUploadArea: false,
            uri: '',
            image_data: {},
            spinner: false,
            showDeletePopUp: false,
            deletedItemId: "",
            maxReportsCount: maxCount
        }
    }

    getLabTestReports = async () => {

        let params = { iAppointmentId: this.state.reportsData.appointmentId };
        postApiRequestWithHeaders(data.api_endpoint.getLabTestReport, params, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "dtyjas")
                this.setState({
                    reportsData: {
                        appointmentId: this.state.reportsData.appointmentId,
                        reports: data.test_report.length > 0 ? data.test_report[0].reports_history : "",
                        apptDate: data.test_report.length > 0 ? data.test_report[0].dScheduledDate : "",
                    }
                });
                console.log(data, "reportsDD....");
            },
            error => {
                showToast(error);
                console.log(error, 'errorrrrrr');
            },
        );
    }

    componentDidMount() {
        console.log(this.state.reportsData);
        console.log(this.state.reportsData.appointmentId, "dfjdk")
        // if (!this.state.reportsData.reports) {
        this.getLabTestReports();
        // }
    }

    openCamera = () => {
        console.log("aiiiidd", this.state.appointmentID)
        this.setState({ showCamera: true })
    }

    navigator = (action, data) => {
        switch (action) {
            case "back":
                if (this.props.route.params.data.backScreen) {
                    this.props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'MyAccount', params: { type: 'ViewPatientReports' } }],
                    })
                } else {
                    this.props.navigation.goBack();
                }
                break;
            case "camera_click":
                console.log(data, "cameraData");
                let reportsArray = [];

                if (Array.isArray(data)) {
                    data.forEach(element => {
                        reportsArray.push({
                            iReportID: "",
                            vReportFile: element.uri,
                            eReportType: "image",
                        })
                    });
                } else {
                    reportsArray.push({
                        iReportID: "",
                        vReportFile: data.uri,
                        eReportType: "image",
                    })
                }

                this.setState({ showCamera: false, uri: data.uri, image_data: data.full_object });
                this.submitReport(reportsArray);
                // let filename = data.full_object.filename;
                // let filenameArray = filename.split(".");

                // if (!ReportExtenstions.find(ext => ext == filenameArray[1].toLowerCase())) {
                //     this.setState({ showCamera: false })
                //     showToast("Only JPEG, JPG, PNG, PDF documents are allowed.");
                //     return;
                // }

                // this.setState({ showCamera: false, });

                break;
            case "back_camera":
                this.setState({ showCamera: false })
                break;
            default:
                break;
        }
    }

    submitReport = (reprotsArray, type = "") => {
        this.setState({ spinner: true });
        let reportData = {
            iAppointmentId: this.state.reportsData.appointmentId,
            reports: reprotsArray
        };

        console.log(reportData, "reshdjf")

        postApiRequestWithHeaders(data.api_endpoint.saveReports, reportData, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "reportSubmissionData");
                this.getLabTestReports();
                // this.setState({
                //     reportsData: {
                //         appointmentId: this.state.reportsData.appointmentId,
                //         reports: data,
                //         apptDate: this.state.reportsData.apptDate
                //     }
                // });
                this.setState({ spinner: false });
            },
            error => {
                console.log(error, 'errorrrrrr');
                this.setState({ spinner: false });
            },
        );
    }

    deleteReportItem = (reportID) => {

        let reportIndex = this.state.reportsData.reports.findIndex(obj => obj.iReportID === reportID);

        let params = {
            iReportID: reportID
        };
        this.setState({ spinner: true });
        postApiRequestWithHeaders(data.api_endpoint.deleteLabTestReport, params, this.props.user_data.vAccessToken).then(
            data => {
                let reportsArray = this.state.reportsData.reports;
                reportsArray.splice(reportIndex, 1);
                reportsArray = reportsArray.length > 0 ? reportsArray : "";
                this.setState({
                    reportsData: {
                        appointmentId: this.state.reportsData.appointmentId,
                        reports: reportsArray,
                        apptDate: this.state.reportsData.apptDate
                    }
                })
                this.setState({ spinner: false });
                showToast(data.message);
                console.log(data, "deleteData");
            },
            error => {
                showToast(error);
                this.setState({ spinner: false });
                console.log(error, 'errorrrrrr');
            },
        );
    }

    _renderItems = (item, index, arrayLength) => {
        console.log(constant.ROLE_PATIENT, this.state.userRole, "length")
        let imageUri = item.eReportType != "pdf" ? { uri: data.document_url + item.vReportFile } : require("../../assets/imgs/pdf_img.png");
        return (
            <>
                <View style={styles.contentContainer}>
                    <View style={styles.flexRow}>
                        <TouchableOpacity
                            onPress={() => {
                                openUrl(data.document_url + item.vReportFile)
                            }}>
                            <View style={[styles.flexRow, { width: width / 2.5 }]}>
                                <Image resizeMode="cover" style={styles.reportImage} source={imageUri} />
                                <Text style={styles.filenametext}>{item.vReportFile}</Text>
                            </View>
                        </TouchableOpacity>
                        {this.state.userRole == constant.ROLE_PATIENT ? (
                            <TouchableOpacity
                                onPress={() =>
                                    this.setState({
                                        showDeletePopUp: true,
                                        deletedItemId: item.iReportID
                                    })
                                    // this.deleteReportItem.bind(this, item.iReportID)
                                }>
                                <Icon name="close-circle-outline" style={styles.removeIcon} />
                            </TouchableOpacity>
                        ) : null}
                    </View>
                </View>
                {
                    index != arrayLength - 1 ? (
                        <View style={styles.divider}></View>
                    ) : null
                }
            </>
        )
    }

    addMore = () => {
        if (this.state.reportsData.reports.length >= 5) {
            showToast("Max. five reports can be added.");
            return;
        }
        this.setState({
            maxReportsCount: maxCount - this.state.reportsData.reports.length
        })

        this.setState({ showCamera: true });
        // this.setState({ showUploadArea: true })
    }

    popUpClick = (status) => {
        console.log(status, "status.....");
        this.setState({ showDeletePopUp: !this.state.showDeletePopUp })
        switch (status) {
            case "delete":
                this.deleteReportItem(this.state.deletedItemId);
                break;

            default:
                break;
        }

    }

    render() {
        console.log(this.state.reportsData, "fdhsj")
        return (
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
                        <CommonPopUp clickHandler={this.popUpClick} title="Delete" msg="Are you sure you want to delete this report?"></CommonPopUp>
                    </View>
                )}
                {!this.state.showCamera && (
                    <>
                        <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title="Lab/Test Reports" />
                        <Spinner
                            color={colors.sub_theme}
                            visible={this.state.spinner}
                            textContent={''}
                        />
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentInsetAdjustmentBehavior="automatic"
                            style={{ flex: 1, paddingTop: 10 }}>
                            <View style={{ alignItems: "center", width: "100%", paddingBottom: 20 }}>
                                {this.state.userRole == constant.ROLE_PATIENT && (
                                    <Text style={styles.noteText}>5 Test Report can be Uploaded</Text>
                                )}
                                {this.state.reportsData.reports ? (
                                    <>
                                        {this.state.userRole == constant.ROLE_PATIENT && (
                                            <View style={{ alignItems: "flex-end", width: width - 40, marginTop: 30 }}>
                                                <TouchableOpacity
                                                    onPress={this.addMore.bind(this)}
                                                    style={[styles.flexRow, {}]}>
                                                    <Icon name="add-circle" style={[styles.addMore, { fontSize: 26, paddingRight: 5 }]} />
                                                    <Text style={styles.addMore}>Add More</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        <View style={{ paddingBottom: 30 }}>
                                            <View style={[styles.uploadContainer]}>
                                                <FlatList
                                                    ListHeaderComponent={
                                                        <View style={styles.flexRow}>
                                                            <Text style={styles.date}>{moment(this.state.reportsData.apptDate).format("ddd")} | {moment(this.state.reportsData.apptDate).format("DD-MM-YYYY")}</Text>
                                                            {/* <Icon name="ios-arrow-down" style={styles.arrow_down} /> */}
                                                        </View>
                                                    }
                                                    data={this.state.reportsData.reports}
                                                    renderItem={({ item, index }) => this._renderItems(item, index, this.state.reportsData.reports.length)}
                                                    keyExtractor={(item, index) => index.toString()}
                                                />
                                            </View>
                                        </View>
                                    </>
                                ) : null}
                                {this.state.userRole == constant.ROLE_PATIENT && (

                                    !this.state.reportsData.reports ? (
                                        <View style={{ alignItems: "center" }}>
                                            <View style={styles.uploadContainer}>
                                                <TouchableOpacity
                                                    onPress={() => this.openCamera()}
                                                    style={[styles.flexRow, { justifyContent: "space-evenly" }]}>
                                                    <View>
                                                        <Image source={require("../../assets/imgs/uploadReport.png")} style={styles.uploadImag} />
                                                    </View>
                                                    <View style={{ alignItems: "flex-start" }}>
                                                        <Text style={styles.uploadText}>Upload Lab</Text>
                                                        <Text style={styles.uploadText}>Test/Report</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View>
                                                <Text style={styles.noteSubText}>Only JPEG, PNG & PDF files</Text>
                                            </View>
                                        </View>
                                    ) : null

                                )}
                            </View>
                        </ScrollView>
                    </>
                )}
                {this.state.showCamera && (
                    <Camera
                        multiple={true}
                        maxCount={this.state.maxReportsCount}
                        current_image_selection="reports"
                        getImageUri={this.navigator}
                        backButton={this.navigator}
                    ></Camera>
                )}
            </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        user_data: state.user.userData,

    }
}

export default connect(mapStateToProps, {})(Reports);