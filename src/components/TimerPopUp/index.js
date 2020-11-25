//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from './styles';
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
} from 'native-base';
import { colors } from '../../common/index';
import * as Animatable from "react-native-animatable";
// create a component
_interval;
class TimerPopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            minutes: '00',
            seconds: '60',
            id: ''


        };
    }

    handleViewRef = ref => this.view = ref;
    navigator = page => {
        clearInterval(this._interval);
        this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
        setTimeout(() => {
            this.props.clickHandler(page, this.state.id);
        }, 420);

    }
    bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

    startTimer = (secondsOnly, dateTime, id) => {
        console.log(secondsOnly, "timr", dateTime);

        var timer = secondsOnly;
        var minutes;
        var seconds;
        this._interval = setInterval(() => {
            minutes = Math.floor(timer / 60);
            seconds = Math.floor(timer % 60);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            console.log(minutes, seconds);
            this.setState({
                minutes: minutes,
                seconds: seconds,
                id: id
            })

            --timer;
            if (timer < 0) {
                console.log('timeup');
                clearInterval(this._interval);
            } else {


            }
        }, 1000);

    }
    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="fadeInDown"
                    ref={this.handleViewRef}
                    duration={400} style={styles.inner_container}>
                    {/* <Text style={styles.header_text}>{this.props.title}</Text> */}
                    <Text style={styles.description_text}>{this.props.msg}</Text>
                    <Icon

                        style={[
                            styles.timer_icon,
                        ]}
                        name="ios-timer"
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.timer_text}>{this.state.minutes}m</Text>
                        <Text style={styles.timer_text}>:</Text>
                        <Text style={styles.timer_text}>{this.state.seconds}s</Text>
                    </View>

                    {this.props.title != "call" && (
                        <View style={{ flexDirection: 'row' }}>
                            {((this.state.minutes != "00" || this.state.seconds != "00")) && (
                                <Button style={styles.end_btn} onPress={() => this.navigator('cancel')} >
                                    <Text style={styles.end_btn_txt} >Cancel</Text>
                                </Button>
                            )}
                            {(this.state.minutes == "00" && this.state.seconds == "00") && (
                                <Button style={styles.end_btn} onPress={() => this.navigator('enter_session')} >
                                    <Text style={styles.end_btn_txt}>Start Consult</Text>
                                </Button>
                            )}
                        </View>
                    )}

                    {this.props.title == "call" && (
                        <View style={{ flexDirection: 'row' }}>
                            <Button style={styles.end_btn} onPress={() => this.navigator('ok')} >
                                <Text style={styles.end_btn_txt} >Close</Text>
                            </Button>
                        </View>
                    )}


                </Animatable.View>

            </View>
        );
    }
}


//make this component available to the app
export default TimerPopUp;




