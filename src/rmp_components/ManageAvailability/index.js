//import liraries
import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import HeaderComponent from '@components/HeaderComponent';
import {
    ActionSheet,
    Icon,
    Button,
    Item,
    CheckBox,
    Picker,
    Container
} from 'native-base';
import {
    postApiRequest,
    showToast,
    postApiRequestWithHeaders,
    errorHandler,
} from '../../common/user';
import Spinner from 'react-native-loading-spinner-overlay';
import { colors, constant, data } from '../../common/index';
import DatePicker from 'react-native-datepicker';
import styles from './styles';
import { connect } from "react-redux";
var Duration = ["15"];
var CANCEL_INDEX = 2;
import moment from 'moment';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const calendar = require('../../assets/imgs/calendar.png');
import CommonPopUp from '@components/CommonPopUp';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { exportDefaultSpecifier } from '@babel/types';
import { setComplete, setUserData } from "../../actions"
class ManageAvailability extends Component {
    constructor(props) {
        super(props);
        console.log(props, "props")
        this.state = {
            consultSlots: [],
            minConsultFee: "",
            minFollowUpFee: "",
            durationArray: "",
            showPopUp: false,
            iFirstConsultDuration: '15',
            fFirstConsultFee: '',
            iFollowConsultDuration: '15',
            fFollowConsultFee: '',
            selectedSlots: [],
            spinner: false,
            slots: [{
                day: "Mon",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            },

            {
                day: "Tue",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            },
            {
                day: "Wed",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            },
            {
                day: "Thu",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            },
            {
                day: "Fri",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            },
            {
                day: "Sat",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            },
            {
                day: "Sun",
                select_all: false,
                slots: [{ time: "07:00:00", is_selected: false }, { time: "07:15:00", is_selected: false }, { time: "07:30:00", is_selected: false }, { time: "07:45:00", is_selected: false },
                { time: "08:00:00", is_selected: false }, { time: "08:15:00", is_selected: false }, { time: "08:30:00", is_selected: false }, { time: "08:45:00", is_selected: false },
                { time: "09:00:00", is_selected: false }, { time: "09:15:00", is_selected: false }, { time: "09:30:00", is_selected: false }, { time: "09:45:00", is_selected: false },
                { time: "10:00:00", is_selected: false }, { time: "10:15:00", is_selected: false }, { time: "10:30:00", is_selected: false }, { time: "10:45:00", is_selected: false },
                { time: "11:00:00", is_selected: false }, { time: "11:15:00", is_selected: false }, { time: "11:30:00", is_selected: false }, { time: "11:45:00", is_selected: false },
                { time: "12:00:00", is_selected: false }, { time: "12:15:00", is_selected: false }, { time: "12:30:00", is_selected: false }, { time: "12:45:00", is_selected: false },
                { time: "13:00:00", is_selected: false }, { time: "13:15:00", is_selected: false }, { time: "13:30:00", is_selected: false }, { time: "13:45:00", is_selected: false },
                { time: "14:00:00", is_selected: false }, { time: "14:15:00", is_selected: false }, { time: "14:30:00", is_selected: false }, { time: "14:45:00", is_selected: false },
                { time: "15:00:00", is_selected: false }, { time: "15:15:00", is_selected: false }, { time: "15:30:00", is_selected: false }, { time: "15:45:00", is_selected: false },
                { time: "16:00:00", is_selected: false }, { time: "16:15:00", is_selected: false }, { time: "16:30:00", is_selected: false }, { time: "16:45:00", is_selected: false },
                { time: "17:00:00", is_selected: false }, { time: "17:15:00", is_selected: false }, { time: "17:30:00", is_selected: false }, { time: "17:45:00", is_selected: false },
                { time: "18:00:00", is_selected: false }, { time: "18:15:00", is_selected: false }, { time: "18:30:00", is_selected: false }, { time: "18:45:00", is_selected: false },
                { time: "19:00:00", is_selected: false }, { time: "19:15:00", is_selected: false }, { time: "19:30:00", is_selected: false }, { time: "19:45:00", is_selected: false },
                { time: "20:00:00", is_selected: false }, { time: "20:15:00", is_selected: false }, { time: "20:30:00", is_selected: false }, { time: "20:45:00", is_selected: false },
                { time: "21:00:00", is_selected: false }, { time: "21:15:00", is_selected: false }, { time: "21:30:00", is_selected: false }, { time: "21:45:00", is_selected: false },
                { time: "22:00:00", is_selected: false }, { time: "22:15:00", is_selected: false }, { time: "22:30:00", is_selected: false }, { time: "22:45:00", is_selected: false },
                { time: "23:00:00", is_selected: false }]
            }
            ]
        }
    }

    componentDidMount() {
        this.hitUserDetailApi();
        if (this.props.user_data.eApprovalStatus == "Unapproved") {
            this.setState({ showPopUp: true })
        } else {

            // this.getAvailability();
            this.getCommonData();
        }
    }
    hitUserDetailApi = () => {
        postApiRequestWithHeaders(data.api_endpoint.user_details, {}, this.props.user_data.vAccessToken).then(
            data => {
                console.log(data, "user_details data....");
                if (data.user.eApprovalStatus == "Unapproved") {
                    this.setState({ showPopUp: true })
                } else {
                    this.setState({ showPopUp: false });
                    this.getAvailability();
                    this.getCommonData();
                }
                this.props.setUserData(data.user);
            },
            error => {
                console.log(error, 'errorrrrrr');
            },
        );
    }

    navigator = (action, data) => {
        switch (action) {
            case "next":
                console.log(this.state);
                this.checkValidation();
                break;

            case "back":
                // this.props.clickHandler('back');
                this.props.navigation.navigate("MyAccount")
                break;

            default:
                break;
        }
    }

    getCommonData = () => {
        postApiRequestWithHeaders(data.api_endpoint.general_data, {}, this.props.user_data.vAccessToken).then(
            data => {
                //   console.log(data, "getCommonData");
                this.setState({
                    consultSlots: data.data.duration.map(obj => obj.iDuration),
                    durationArray: data.data.duration,
                    // consultSlots: data.data.consultSlots,
                    minConsultFee: data.data.duration[0].fMinConsultFee,
                    minFollowUpFee: data.data.duration[0].fMinFollowUpFee,
                    // minConsultFee: data.data.minConsultFee,
                    // minFollowUpFee: data.data.minFollowUpFee,
                })
            },
            error => {
                console.log(error, 'errorrrrrr');
            },
        );
    }

    checkValidation = () => {
        if (this.state.iFirstConsultDuration == 'Duration') {
            showToast(data.ToastMessages.consult_duration);
            return false;
        }
        else if (this.state.fFirstConsultFee == '') {
            showToast(data.ToastMessages.consult_fee);
            return false;
        }
        else if (parseInt(this.state.fFirstConsultFee) < parseInt(this.state.minConsultFee)) {
            showToast("Minimum consult fees is Rs." + this.state.minConsultFee);
            return false;
        }
        else if (this.state.iFollowConsultDuration == 'Duration') {
            showToast(data.ToastMessages.follow_duration);
            return false;
        }

        else if (this.state.fFollowConsultFee == '') {
            showToast(data.ToastMessages.follow_fee);
            return false;
        }
        else if (parseInt(this.state.fFollowConsultFee) < parseInt(this.state.minFollowUpFee)) {
            showToast("Minimum follow up fees is " + this.state.minFollowUpFee);
            return false;
        }
        else {
            var selected_slots = [];
            this.state.slots.map((day, index) => {
                selected_slots.push({ day: day.day, slots: [] })
                day.slots.map(slot => {
                    if (slot.is_selected) {
                        selected_slots[index].slots.push(slot.time)
                    }
                })
            })
            if (selected_slots[0].slots.length == 0 && selected_slots[1].slots.length == 0 && selected_slots[2].slots.length == 0 && selected_slots[3].slots.length == 0 && selected_slots[4].slots.length == 0 && selected_slots[5].slots.length == 0 && selected_slots[6].slots.length == 0) {
                showToast("Please choose an availability");
            } else {
                this.addAvailability();
            }

        }
    }

    addAvailability = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);
        var selected_slots = [];
        this.state.slots.map((day, index) => {
            selected_slots.push({ day: day.day, slots: [] })
            day.slots.map(slot => {
                if (slot.is_selected) {
                    selected_slots[index].slots.push(slot.time)
                }
            })
        })

        var param = {
            iFirstConsultDuration: this.state.iFirstConsultDuration,
            fFirstConsultFee: this.state.fFirstConsultFee,
            iFollowConsultDuration: this.state.iFollowConsultDuration,
            fFollowConsultFee: this.state.fFollowConsultFee,
            slots: selected_slots

        }
        // console.log(param, "parammmm...");
        // console.log(JSON.stringify(param));
        postApiRequestWithHeaders(data.api_endpoint.add_availability_new, param, this.props.user_data.vAccessToken).then(
            data => {
                this.setState({
                    spinner: !this.state.spinner
                });
                showToast(data.message);
                this.checkCompletess();
                // this.props.clickHandler('back');
                this.props.navigation.navigate("MyAccount")
            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
                console.log(error, 'errorrrrrr');
            },
        );
    }
    checkCompletess = () => {
        postApiRequestWithHeaders(data.api_endpoint.user_complete, {}, this.props.user_data.vAccessToken).then(
            data => {
                //.log(data, "checkCompletess");
                this.props.setComplete(data.profile_status);
            },
            error => {
                console.log(error, 'errorrrrrr');
            },
        );
    }
    getAvailability = () => {
        setTimeout(() => {
            this.setState({
                spinner: !this.state.spinner
            });
        }, 100);

        postApiRequestWithHeaders(data.api_endpoint.get_availability_new, {
            dRmpAvailDate: "01-01-1515",
        }, this.props.user_data.vAccessToken).then(
            data => {
                //   console.log("get data.....", data);
                this.setState({
                    spinner: !this.state.spinner
                });
                if (Object.keys(data.availability).length != 0) {
                    this.setState({
                        iFirstConsultDuration: data.availability.iFirstConsultDuration != "0" ? data.availability.iFirstConsultDuration : this.state.consultSlots[0],
                        fFirstConsultFee: data.availability.fFirstConsultFee,
                        iFollowConsultDuration: data.availability.iFollowConsultDuration != "0" ? data.availability.iFollowConsultDuration : this.state.consultSlots[0],
                        fFollowConsultFee: data.availability.fFollowConsultFee,

                        selectedSlots: [],

                    })

                    var curr_slot = data.availability.slots;
                    this.state.slots.map((m, index) => {
                        m.slots.map(m1 => {
                            curr_slot[index].slots.map(m2 => {
                                if (m2 == m1.time) {
                                    m1.is_selected = true
                                }
                            })
                        })
                    })
                    this.setState({ slots: this.state.slots })
                } else {
                    this.setState({
                        iFirstConsultDuration: 'Duration',
                        fFirstConsultFee: '',
                        iFollowConsultDuration: 'Duration',
                        fFollowConsultFee: '',
                        selectedSlots: [],
                    })
                }

            },
            error => {
                showToast(error);
                this.setState({
                    spinner: !this.state.spinner
                });
            },
        );
    }

    popUpClick = (status) => {
        //  console.log(status);
        this.setState({ showPopUp: !this.state.showPopUp })
        switch (status) {
            case "back":
                // this.props.clickHandler('back');
                this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'MyAccount' }],
                });
                // this.props.navigation.navigate("MyAccount")
                break;

            default:
                break;
        }

    }
    render() {
        return (
            <Container style={styles.container}>
                {this.state.showPopUp && (
                    <SafeAreaView style={{
                        zIndex: 2,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: width,
                        height: height,
                    }}>
                        <CommonPopUp clickHandler={this.popUpClick} title="Verfication" msg="Your account needs to be approved before adding availability."></CommonPopUp>
                    </SafeAreaView>
                )}
                <HeaderComponent show_headingCenter={true}
                    show_menu={true}
                    navigation={this.props.navigation}
                    clickHandler={this.navigator} title={constant.page_titles.MANAGE_AVAILABLE}></HeaderComponent>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.mainContent}
                    keyboardDismissMode="interactive"
                    keyboardShouldPersistTaps="handled">
                    <Spinner
                        color={colors.sub_theme}
                        visible={this.state.spinner}
                        textContent={''}
                    />


                    <View style={{ marginTop: 0, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                            <Text style={styles.headingText}>First Consult</Text>
                            <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                <TouchableOpacity onPress={() =>
                                    ActionSheet.show(
                                        {
                                            options: this.state.consultSlots,
                                            cancelButtonIndex: this.state.consultSlots.length,
                                            title: "Select Duration (min)"
                                        },
                                        buttonIndex => {
                                            // console.log(this.state.durationArray.find(obj => obj.iDuration == this.state.consultSlots[buttonIndex]).fMinConsultFee, "vallllll")
                                            this.setState({
                                                iFirstConsultDuration: this.state.consultSlots[buttonIndex],
                                                minConsultFee: this.state.durationArray.find(obj => obj.iDuration == this.state.consultSlots[buttonIndex]).fMinConsultFee,
                                                minFollowUpFee: this.state.durationArray.find(obj => obj.iDuration == this.state.consultSlots[buttonIndex]).fMinFollowUpFee
                                            });
                                        }
                                    )}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.numberInput}>{this.state.iFirstConsultDuration}</Text>
                                        <Icon
                                            style={[{
                                                alignSelf: 'center',
                                                color: colors.sub_theme,
                                                paddingRight: 5
                                            }]}
                                            name='ios-arrow-down' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                            <Text style={styles.headingText}>Fee</Text>
                            <View style={styles.numberInputContainer}>
                                <TextInput
                                    style={styles.numberInput}
                                    keyboardType="numeric"
                                    maxLength={32}
                                    ref={ref => (this.textInputRef = ref)}
                                    // autoFocus={true}
                                    selectionColor={colors.THEME_YELLOW}
                                    onChangeText={name => this.setState({ fFirstConsultFee: name })}
                                    value={this.state.fFirstConsultFee}
                                >
                                </TextInput>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 15, marginRight: 15 }}>
                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                            <Text style={styles.headingText}>Follow-up Consult</Text>
                            <View style={[styles.numberInputContainerRow, { fontSize: 20 }]}>
                                <TouchableOpacity onPress={() =>
                                    ActionSheet.show(
                                        {
                                            options: this.state.consultSlots,
                                            cancelButtonIndex: this.state.consultSlots.length,
                                            title: "Select Duration (min)"
                                        },
                                        buttonIndex => {
                                            this.setState({
                                                iFollowConsultDuration: this.state.consultSlots[buttonIndex],
                                                minConsultFee: this.state.durationArray.find(obj => obj.iDuration == this.state.consultSlots[buttonIndex]).fMinConsultFee,
                                                minFollowUpFee: this.state.durationArray.find(obj => obj.iDuration == this.state.consultSlots[buttonIndex]).fMinFollowUpFee
                                            });
                                        }
                                    )}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.numberInput}>{this.state.iFollowConsultDuration}</Text>
                                        <Icon
                                            style={[{
                                                alignSelf: 'center',
                                                color: colors.sub_theme,
                                                paddingRight: 5
                                            }]}
                                            name='ios-arrow-down' />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 1, paddingRight: 5, paddingLeft: 5 }}>
                            <Text style={styles.headingText}>Fee</Text>
                            <View style={styles.numberInputContainer}>
                                <TextInput
                                    style={styles.numberInput}
                                    keyboardType="numeric"
                                    maxLength={32}
                                    ref={ref => (this.textInputRef = ref)}
                                    // autoFocus={true}
                                    selectionColor={colors.THEME_YELLOW}
                                    onChangeText={name => this.setState({ fFollowConsultFee: name })}
                                    value={this.state.fFollowConsultFee}
                                >
                                </TextInput>
                            </View>
                        </View>
                    </View>


                    <View style={{ marginTop: 15, marginLeft: 15, marginRight: 15 }}>

                        <View style={{ paddingRight: 5, paddingLeft: 5 }}>
                            <Text style={styles.headingText}>Select/Unselect Slots Per Your Availability </Text>

                        </View>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItem: 'center', marginLeft: 5, marginRight: 5, height: height / 2 - 40 }}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            contentContainerStyle={{ alignItems: "center" }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <View>
                                        <Text style={[styles.time_text]}>{''}  </Text>
                                        <Text style={[styles.time_text, { fontFamily: 'OpenSans-Regular', }]}>
                                            Select All
                                    </Text>
                                    </View>
                                    {this.state.slots[0].slots.map((slot, idx) => {
                                        return (
                                            <Text style={[styles.time_text]}>
                                                {moment(slot.time, "HH:mm:ss").format("hh:mm A")}
                                            </Text>
                                        )
                                    })}
                                </View>
                                {this.state.slots.map((current_day, index) => {
                                    return (
                                        <View style={{ alignItems: 'center' }}>
                                            <View>
                                                <Text style={[styles.time_text, { color: colors.THEME_YELLOW }]}>
                                                    {current_day.day} </Text>
                                                <CheckBox
                                                    onPress={() => {
                                                        this.selectAll(index);
                                                    }}
                                                    style={[styles.checkboxContainer, { marginRight: 20, marginLeft: 0, borderColor: current_day.select_all ? colors.THEME_YELLOW : colors.PLACEHOLDER_TEXT }]} color={colors.THEME_YELLOW}
                                                    checked={current_day.select_all ? true : false}
                                                />
                                            </View>

                                            {current_day.slots.map((slot, idx) => {
                                                return (<CheckBox
                                                    onPress={() => {
                                                        this.selectCheckbox(index, idx);
                                                    }}
                                                    style={[styles.checkboxContainer, { marginRight: 20, marginLeft: 0 }]} color={colors.sub_theme}
                                                    checked={this.state.slots[index].slots[idx].is_selected ? true : false}
                                                />)
                                            })}
                                        </View>)
                                })}
                            </View>
                        </ScrollView>
                    </View>
                    <View style={{ paddingTop: 5, }}>
                        <Button style={styles.nextButtonContainer}
                            onPress={() => {
                                this.navigator('next');
                            }} >
                            <Text style={styles.nextButton}>SAVE</Text>
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
            </Container>
        );
    }


    selectCheckbox = (outer_index, inner_index) => {
        this.state.slots[outer_index].slots[inner_index].is_selected = !this.state.slots[outer_index].slots[inner_index].is_selected;
        this.setState({ slots: this.state.slots })
    }

    selectAll = (index) => {
        // console.log(index);
        if (this.state.slots[index].select_all == false) {
            this.state.slots[index].select_all = true;

            this.state.slots[index].slots.map(m => {
                return m.is_selected = true
            })
            this.setState({ slots: this.state.slots })
        } else {
            this.state.slots[index].select_all = false;
            this.state.slots[index].slots.map(m => {
                return m.is_selected = false
            })
            this.setState({ slots: this.state.slots })
        }
    }
}


function mapStateToProps(state) {
    // console.log(state.user.userData, "state.user.userData")
    return {
        user_data: state.user.userData,

    }
}
export default connect(mapStateToProps, { setComplete, setUserData })(ManageAvailability);
