//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
//import Razorpay from 'react-native-customui';
// create a component
class Payment extends Component {
    render() {
        return (
            <View style={styles.container}>

                {/* <TouchableOpacity

                    onPress={() => {
                        var options = {
                            description: 'Credits towards consultation',
                            image: 'https://i.imgur.com/3g7nmJC.png',
                            currency: 'INR',
                            key: 'rzp_test_1DP5mmOlF5G5ag',
                            amount: '6000',
                            name: 'foo',
                            prefill: {
                                email: 'void@razorpay.com',
                                contact: '9191919191',
                                name: 'Razorpay Software'
                            },
                            theme: { color: '#F37254' }
                        }
                        RazorpayCheckout.open(options).then((data) => {
                            // handle success
                            alert(`Success: ${data.razorpay_payment_id}`);
                        }).catch((error) => {
                            // handle failure
                            alert(`Error: ${error.code} | ${error.description}`);
                        });
                    }}> */}

                <TouchableOpacity

                    onPress={() => {
                        var options = {
                            description: 'Appointment Consultation Fees',
                            image: 'https://i.imgur.com/3g7nmJC.png',
                            currency: 'INR',
                            key: 'rzp_test_tcd4Yy6Q8OlCde',
                            amount: '6000',
                            name: 'Priya',
                            prefill: {
                                email: 'rajiv@prologictechnologies.in',
                                contact: '9815816583',
                                name: 'Talk To Medic'
                            },
                            theme: { color: '#066DAE' }
                        }
                        RazorpayCheckout.open(options).then((data) => {
                            // handle success
                            alert(`Success: ${data.razorpay_payment_id}`);
                        }).catch((error) => {
                            // handle failure
                            alert(`Error: ${error.code} | ${error.description}`);
                        });
                    }}>

                    <Text>Payment</Text>

                </TouchableOpacity>

            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        //  backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default Payment;
