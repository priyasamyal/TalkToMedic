import React, { Component } from 'react';
import styles from './styles';
import {
   View,
   TouchableOpacity,
   Text,
   Keyboard
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
} from '../../common/user';

import HeaderComponent from '@components/HeaderComponent';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, constant, data } from '../../common/index';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };

import { connect } from "react-redux";

import { setUserType, setUserData } from "../../actions"
class SelectUser extends Component {
   constructor(props) {
      super(props);
      this.state = {
         spinner: false
      }

   }

   componentDidMount() {
      Keyboard.dismiss();
   }
   /**
    * Click handle of next and back
    */
   navigator = (page) => {
      console.log("switch", page, this.props)
      switch (page) {
         case 'next': {
            this.props.navigation.navigate('Introduction');
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
      this.props.setUserType(selected);
      this.props.navigation.navigate('Introduction');
      // if (selected == constant.ROLE_RMP) {
      //    this.props.navigation.navigate('Introduction');
      //    return;
      // }

      var param = {
         vMobileNo: this.props.user_data.vMobileNo,
         iCountryCode: this.props.user_data.iCountryCode,
         vFirstName: "Guest",
         vLastName: "Patient",
         iRoleId: selected,
         vDeviceToken: this.props.user_data.vDeviceToken,
         vPlatform: 'android'
      }
      // this.registerPatient(param);
   };

   registerPatient = (param) => {
      postApiRequest(data.api_endpoint.signup, param).then(
         data => {
            this.props.setUserData(data.user);
            showToast("Register Successfully.")
            this.props.navigation.reset({
               index: 0,
               routes: [{ name: 'MyAccount' }],
            });
            setTimeout(() => {
               this.setState({
                  spinner: !this.state.spinner
               });
            }, 100);
         },
         error => {
            setTimeout(() => {
               this.setState({
                  spinner: !this.state.spinner
               });
            }, 100);
            console.log(error, 'error111');
            showToast(error);
         },
      );
   }

   render() {
      return (
         <Container>
            <HeaderComponent show_headingCenter={true} show_back={true} clickHandler={this.navigator} title={constant.page_titles.LOGO}></HeaderComponent>
            <Spinner
               color={colors.sub_theme}
               visible={this.state.spinner}
               textContent={''}
            />
            <View style={styles.mainContainer}>
               <View style={styles.mainContent}>
                  <Text style={styles.headingText}>
                     Are you a Patient  {'\n'}OR {'\n'}Registered Medical Practitioner ?
            </Text>
                  <TouchableOpacity onPress={() => this.handleCheckBox(constant.ROLE_PATIENT)}>
                     <View
                        style={[
                           styles.numberInputContainer,
                           { backgroundColor: colors.THEME_YELLOW, borderColor: colors.THEME_YELLOW }
                        ]}>

                        <Body style={{ alignItems: 'center' }}>
                           <Text
                              style={[
                                 styles.body_style,
                              ]}>
                              Patient
                  </Text>
                        </Body>
                     </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => this.handleCheckBox(constant.ROLE_RMP)}>
                     <View
                        style={[
                           styles.numberInputContainer,
                           { backgroundColor: colors.sub_theme, borderColor: colors.sub_theme }
                        ]}>

                        <Body style={{ alignItems: 'center' }}>
                           <Text
                              style={[
                                 styles.body_style
                              ]}>
                              Medical Practitioner
                  </Text>
                        </Body>
                     </View>
                  </TouchableOpacity>
               </View>
            </View>
         </Container>
      );
   }
}
function mapStateToProps(state) {
   console.log(state, "state...")
   return {
      user_data: state.user
   }
}
export default connect(mapStateToProps, { setUserType, setUserData })(SelectUser);


