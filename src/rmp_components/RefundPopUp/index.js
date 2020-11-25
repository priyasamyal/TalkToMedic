//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Keyboard, BackHandler } from 'react-native';
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
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
    postApiRequest,
    showToast,
    setItem,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
// create a component
class RefundPopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fRefundAmount: this.props.amount
        };
    }
    
    handleViewRef = ref => this.view = ref;
    navigator = page => {
        this.view.fadeOutDown(500).
            then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
            
        setTimeout(() => {
            
            this.props.clickHandler(page);
        }, 420);
    }

    componentDidMount() {
            this.backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                this.navigator
              );
        }
    
    componentWillUnmount() {
        this.backHandler.remove();
    }


    refundPartial = () => {
        console.log(this.state);
        if (this.state.fRefundAmount == 0){
            showToast("Refund amount is should be greater then "+this.state.fRefundAmount+".");
            return;
        }
        if (this.state.fRefundAmount > this.props.amount) {
            showToast("Refund amount should not exceed the appointment fees amount.")
        } else {
            this.props.clickHandler("partial", this.state.fRefundAmount);
        }
    }

    bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    style={{
                        flex: 2, width: '100%', height: "100%"
                    }}
                    centerContent={true}
                    showsVerticalScrollIndicator={false}
                >
                    <Animatable.View 
                        animation="fadeIn"
                        ref={this.handleViewRef}
                        duration={500} style={styles.inner_container}>
                        <Text style={styles.header_text}>{this.props.title}</Text>
                        <Text style={styles.description_text}>Enter Refund Amount</Text>
                        <View style={styles.numberInputContainer}>
                            <TextInput
                                style={styles.numberInput}
                                keyboardType="numeric"
                                maxLength={8}
                                ref={ref => (this.textInputRef = ref)}
                                autoFocus={true}
                                selectionColor={colors.THEME_YELLOW}
                                onChangeText={name => this.setState({ fRefundAmount: name })}
                                value={this.state.fRefundAmount}
                            >
                            </TextInput>
                        </View>

                        <View style={{ width: '100%' }}>

                            <Button style={styles.end_btn} onPress={() => this.refundPartial()} >
                                <Text style={styles.end_btn_txt} >Refund</Text>
                            </Button>

                            <Button bordered style={[styles.end_btn, { backgroundColor: "transparent", }]} 
                                onPress={() => this.navigator('back')} >
                                <Text style={[styles.end_btn_txt, { color: colors.THEME_YELLOW }]} >Go Back</Text>
                            </Button>
                        </View>
                    </Animatable.View>


                </ScrollView>
            </View>
        );
    }
}


//make this component available to the app
export default RefundPopUp;




