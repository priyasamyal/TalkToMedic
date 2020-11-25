//import liraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import styles from './styles';
import Slider from 'react-native-slider';
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
import { colors, constant, data } from '../../common/index';
// create a component
import { connect } from "react-redux";
const frown = require('../../assets/imgs/frown.png');
const green_frown = require('../../assets/imgs/smile_green.png');
const average = require('../../assets/imgs/average.png');
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';
class Rating extends Component {
    state = {
        value: 3,
    };

    /**
   * update rating value when chnaged
   */
    sliderValueChange(value) {
        console.log(value, 'value.....');
        this.setState({ value });
        console.log(this.state, "chnage state....")
    }

    /**
 * Get dynamic rating button color based on rating value
 */
    getBtnColor() {
        if (this.state.value == 1) {
            return colors.sub_theme;
        } else if (this.state.value == 2) {
            return colors.THEME_YELLOW;
        } else {
            return colors.danger;
        }
    }

    /**
 * Get dynamic rating image based on rating value
 */
    getImg() {
        if (this.state.value == 1) {
            return frown;
        } else if (this.state.value == 2) {
            return average;
        } else {
            return green_frown;
        }
    }

    /**
   * Get dynamic rating text based on rating value
   */
    getText() {
        if (this.state.value == 1) {
            return 'Average';
        } else if (this.state.value == 2) {
            return 'Good';
        } else {
            return 'Excellent';
        }
    }

    navigator = (status) => {
        console.log(status, "status", this.state);
        this.rateRmp();

    }

    rateRmp = () => {
        this.setState({
            spinner: !this.state.spinner
        });
        var param = {
            iAppointmentId: this.props.sessionDetail.iAppointmentId,
            ePatientRating: this.state.value
        }
        console.log(param, ",,,...")
        postApiRequestWithHeaders(data.api_endpoint.review, param, this.props.user_data.vAccessToken).then(
            data => {
                // showToast(data.message);
                this.setState({
                    spinner: !this.state.spinner
                });
                this.props.parentCallback("rate");
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
            <View style={[styles.container, styles.main_container]}>
                <Spinner
                    color={colors.sub_theme}
                    visible={this.state.spinner}
                    textContent={''}
                />
                <Text style={[styles.thanks_heading, {}]}>Thanks {this.props.sessionDetail.Patient_info.vFirstName}.{'\n'} Your Consultation is  {'\n'}Now Complete</Text>

                <Text style={[styles.notification_text, {}]}>You will be notified when your {'\n'}Medical Report/ Prescription
{'\n'}is ready.</Text>

                <Text style={[styles.rate_text, {}]}>Please Rate,  Dr. {this.props.sessionDetail.Rmp_info.vFirstName}{'\n'}
                    <Text style={{ fontFamily: 'OpenSans-Regular', }}> based on your current consult</Text>
                </Text>

                <View style={styles.container1}>
                    <View>
                        <Image style={styles.icon_img} source={this.getImg()} />
                        <Text style={[styles.value, { color: this.getBtnColor() }]}>{this.getText()}</Text>
                    </View>

                    <Slider
                        minimumValue={1}
                        maximumValue={3}
                        step={1}
                        minimumTrackTintColor={this.getBtnColor()}
                        maximumTrackTintColor={colors.borderColor}
                        thumbTintColor={colors.THEME_YELLOW}
                        thumbTouchSize={{ width: 70, height: 70 }}
                        value={this.state.value}
                        animateTransitions={true}
                        thumbStyle={{
                            borderRadius: 5,
                            width: 50,
                            height: 55,
                            backgroundColor: colors.LIGHT_COLOR,
                            borderWidth: 1,
                            borderColor: colors.BORDER_COLOR,
                        }}
                        onValueChange={value => this.sliderValueChange(value)}
                    />
                </View>

                <View style={styles.btncontainer}>
                    <Button
                        block
                        style={[styles.btn_inner, { backgroundColor: this.getBtnColor() }]}
                        onPress={() => {
                            this.navigator('done');
                        }}>
                        <Text style={styles.btn_txt}>Done </Text>
                    </Button>
                </View>
            </View>

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
export default connect(mapStateToProps, {})(Rating);
