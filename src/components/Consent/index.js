//import liraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
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
import { colors } from '../../common/index';
import { postApiRequest, setItem, showToast } from '../../common/user';
import { connect } from "react-redux";
class Consent extends Component {
    state = {
        authorize: false,
    };

    navigator = (page) => {
        if (!this.state.authorize) {
            showToast("Please authorize doctor first to start consultation.")
        } else {
            this.props.clickHandler(page);
        }

    }

    render() {
        return (
            <View style={[styles.container, styles.main_container]}>

                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>

                    <CheckBox style={styles.checkboxContainer} color={colors.geen_txt}
                        checked={this.state.authorize}
                        onPress={() => this.setState({ authorize: !this.state.authorize })}
                    />
                    <Body style={{ alignItems: 'flex-start' }}>
                        <TouchableOpacity onPress={() => this.setState({ authorize: !this.state.authorize })}>
                            <Text style={[styles.thanks_heading, {}]}>I authorize Dr. {this.props.sessionDetail.Rmp_info.vFirstName} to access my Medical Records, Lab Reports and previous Prescriptions.</Text>
                        </TouchableOpacity>
                    </Body>
                </View>

                <View style={styles.btncontainer}>
                    <Button
                        vertical
                        block
                        style={[styles.btn_inner,]}
                        onPress={() => {
                            this.navigator('enter_session');
                        }}>
                        <Text style={styles.btn_txt}>Enter Session </Text>
                    </Button>
                </View>
            </View>

        );
    }
}



function mapStateToProps(state) {
    console.log(state, "Verify Number state11...")
    return {
        sessionDetail: state.sessionData
        // user_data: state.user.userData,
    }
}
export default connect(mapStateToProps, {})(Consent);
