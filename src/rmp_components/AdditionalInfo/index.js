import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity

} from 'react-native';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import styles from './styles';
import { Text, Textarea, Form, Button, Container } from 'native-base'

const { width: Width } = Dimensions.get('window');
import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import { colors, constant, data } from '../../common/index';
class AdditionalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: '',
            spinner: false
        };
    }

    navigator = (status) => {
        console.log(status);
        switch (status) {
            case "skip":
                this.props.parentCallback(status);
                break;
            case "next":
                if (this.state.info == "") {
                    showToast("Please enter the additional info.")
                } else {
                    this.addInfo(status);
                    // this.props.parentCallback(status, this.state.info);
                }
                break;

            default:
                break;
        }
    }


    addInfo = (status) => {
        this.setState({
            spinner: !this.state.spinner
        });
        var param = {
            iAppointmentId: "25",
            // iAppointmentId: this.props.sessionDetail.iAppointmentId,
            tAdditionalInfo: this.state.info
        }
        postApiRequestWithHeaders(data.api_endpoint.ask_info, param, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data)
                showToast(data.message);
                this.setState({
                    spinner: !this.state.spinner
                });
                this.props.parentCallback(status, this.state.info);
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
    render() {
        return (
            <Container>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    //  style={styles.mainContent}
                    //  contentContainerStyle={styles.mainContent}
                    // contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.mainContainer} >

                        <Text style={styles.headingText}>Request Additional Info</Text>
                        <Text style={styles.subheadingText}>If you need any additional information from Patient, please specify below and we will notify the Patient.</Text>
                        <Textarea rowSpan={8} bordered style={styles.textAreatStyle} value={this.state.info}
                            onChangeText={txt => { this.setState({ info: txt }) }}
                        />

                        <View style={{ marginTop: 20, }}>
                            <Button style={styles.nextButtonContainer}
                                onPress={() => {
                                    this.navigator('next');
                                }} >
                                <Text style={styles.nextButton}>Request Additional Info</Text>
                            </Button>
                        </View>
                        <TouchableOpacity onPress={() => {
                            this.navigator('skip');
                        }}>
                            <Text style={[styles.subheadingText, { textDecorationLine: "underline" }]}>SKIP</Text>
                        </TouchableOpacity>


                    </View>
                </KeyboardAwareScrollView>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    console.log(state, "Verify Number state...")
    return {
        sessionDetail: state.sessionData,
        user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, {})(AdditionalInfo);
