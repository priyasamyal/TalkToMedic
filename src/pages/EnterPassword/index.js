import React, { Component } from 'react';
import commonData from '../../common/data.js';
import { postApiRequest, postApiRequestWithHeaders, setItem, showToast } from '../../common/user';
import PasswordScreen from '../../components/password';
import { colors } from '../../common/index';

const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
import { View, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import { setUserData } from "../../actions"
class EnterPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      routeData: this.props.route.params.routeParam
    };
  }
  loginApiCall = (password) => {
    setTimeout(() => {
      this.setState({
        spinner: !this.state.spinner
      });
    }, 100);
    const param = {
      vMobileNo: this.props.user.vMobileNo,
      iCountryCode: this.props.user.iCountryCode,
      vPassword: password,
      vDeviceToken: this.props.user.vDeviceToken,
      vPlatform: 'android'
    };
    console.log(param, 'param');
    postApiRequest(commonData.api_endpoint.login, param).then(
      data => {

        this.setState({
          spinner: !this.state.spinner
        });
        console.log(data, 'login response111');
        this.setDataStorage(data.users)

      },
      error => {
        console.log(error, 'error');
        this.setState({
          spinner: !this.state.spinner
        });

        showToast(error);
      },
    );
  }

  setDataStorage = (data) => {
    console.log("Setting", data)
    setItem('user_details', JSON.stringify(data)).then(
      res => {
        console.log(res, "res.....")
        if (res) {
          this.props.setUserData(data);
          console.log(res, "set Storage");
          this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'MyAccount' }],
          });
          // this.props.navigation.reset({
          //   index: 0,
          //   routes: [{ name: 'Dashboard' }],
          // });
        }
      },
      err => {
        console.log(err, "set err")
      },
    );
  }
  navigator = navigate => {
    console.log(navigate, 'navigate in enter password page');
    if (navigate.action == 'forgot') {
      console.log('forgot');
      this.props.navigation.navigate('CommonPage', { type: 'forgot_password' });
    } else if (navigate.action == 'back') {
      this.props.navigation.goBack();
    } else {
      if (this.state.routeData.vOtp != null) {
        this.hitUserDetailApi(this.state.routeData.vAccessToken);
      } else {
        this.loginApiCall(navigate.password);
      }
    }
  };

  hitUserDetailApi = (token) => {
    postApiRequestWithHeaders(commonData.api_endpoint.user_details, {}, token).then(
      resData => {
        console.log(resData,"resd")
        this.setDataStorage(resData.user);
      },
      error => {
        console.log(error, 'errorrrrrr');
      },
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Spinner
          color={colors.sub_theme}
          visible={this.state.spinner}
          textContent={''}
        />
        <PasswordScreen
          routeData={this.state.routeData}
          text={this.state.routeData.vOtp == null ? 'Enter your password' : "Enter valid OTP"}
          forgotPassword={false}
          clickHandler={this.navigator}></PasswordScreen>
      </View>
    );
  }
}



function mapStateToProps(state) {
  return {
    user: state.user
  }
}
export default connect(mapStateToProps, { setUserData })(EnterPassword);


