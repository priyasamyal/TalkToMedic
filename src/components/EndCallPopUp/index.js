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

import * as Animatable from "react-native-animatable";
// create a component
class EndCallPopUp extends Component {
    handleViewRef = ref => this.view = ref;
    navigator = page => {
        switch (page) {
            case "back":
                console.log("back");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('back');
                }, 420);
                //  
                break;
            case "end":
                console.log("end");
                this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
                setTimeout(() => {
                    this.props.clickHandler('end');
                }, 420);
                break;
            default:
                break;
        }
    }
    bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="fadeInDown"
                    ref={this.handleViewRef}
                    duration={400} style={styles.inner_container}>
                    <Text style={styles.header_text}>End call?</Text>
                    <Text style={styles.description_text}>Are you sure you want to end this call? You cannot reconnect after ending.</Text>
                    <Button style={styles.back_btn} onPress={() => this.navigator('back')}>
                        <Text style={styles.back_btn_txt}> Go Back</Text>
                    </Button>
                    <Button style={styles.end_btn} onPress={() => this.navigator('end')} >
                        <Text style={styles.end_btn_txt} > End Call</Text>
                    </Button>
                </Animatable.View>

            </View>
        );
    }
}


//make this component available to the app
export default EndCallPopUp;
