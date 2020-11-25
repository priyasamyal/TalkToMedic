/*
 * @Author: ashoka 
 * @Date: 2018-05-20 14:40:24 
 */
import React, { Component } from 'react';
import {
    View,
    Picker,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal
} from 'react-native';
import { colors } from '../../common/index';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
export default class YearMonthPicker extends Component {
    constructor(props) {
        super(props);
        let { startYear, endYear, selectedYear, selectedMonth, visiable } = props;
        console.log(selectedMonth, "selectedMonth..")
        let years = this.getYears(startYear, endYear);
        let months = this.getMonths();
        selectedYear = selectedYear || years[0];

        selectedMonth = selectedMonth || ((new Date()).getMonth() + 1);
        if (selectedMonth < 10) {
            selectedMonth = "0" + selectedMonth
        }
        this.state = {
            years,
            months,
            selectedYear,
            selectedMonth,
            visiable: visiable || false
        }
    }

    show = async ({ startYear, endYear, selectedYear, selectedMonth }) => {
        let years = this.getYears(startYear, endYear);
        let months = this.getMonths();
        selectedYear = selectedYear || years[0];
        selectedMonth = selectedMonth || ((new Date()).getMonth() + 1);
        if (selectedMonth < 10) {
            selectedMonth = "0" + selectedMonth
        }
        let promise = new Promise((resolve) => {
            this.confirm = (year, month) => {
                resolve({
                    year,
                    month
                });
            }
            this.setState({
                visiable: true,
                years,
                months,
                startYear: startYear,
                endYear: endYear,
                selectedYear: selectedYear,
                selectedMonth: selectedMonth,
            })
        })
        return promise;
    }

    dismiss = () => {
        this.setState({
            visiable: false
        })
    }

    getYears = (startYear, endYear) => {
        startYear = startYear || (new Date()).getFullYear();
        endYear = endYear || (new Date()).getFullYear();
        let years = []
        for (let i = startYear; i <= endYear; i++) {
            // console.log(i)
            years.push(i.toString())
        }
        return years;
    }

    getMonths = () => {
        let months = []
        for (let i = 1; i <= 12; i++) {
            if (i < 10) {
                months.push("0" + i);
            } else {
                months.push(i);
            }

        }
        return months;
    }

    renderPickerItems = (data) => {
        let items = data.map((value, index) => {
            return (<Picker.Item key={'r-' + index} label={'' + value} value={value} />)
        })
        return items;
    }

    onCancelPress = () => {
        this.dismiss();
    }

    onConfirmPress = () => {
        const confirm = this.confirm;
        const { selectedYear, selectedMonth } = this.state;
        confirm && confirm(selectedYear, selectedMonth);
        this.dismiss();
    }

    render() {
        const { years, months, selectedYear, selectedMonth, visiable } = this.state;
        if (!visiable) return null;
        return (
            <TouchableOpacity
                style={styles.modal}
                // onPress={this.onCancelPress}
                onPress={() => this.renderPickerItems(years)}
            >
                <View
                    style={styles.outerContainer}
                >
                    <View style={styles.toolBar}>
                        <TouchableOpacity style={styles.toolBarButton} onPress={this.onCancelPress}>
                            <Text style={[styles.toolBarButtonText, { color: colors.BORDER_COLOR }]}>Cancel</Text>
                        </TouchableOpacity>



                        <View style={{ flex: 1 }} />

                        <TouchableOpacity style={styles.toolBarButton} onPress={this.onConfirmPress}>
                            <Text style={[styles.toolBarButtonText, { color: colors.THEME_YELLOW }]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.innerContainer}>

                    </View> */}
                    <View style={styles.innerContainer}>
                        {/* <Picker
                            style={styles.picker}
                            selectedValue={selectedMonth}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedMonth: itemValue })}
                        >
                            {this.renderPickerItems(months)}
                        </Picker> */}
                        <Picker
                            style={styles.picker}
                            selectedValue={selectedYear}
                            onValueChange={(itemValue, itemIndex) => this.setState({ selectedYear: itemValue })}
                        >
                            {this.renderPickerItems(years)}
                        </Picker>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        zIndex: 2,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outerContainer: {
        backgroundColor: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: ScreenHeight <= 650 ? "35%" : "55%",
    },
    toolBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 54,
        borderBottomWidth: 1,
        borderColor: '#EBECED',
    },
    toolBarButton: {
        height: 54,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    toolBarButtonText: {
        fontSize: 18,
        color: '#2d4664',
        fontFamily: 'OpenSans-Bold',
    },
    innerContainer: {
        zIndex: 5,
        flex: 1,
        flexDirection: 'row',
        //alignItems: "center",
        // width: 40,
        // backgroundColor: 'red',
        // height: 30
    },
    picker: {
        flex: 5,
        //justifyContent: 'center'
        // backgroundColor: 'red',
    }
})