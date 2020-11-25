import 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { colors, constant, data } from './../common/index';
import {
   Icon,
} from 'native-base';
import ApptOption from '@pages/ApptOption';
import ApptType from '@pages/ApptType';
import AvailableRMP from '@pages/AvailableRMP';
import CallKit from '@pages/CallKit';
import CancelAppt from '@pages/CancelAppt';
import CommonPage from '@pages/CommonPage';
import EnterPhoneNumber from '@pages/EnterPhoneNumber';
import Introduction from '@pages/Introduction';
import HowItWorks from '@pages/HowItWorks';
import Login from '@pages/Login';
import MyAccount from '@pages/MyAccount';
import PatientRegister from '@pages/PatientRegister';
import RmpRegister from '@pages/RmpRegister';
import SelectUser from '@pages/SelectUser';
import EnterPassword from '@pages/EnterPassword';
import ChooseProblem from '@components/ChooseProblem';
import Appointments from '@components/Appointments';
import MedicalHistory from '@components/MedicalHistory';
// import VideoCall from '@pages/VideoCall';
import SplashScreen from '@pages/SplashScreen';
import Payment from '@pages/Payment';
// import EnxJoinScreen from '@pages/EnxJoinScreen';
import VerifyNumber from '@pages/VerifyNumber';
import VideoCall from '@pages/VideoCall';
//import RmpAvailabilty from '@pages/RmpAvailabilty';
import RmpAvailabilty from '../pages/RmpAvailability';
import PatientReports from "@pages/PatientReports";
import ViewPatientReports from "@pages/PatientReports/viewreports";
import ConsultationFee from '@rmp_components/ConsultationFee';
import RmpProfile from '@components/RmpProfile';
import ManageAvailability from '@rmp_components/ManageAvailability';
import ChangePassword from '@components/ChangePassword';
import PatientProfile from '@components/PatientProfile';
import PaymentReceipt from '@components/PaymentReceipt';
import AddMember from '@components/AddMember';
import Settings from '@components/Settings';
import CommonPopUp from '@components/CommonPopUp';
import RmpPracticeDetail from '@components/RmpPracticeDetail';
import WithdrawFunds from '@rmp_components/WithdrawFunds';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
   createDrawerNavigator,
   DrawerContentScrollView,
   DrawerItemList,
   DrawerItem,
   DrawerContent
} from '@react-navigation/drawer';
import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { clearLocalStorage, alertWithTwoBtn } from '../common/user';
import { removeUser } from "../actions";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const { width, height } = Dimensions.get("window");

function CustomDrawerContent(props) {
   // const dispatch = useDispatch();
   const userData = useSelector(state => state.user.userData);
   const dispatch = useDispatch();
   const logoutHandler = () => {
      props.navigation.closeDrawer();
      alertWithTwoBtn("Logout", "Are you sure you want to logout?", "Cancel", "Logout")
         .then(res => {
            console.log(res)
            if (res) {
               clearLocalStorage('user_details').then(async data => {
                  await dispatch(removeUser());
                  props.navigation.reset({
                     index: 0,
                     routes: [{ name: 'EnterPhoneNumber' }],
                  });
               });
            }
         });

      // props.navigation.navigate("Book Appointment", { type: "logout" })
   }


   return (
      <DrawerContentScrollView {...props}>
         <CustomDrawerContentComponent />
         <DrawerItemList
            {...props} />
         <DrawerItem
            label=" Logout"
            icon={() => <Icon style={{ color: colors.sub_theme, fontSize: 24, }} name="ios-log-out" />}
            onPress={() => logoutHandler()}
            labelStyle={{ fontFamily: "OpenSans-Regular", }}
            activeTintColor={colors.sub_theme}
            inactiveTintColor={colors.sub_theme}
         />
         <DrawerItem
            label="Version: 1.4"
            icon={() => <Icon type="MaterialCommunityIcons" style={{ color: colors.sub_theme, fontSize: 24 }} name="android" />}
            labelStyle={{ fontFamily: "OpenSans-Regular", color: colors.sub_theme }}
         />
      </DrawerContentScrollView>
   );
}

const HomeTabs = () => {

   const userData = useSelector(state => state.user.userData);

   if (userData.iRoleId) {
      return (
         <Tab.Navigator
            screenOptions={({ route }) => ({
               tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name == "Book Appointment") {
                     iconName = "md-text"
                  } else if (route.name == "My Appointments") {
                     iconName = "ios-calendar"
                  }
                  else if (route.name == "Medical History") {
                     iconName = "ios-list-box"
                  }
                  else if (route.name == "Lab/Test Reports") {
                     iconName = "ios-albums"
                  }
                  else if (route.name == "Appointments") {
                     iconName = "journal"
                  }
                  else if (route.name == "Earnings") {
                     iconName = "ios-cash"
                  }
                  else if (route.name == "Availability") {
                     iconName = "ios-calendar"
                  }
                  else if (route.name == "Edit Profile") {
                     iconName = "ios-person"
                  }
                  return <Icon type="Ionicons" name={iconName} style={{ color: color, fontSize: 23 }} />;
               },
            })}
            initialRouteName={userData.iRoleId == 1 ? "Book Appointment" : "Appointments"}
            tabBarOptions={{
               activeTintColor: colors.sub_theme,
               inactiveTintColor: colors.grey_heading,
               keyboardHidesTabBar: true,
               labelStyle: { fontFamily: "OpenSans-Regular" },
               // showLabel: false,
               safeAreaInsets: { top: 20, right: 12, left: 12, bottom: 10 }
            }}
         // tabBar={props => <MyTabBar {...props} />}
         // initialRouteName={userData.iRoleId == 1 ? "Book Appointment" : "Appointments"}
         // tabBarOptions={{
         //    activeTintColor: colors.sub_theme,
         //    inactiveTintColor: colors.grey_heading,
         // }} 
         >
            {userData.iRoleId == 1 ? (
               <>
                  <Tab.Screen name="Book Appointment" component={ChooseProblem} />
                  <Tab.Screen name="Appointments" component={Appointments} />
                  <Tab.Screen name="Medical History" component={MedicalHistory} />
                  <Tab.Screen name="Lab/Test Reports" component={ViewPatientReports} />
               </>
            ) : (
                  <>
                     <Tab.Screen name="Appointments" component={Appointments} />
                     <Tab.Screen name="Earnings" component={ConsultationFee} />
                     <Tab.Screen name="Availability" component={ManageAvailability} />
                     <Tab.Screen name="Edit Profile" component={RmpProfile} />
                  </>
               )}

         </Tab.Navigator>
      )
   }

   return (
      null
   )
}


const AppContainer = () => {

   const gestureHandler = (action, props) => {
      let parent = props.navigation.dangerouslyGetParent();
      if (!parent) {
         return;
      }
      parent.setOptions({
         gestureEnabled: action
      })
   }

   return (
      <Stack.Navigator
         headerMode='none'
         initialRouteName='SplashScreen'>
         {/* <Stack.Screen name="Dashboard" component={HomeTabs} /> */}
         <Stack.Screen name="RmpRegister" component={RmpRegister}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="VideoCall" component={VideoCall}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="ApptOption" component={ApptOption}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="ApptType" component={ApptType}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="AvailableRMP" component={AvailableRMP}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="CallKit" component={CallKit}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="CancelAppt" component={CancelAppt}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="CommonPage" component={CommonPage}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="EnterPassword" component={EnterPassword}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="PatientRegister" component={PatientRegister}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="SplashScreen" component={SplashScreen}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="EnterPhoneNumber" component={EnterPhoneNumber}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="Introduction" component={Introduction}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="Login" component={Login}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="SelectUser" component={SelectUser}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="VerifyNumber" component={VerifyNumber}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="MyAccount" component={HomeTabs}
            options={props => gestureHandler(true, props)} />
         <Stack.Screen name="Payment" component={Payment}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="RmpAvailabilty" component={RmpAvailabilty}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="PatientReports" component={PatientReports}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="ViewPatientReports" component={ViewPatientReports}
            options={props => gestureHandler(true, props)} />
         <Stack.Screen name="ConsultationFee" component={ConsultationFee}
            options={props => gestureHandler(true, props)} />
         <Stack.Screen name="RmpProfile" component={RmpProfile}
            options={props => gestureHandler(true, props)} />
         <Stack.Screen name="ManageAvailability" component={ManageAvailability}
            options={props => gestureHandler(true, props)} />
         <Stack.Screen name="ChangePassword" component={ChangePassword}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="PatientProfile" component={PatientProfile}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="PaymentReceipt" component={PaymentReceipt}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="AddMember" component={AddMember}
            options={props => gestureHandler(false, props)} />
         <Stack.Screen name="Settings" component={Settings}
            options={props => gestureHandler(false, props)} />
         {/* <Stack.Screen name="VideoCall" component={VideoCall} />
                <Stack.Screen name="EnxJoinScreen" component={EnxJoinScreen} />
                <Stack.Screen name="PatientRegister" component={PatientRegister} />
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                */}
      </Stack.Navigator>
   );
}

const SideMenu = ({ state, descriptors, navigation }) => {

   const userData = useSelector(state => state.user.userData);
   if (!userData.iRoleId) {
      return (
         <NavigationContainer>
            <Drawer.Navigator
               initialRouteName="Home"
               drawerStyle={{ backgroundColor: colors.LIGHT_COLOR }}
               drawerContentOptions={{
                  activeTintColor: colors.LIGHT_COLOR,
                  inactiveTintColor: colors.LIGHT_COLOR,
                  labelStyle: { fontFamily: "OpenSans-Regular", fontSize: 15 },
                  itemStyle: { marginVertical: 1 },
               }}
            >
               <Drawer.Screen
                  name="Home"
                  component={AppContainer}
                  options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.LIGHT_COLOR, fontSize: 23 }} name="home" /> }} />
            </Drawer.Navigator>

         </NavigationContainer>
      )
   }

   return (
      <NavigationContainer>
         <Drawer.Navigator
            initialRouteName="Home"
            drawerStyle={{ backgroundColor: colors.LIGHT_COLOR }}
            drawerContentOptions={{
               activeTintColor: colors.sub_theme,
               inactiveTintColor: colors.sub_theme,
               labelStyle: { fontFamily: "OpenSans-Regular", fontSize: 15 },
               itemStyle: { marginVertical: 1 },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
         >
            {userData.iRoleId == 1 ? (
               <>
                  <Drawer.Screen
                     name="Home"
                     component={AppContainer}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="home" /> }} />
                  <Drawer.Screen
                     name="Edit Profile"
                     component={PatientProfile}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-person" />, swipeEnabled: false }} />
                  <Drawer.Screen
                     name="Change Password"
                     component={ChangePassword}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 22 }} name="ios-create" />, swipeEnabled: false }} />
                  <Drawer.Screen
                     name="Payment Receipts"
                     component={PaymentReceipt}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-list" />, swipeEnabled: false }} />
                  <Drawer.Screen
                     name="Family Member"
                     component={AddMember}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-person-add" />, swipeEnabled: false }} />
                  <Drawer.Screen
                     name="Audio/Video Settings"
                     component={Settings}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-settings" />, swipeEnabled: false }} />
                  <Drawer.Screen
                     name="How It Works"
                     component={HowItWorks}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-information-circle-outline" />, swipeEnabled: false }} />
                  {/* <Drawer.Screen
                     name="Logout"
                     component={logoutHandler}
                     options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-settings" />, swipeEnabled: false }} /> */}
               </>
            ) : (
                  <>
                     <Drawer.Screen
                        name="Home"
                        component={AppContainer}
                        options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="home" /> }} />
                     <Drawer.Screen
                        name="Practice Details"
                        component={RmpPracticeDetail}
                        options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-list-box" /> }} />
                     <Drawer.Screen
                        name="Change Password"
                        component={ChangePassword}
                        options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-create" /> }} />
                     <Drawer.Screen
                        name="Manage Bank Details"
                        component={WithdrawFunds}
                        options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="md-cash" /> }} />
                     <Drawer.Screen
                        name="Audio/Video Settings"
                        component={Settings}
                        options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-settings" /> }} />
                     <Drawer.Screen
                        name="How It Works"
                        component={HowItWorks}
                        options={{ drawerIcon: () => <Icon type="Ionicons" style={{ color: colors.sub_theme, fontSize: 23 }} name="ios-information-circle-outline" />, swipeEnabled: false }} />
                  </>
               )}

         </Drawer.Navigator>
      </NavigationContainer>
   );
}


const CustomDrawerContentComponent = () => {
   const userData = useSelector(state => state.user.userData);
   return (
      <View style={[styles.divider, { alignItems: 'center', marginTop: 20 }]}>
         <Image
            source={{
               uri: data.profile_picture_url + userData.vProfilePicture,
            }}
            style={[styles.profileContainer]}
         />
         <Text style={[styles.userName]}>{userData.vFirstName} {userData.vLastName}</Text>
      </View>
   )
}

const styles = StyleSheet.create({
   divider: {
      borderBottomColor: colors.BORDER_COLOR,
      borderBottomWidth: .8,
      marginBottom: 5,
   },
   profileContainer: {
      height: 100, width: 100,
      padding: 50,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: colors.PLACEHOLDER_TEXT,
      borderColor: colors.PLACEHOLDER_TEXT,
   },
   userName: {
      fontFamily: 'OpenSans-Bold',
      fontSize: 20,
      color: colors.sub_theme,
      marginTop: 15,
      marginBottom: 5
   },
})

export default SideMenu;


function MyTabBar({ state, descriptors, navigation }) {
   return (
      <View style={{
         flexDirection: 'row', borderTopWidth: 0.7, borderColor:
            "#cccccc", elevation: 0,
      }}>
         {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
               options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                     ? options.title
                     : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
               const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
               });

               if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
               }
            };

            const onLongPress = () => {
               navigation.emit({
                  type: 'tabLongPress',
                  target: route.key,
               });
            };

            return (
               <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={{ flex: 1, alignItems: 'center', padding: 5, }}
               >
                  {route.name == "Book Appointment" && (
                     <Icon name={"md-text"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "My Appointments" && (
                     <Icon name={"ios-calendar"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "Medical  History" && (
                     <Icon name={"ios-list-box"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "Lab/Test Reports" && (
                     <Icon name={"ios-albums"} type="Ionicons" style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "Appointments" && (
                     <Icon name={"md-text"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "Earnings" && (
                     <Icon name={"ios-cash"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "Availability" && (
                     <Icon name={"calendar"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  {route.name == "Edit Profile" && (
                     <Icon name={"ios-person"} style={{ color: isFocused ? colors.sub_theme : colors.grey_heading, fontSize: 25 }} />
                  )}
                  <Text style={{
                     color: isFocused ? colors.sub_theme : colors.grey_heading, textAlign: 'center', fontFamily: isFocused ? 'OpenSans-Bold' : "OpenSans-Regular",
                     fontSize: 11
                  }}>
                     {label}
                  </Text>
               </TouchableOpacity>
            );
         })}
      </View>
   );
}

  //adb -s ZY22432S6R reverse tcp:8081 tcp:8081
  //adb -s 52001ff9fecec41f reverse tcp:8081 tcp:8081
  //react-native run-android --variant=release