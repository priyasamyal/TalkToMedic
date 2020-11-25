import React, { Component } from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Dimensions,
    TouchableOpacity

} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../../common'
import styles from './styles';
import { Text, Textarea, Form, Button, Picker, Icon } from 'native-base'
const { width: Width } = Dimensions.get('window');

class PostPrescription extends Component {

    myAppointments = () => {

        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'MyAccount', params: { type: 'my_appt' } }],
        });
    }
    myAccount = () => {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'MyAccount' }],
        });
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}>
                <View style={styles.mainContainer}>

                    <View>
                        <Text style={styles.headingText}> Your Prescription has been saved and Patient has been notified via SMS
 </Text>


                        {/*****************************Buttons**********************/}
                        <Button
                            onPress={() => this.myAppointments()}
                            style={styles.myAppontmentButtonContainer}>
                            <Text style={{ color: colors.LIGHT_COLOR, fontSize: 20, fontFamily: 'OpenSans-Regular', }}> My Appointments</Text>
                        </Button>


                        <Button
                            onPress={() => this.myAccount()}
                            style={styles.myAccountButtonContainer}>
                            <Text style={{ color: colors.sub_theme, fontSize: 20, fontWeight: "bold", fontFamily: 'OpenSans-Regular', }}>Dashboard</Text>
                        </Button>

                    </View>

                </View>


            </ScrollView>


        );
    }
}
export default PostPrescription;