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

import Spinner from 'react-native-loading-spinner-overlay';
import HeaderComponent from '@components/HeaderComponent';
import {
  postApiRequest,
  showToast,
  setItem,
  postApiRequestWithHeaders,
  errorHandler,
} from '../../common/user';
import { colors, constant, data } from '../../common/index';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";

import { apptType } from "../../actions"
class ApptType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eType: ''
    }
  }

  componentDidMount() {
  }
  /**
   * Click handle of next and back
   */
  navigator = (page) => {
    switch (page) {
      case 'next': {
        console.log(this.props)
        if (this.state.eType == "") {
          showToast("Please select Appointment type.")
        } else {
          this.props.apptType(this.state.eType);
          //  this.props.navigation.navigate('AvailableRMP');

          var param = {
            treatments: this.props.appt_data.treatments,
            fLatitude: this.props.appt_data.vLat,
            fLongitude: this.props.appt_data.vLng,
            dScheduledDate: this.props.appt_data.dScheduledDate,
            dTime: this.props.appt_data.dTime,
          }

          console.log(param, "param...");
          this.searchDoctor(param);
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
  * Search Practitioner
  */
  searchDoctor = (param) => {
    this.setState({
      spinner: !this.state.spinner
    });
    postApiRequestWithHeaders(data.api_endpoint.search_doctor, param, this.props.user_data.vAccessToken).then(
      data => {
        console.log(data, "data.....");
        this.setState({
          spinner: !this.state.spinner
        });
        this.props.navigation.navigate('AvailableRMP', { resulted_rmp: data.resulted_rmp });

      },
      error => {
        this.setState({
          spinner: !this.state.spinner
        });
        showToast(error);
        console.log(error, 'errorrrrrr');
      },
    );
  };
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
        <HeaderComponent show_back={true} clickHandler={this.navigator} title={constant.page_titles.CHOOSE_APPT_TYPE}></HeaderComponent>
        <View style={styles.mainContainer}>
          <View style={styles.mainContent}>
            <Text style={styles.headingText}>
              Is This Your
            </Text>

            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>

              <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                checked={this.state.eType == "Initial" ? true : false}
                onPress={() => this.setState({ eType: "Initial" })}
              />
              <Body style={{ alignItems: 'flex-start' }}>
                <TouchableOpacity onPress={() => this.setState({ eType: "Initial" })}>
                  <Text style={styles.checkboxText}>First Consult?</Text>
                </TouchableOpacity>
              </Body>
            </View>


            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 15, marginRight: 15 }}>

              <CheckBox style={styles.checkboxContainer} color={colors.sub_theme}
                checked={this.state.eType == "Follow Up" ? true : false}
                onPress={() => this.setState({ eType: "Follow Up" })}
              />
              <Body style={{ alignItems: 'flex-start', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => this.setState({ eType: "Follow Up" })}>
                  <Text style={styles.checkboxText}>Follow-up Consult?</Text>
                </TouchableOpacity>
              </Body>
            </View>

            <View style={{ marginTop: 20, }}>
              <Button style={styles.nextButtonContainer}
                onPress={() => {
                  this.navigator('next');
                }} >
                <Text style={styles.nextButton}>Next</Text>
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
    appt_data: state.appointment_booking_data
  }
}
export default connect(mapStateToProps, { apptType })(ApptType);


