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
import { openUrl } from '../../common/user';
// create a component
class CommonPopUp extends Component {
    handleViewRef = ref => this.view = ref;
    navigator = page => {
        if(page == "SplashScreen"){
            this.props.clickHandler(page);
        }else{
            this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
            setTimeout(() => {
                this.props.clickHandler(page);
            }, 420);
        }
        
        // switch (page) {
        //     case "back":
        //         console.log("back");
        //         this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
        //         setTimeout(() => {
        //             this.props.clickHandler('back');
        //         }, 420);
        //         //  
        //         break;
        //     case "end":
        //         console.log("end");
        //         this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
        //         setTimeout(() => {
        //             this.props.clickHandler('end');
        //         }, 420);
        //         break;
        //     default:
        //         console.log("end");
        //         this.view.fadeOutDown(400).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
        //         setTimeout(() => {
        //             this.props.clickHandler(page);
        //         }, 420);
        //         break;
        // }
    }
    bounce = () => this.view.bounce(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));

    render() {
        return (
            <View style={styles.container}>
                <Animatable.View animation="fadeInDown"
                    ref={this.handleViewRef}
                    duration={400} style={styles.inner_container}>
                    <Text style={styles.header_text}>{this.props.title}</Text>
                    <Text style={styles.description_text}>{this.props.msg}</Text>

                    <View style={{ flexDirection: 'row'}}>

                        {this.props.title == "Refund" && (
                            <Button style={styles.back_btn} onPress={() => this.navigator('refund')} >
                                <Text style={styles.back_btn_txt} >Refund</Text>
                            </Button>
                        )}
                        {(this.props.title == "Logout" || this.props.title == "Delete") && (
                            <Button style={styles.end_btn} onPress={() => this.navigator('cancel')} >
                                <Text style={styles.end_btn_txt} >Cancel</Text>
                            </Button>
                        )}
                        {(this.props.title == " " || this.props.title == "Missed" || this.props.title == "Additional Info") && (
                            <Button style={styles.end_btn} onPress={() => this.navigator('cancel')} >
                                <Text style={styles.end_btn_txt} >OK</Text>
                            </Button>
                        )}

                        {(this.props.title == "Delete") && (
                            <Button bordered style={[styles.end_btn, { backgroundColor: "transparent", }]} onPress={() => this.navigator('delete')} >
                                <Text style={[styles.end_btn_txt, { color: colors.THEME_YELLOW }]} >Delete</Text>
                            </Button>
                        )}
                        {this.props.title == "Logout" && (
                            <Button bordered style={[styles.end_btn, { backgroundColor: "transparent", }]} onPress={() => this.navigator('logout')} >
                                <Text style={[styles.end_btn_txt, { color: colors.THEME_YELLOW }]} >Logout</Text>
                            </Button>
                        )}
                        {(this.props.title == "Verfication" || this.props.title == "Not Found" || this.props.title == "Cancel Appointment") && (
                            <Button style={styles.end_btn} onPress={() => this.navigator('back')} >
                                <Text style={styles.end_btn_txt} >Go Back</Text>
                            </Button>
                        )}
                        {this.props.title == "Cancel Appointment" && (
                            <Button bordered style={[styles.end_btn, { backgroundColor: "transparent", }]} onPress={() => this.navigator('cancel_appt')} >
                                <Text style={[styles.end_btn_txt, { color: colors.THEME_YELLOW }]} >Cancel </Text>
                            </Button>
                        )}

                        {this.props.title == "Please Confirm" && (
                            <Button bordered style={[styles.end_btn, { backgroundColor: "transparent" }]} onPress={() => this.navigator('cancel')} >
                                <Text style={[styles.end_btn_txt, { color: colors.THEME_YELLOW }]} >Cancel</Text>
                            </Button>
                        )}

                        {this.props.title == "Please Confirm" && (
                            <Button style={[styles.end_btn ]} onPress={() => this.navigator('confirm')} >
                                <Text style={styles.end_btn_txt} >Yes, I Confirm</Text>
                            </Button>
                        )}

                        {this.props.title == "Confirm" && (
                            <Button bordered style={[styles.end_btn, { backgroundColor: "transparent", }]} onPress={() => this.navigator('disconnect')} >
                                <Text style={[styles.end_btn_txt, { color: colors.THEME_YELLOW }]} >Disconnect</Text>
                            </Button>
                        )}

                        {this.props.title == "Confirm" && (
                            <Button style={styles.end_btn} onPress={() => this.navigator('proceed')} >
                                <Text style={styles.end_btn_txt} >Proceed</Text>
                            </Button>
                        )}

                        {this.props.title == "Alert" && (
                            <Button style={styles.end_btn} onPress={() => this.navigator('proceed')} >
                                <Text style={styles.end_btn_txt} >Ok</Text>
                            </Button>
                        )}
                        {this.props.title == "Update Required" && (
                            <Button style={styles.end_btn} onPress={() => openUrl("https://play.google.com/store/apps/details?id=com.talktomedic.app")} >
                                <Text style={styles.end_btn_txt} >Update</Text>
                            </Button>
                        )}
                        {this.props.title == "Internet Connectivity" && (
                            <Button style={styles.end_btn} onPress={() => this.navigator('SplashScreen')} >
                                <Text style={styles.end_btn_txt} >Try Again</Text>
                            </Button>
                        )

                        }
                    </View>
                    {/* {this.props.title == "Refund" && (
                        <Button style={styles.back_btn} onPress={() => this.navigator('refund')} >
                            <Text style={styles.back_btn_txt} >Refund</Text>
                        </Button>
                    )}
                    {this.props.title == "Logout" && (
                        <Button style={styles.end_btn} onPress={() => this.navigator('cancel')} >
                            <Text style={styles.end_btn_txt} >Cancel</Text>
                        </Button>
                    )}
                    {this.props.title == "Logout" && (
                        <Button style={styles.end_btn} onPress={() => this.navigator('logout')} >
                            <Text style={styles.end_btn_txt} >Logout</Text>
                        </Button>
                    )} */}
                    {/* {this.props.title != "Refund" && (
                        <Button style={styles.end_btn} onPress={() => this.navigator('end')} >
                            <Text style={styles.end_btn_txt} >Back to Home</Text>
                        </Button>
                    )} */}
                </Animatable.View>

            </View>
        );
    }
}


//make this component available to the app
export default CommonPopUp;




