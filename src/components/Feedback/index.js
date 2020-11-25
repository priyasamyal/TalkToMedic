//import liraries
import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
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

class Feedback extends Component {
    state = {
        value: 2,
    };


    /**
     * Action when user clicks back or next button
     */
    navigator = (page) => {
        switch (page) {
            case 'book': {
                this.props.clickHandler('book');
                break;
            }
            case 'appt': {
                console.log('back');
                this.props.clickHandler('consult');
                break;
            }
        }
    }

    render() {
        return (
            <View style={[styles.container, styles.main_container]}>

                <Text style={[styles.thanks_heading, {}]}>Thanks for your{'\n'} feedback.</Text>

                <Text style={[styles.notification_text, {}]}>Your feedback is important to us. {'\n'}It helps us serve you better and {'\n'}improve our quality. </Text>




                <View style={styles.btncontainer}>
                    <Button
                        vertical
                        block
                        style={[styles.btn_inner,]}
                        onPress={() => {
                            this.navigator('book');
                        }}>
                        <Text style={styles.btn_txt}>Book Another Appointment </Text>
                    </Button>

                    <Button
                        vertical
                        block
                        style={[styles.btn_inner1,]}
                        onPress={() => {
                            this.navigator('appt');
                        }}>
                        <Text style={[styles.btn_txt, { color: colors.sub_theme }]}>View Upcoming Appointments </Text>
                    </Button>
                </View>
            </View>

        );
    }
}


//make this component available to the app
export default Feedback;
