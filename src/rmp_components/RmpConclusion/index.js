import React, { Component } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';
import { Text, Textarea, Form, Button, Picker, Icon, Container } from 'native-base'
import { colors, constant, data } from '../../common/index';
const { width: Width } = Dimensions.get('window');
import {
  postApiRequestWithHeaders,
  errorHandler,
  errorHandler1,
  getApiRequest,
  showToast,
  networkCheck,
  alertWithTwoBtn,
  alertWithSingleBtn,
  clear_push_interval
} from '../../common/user';
import { connect } from "react-redux";
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
class RmpConclusion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "Provided Health Education",
      info: '',
      spinner: false
    };

  }

  onValueChange(value) {
    this.setState({
      selected: value
    })
  }

  addStatement = () => {
    Keyboard.dismiss();
    this.setState({
      spinner: !this.state.spinner
    });
    var param = {
      // iAppointmentId: "26",
      tConcludingStatement: this.state.selected,
      iAppointmentId: this.props.sessionDetail.iAppointmentId,
      tAdditionalInfo: this.state.info
    }
    console.log(param, ",,,...");
    postApiRequestWithHeaders(data.api_endpoint.conclude, param, this.props.user_data.vAccessToken).then(
      data => {
        // showToast(data.message);
        this.setState({
          spinner: !this.state.spinner
        });
        this.props.parentCallback("status", this.state.info);
        //this.props.navigation.push('CommonPage', { rmp_prescription_data: { from: "call" }, type: 'add_medical_history' });
        // this.props.parentCallback("rate");
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
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          //  style={styles.mainContent}
          //  contentContainerStyle={styles.mainContent}
          // contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <View style={styles.mainContainer}>
            <Text style={styles.headingText}>Thanks Dr. {this.props.sessionDetail.Rmp_info.vFirstName} {this.props.sessionDetail.Rmp_info.vLastName}{'\n'}
              Your Consultation is Now Complete</Text>
            <View>
              <Text style={styles.subHeadingText}>Please choose one of the following concluding statement</Text>
              <View style={styles.pickerWrapper} >
                <Picker
                  mode="dropdown"
                  iosHeader="Choose Statement"
                  iosIcon={<Icon name="arrow-down" style={{ marginTop: 2 }} />}
                  textStyle={[styles.pickerText]}
                  style={[{ width: "100%" }]}

                  selectedValue={this.state.selected}
                  onValueChange={this.onValueChange.bind(this)}
                >
                  <Picker.Item label="Provided Health Education" value="Provided Health Education" />
                  <Picker.Item label="Provided Counselling" value="Provided Counselling" />
                  <Picker.Item label="Prescribed Medication and Lab Test" value="Prescribed Medication and Lab Test" />
                  <Picker.Item label="Prescribed Medication" value="Prescribed Medication" />
                  <Picker.Item label="Prescribed Lab Test" value="Prescribed Lab Test" />
                  <Picker.Item label="Referred to another Doctor/ Specialist" value="Referred to another Doctor/ Specialist" />
                  <Picker.Item label="Advised In- person Consult/ Clinic Visit" value="Advised In- person Consult/ Clinic Visit" />
                </Picker>
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={styles.subHeadingText}>Request Additional Info (Optional)</Text>
              <Textarea
                placeholder={"You may request Additional info like Lab Tests, X-ray info etc....."}
                rowSpan={6} bordered style={styles.textAreatStyle} value={this.state.info}
                onChangeText={txt => { this.setState({ info: txt }) }}
              />
            </View>

            <Text style={[styles.subHeadingText, { marginTop: 70, paddingBottom: 20, textAlign: 'center' }]}>Click the button below to write the medical report/ prescription for this consult</Text>
            <Button
              onPress={() => this.addStatement()}
              style={styles.buttonContainer}>
              <Text
                uppercase={false}
                style={[styles.buttonText, { textAlign: 'center' }]}> Write Medical History / Prescription</Text>
            </Button>
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
export default connect(mapStateToProps, {})(RmpConclusion);
