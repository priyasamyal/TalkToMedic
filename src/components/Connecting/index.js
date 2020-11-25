//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, constant, data } from '../../common/index';
import { connecting_interval, networkCheck } from '../../common/user';
// create a component
const end_call = require('../../assets/imgs/end-call.png');
import InCallManager from 'react-native-incall-manager';
import { connect } from "react-redux";
class Connecting extends Component {


  componentDidMount() {
    if(this.props.pageFrom !="refresh"){
    InCallManager.start({ media: 'video', ringback: '_BUNDLE_' });
    connecting_interval().then(data => {
      InCallManager.stop({ busytone: '_DTMF_' });
      console.log("data end interva;;")
      this.props.parentCallback('timeout');
    });
  }
  }

  componentDidUnMount() {
    InCallManager.stop({ busytone: '_DTMF_' });
  }
  render() {
    return (
      <View style={styles.container}>
      {this.props.pageFrom !="refresh" && (
         <View style={styles.container}>
            <Text style={styles.heading} >Connecting with {'\n'}{this.props.user_data.iRoleId == constant.ROLE_PATIENT ? "Doctor..." : "Patient..."}</Text>
                    <TouchableOpacity onPress={() => this.navigator('end_call')}>
                      <Image style={styles.footer_icon}
                        source={end_call}
                      />
                </TouchableOpacity>
          </View>

      )}

      {this.props.pageFrom =="refresh" && (
         <View style={styles.container}>
            <Text style={styles.heading} >Reconnecting with {'\n'}{this.props.user_data.iRoleId == constant.ROLE_PATIENT ? "Doctor..." : "Patient..."}</Text>              
          </View>
      )}
     
    </View>
    );
  }

  navigator = page => {
    InCallManager.stop({ busytone: '_DTMF_' });
    this.props.parentCallback(page);
  };
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.BLACK_TEXT,

  },
  heading: {
    color: colors.LIGHT_COLOR,
    fontSize: 30,
    fontFamily: 'OpenSans-Regular',
    textAlign: 'center'
  },
  footer_icon: {
    marginTop: 30,
    height: 40,
    width: 40,
    padding: 45,
  }
});


function mapStateToProps(state) {
  return {
    user_data: state.user.userData,
  }
}
export default connect(mapStateToProps, {})(Connecting);