import React, { Component } from 'react';
import styles from './styles';
import {
  View,
  TouchableOpacity,
  Text,
  Keyboard,
  ScrollView,
  FlatList
} from 'react-native';
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
import {
  postApiRequest,
  showToast,
  setItem,
  postApiRequestWithHeaders,
  errorHandler,
} from '../../common/user';
import HeaderComponent from '@components/HeaderComponent';

import Spinner from 'react-native-loading-spinner-overlay';
import { colors, constant, data } from '../../common/index';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

import { connect } from "react-redux";

import { } from "../../actions"
class CancelAppt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eCancelledReason: '',
      spinner: false,
    }
  }

  componentDidMount() {
    console.log(this.props.route.params, "this.props.route.param")
  }
  /**
   * Click handle of next and back
   */
  navigator = (page) => {
    switch (page) {
      case 'next': {
        console.log(this.props)
        if (this.state.eCancelledReason == "") {
          showToast("Please select cancellation reason.")
        } else {
          setTimeout(() => {
            this.setState({
              spinner: !this.state.spinner
            });
          }, 100);
          var param = {
            eCancelledReason: this.state.eCancelledReason,
            iAppointmentId: this.props.route.params.iAppointmentId,
            fRefundAmount: this.props.route.params.fRefundAmount,
            bIsRefundable: this.props.route.params.bIsRefundable,
          }
          console.log(param, "param");
          postApiRequestWithHeaders(data.api_endpoint.cancel_appointments, param, this.props.user_data.vAccessToken).then(
            data => {
              console.log(data, "data.....");
              this.setState({
                spinner: !this.state.spinner
              });
              showToast(data.message);
              this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'MyAccount' }],
              });
            },
            error => {
              showToast(error);
              console.log(error, 'errorrrrrr');

              this.setState({
                spinner: !this.state.spinner
              });

            },
          );
        }
        break;
      }
      case 'back': {
        console.log('back');
        this.props.navigation.goBack();
        break;
      }
    }
  }
  /**
   * Select user type Owner or expert
   */
  handleCheckBox = selected => {
    console.log(selected);
    this.setState({ eCancelledReason: selected });


  };


  render() {
    return (
      <Container>
        <Spinner
          color={colors.sub_theme}
          visible={this.state.spinner}
          textContent={''}
        />
        <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.CANCEL_APPT}></HeaderComponent>
        <View style={styles.mainContainer}>
          <View style={styles.mainContent}>
            {/* <Text style={styles.headingText}>
              Reason For Cancellation
            </Text> */}
            <Text style={styles.headingTextDec}>
              (Tap to Select)
            </Text>

            <FlatList
              style={{
                flex: 1,
              }}
              showsVerticalScrollIndicator={false}
              data={this.props.user_data.iRoleId == constant.ROLE_PATIENT ? constant.CANCEL_REASON : constant.DOC_CANCEL_REASON}
              keyExtractor={item => item}
              horizontal={false}
              renderItem={(item) => {
                console.log(item, "ll");
                return (
                  <TouchableOpacity onPress={() => this.handleCheckBox(item.item)}>
                    <View
                      style={[
                        styles.numberInputContainer, this.state.eCancelledReason == item.item ? { backgroundColor: colors.geen_txt } : {},
                        { borderColor: colors.geen_txt }
                      ]}>

                      <Body style={{ alignItems: 'center' }}>
                        <Text
                          style={[
                            styles.body_style, this.state.eCancelledReason == item.item ? { color: colors.LIGHT_COLOR } : {},
                          ]}>
                          {item.item}
                        </Text>
                      </Body>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />

            <View style={{ marginTop: 20, }}>
              <Button style={styles.nextButtonContainer}
                onPress={() => {
                  this.navigator('next');
                }} >
                <Text style={styles.nextButton}>Cancel Appointment</Text>
              </Button>
            </View>
          </View>
        </View>
      </Container>
    );
  }


}
function mapStateToProps(state) {
  console.log(state, "state...")
  return {
    user_data: state.user.userData,
  }
}
export default connect(mapStateToProps, {})(CancelAppt);


