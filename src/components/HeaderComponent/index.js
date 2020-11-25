//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
    Header,
    Left,
    Body,
    Right,
    Title,
    Button,
    Icon, Container
} from 'native-base';
import { colors } from '../../common';
import { DrawerActions } from '@react-navigation/native';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
//const back = require('../../assets/imgs/back.png');
// create a component
class HeaderComponent extends Component {

    navigator = action => {
        if(action == "menu"){
            this.props.navigation.dispatch(DrawerActions.toggleDrawer());
            return;
        }
        this.props.clickHandler(action);
    }
    
    headingStyle = this.props.show_headingCenter ? {flex:7, alignItems: "center", right: 0} : {flex: 5};

    render() {
        return (
            <Header transparent style={[styles.header, {}]}>
                <Left style={{ flex:1 }}>
                    {this.props.show_back && (
                        <TouchableOpacity
                        styles
                            transparent
                            hitSlop={hitSlop}
                            onPress={() => this.navigator('back')}>
                            <Icon
                                style={[
                                    styles.black_text,
                                ]}
                                name="ios-arrow-back"
                            />
                        </TouchableOpacity>
                    )}
                    {this.props.show_menu && (
                        <TouchableOpacity
                        styles
                            transparent
                            hitSlop={hitSlop}
                            onPress={() => this.navigator("menu")}>
                            <Icon
                                style={[
                                    styles.black_text,
                                ]}
                                name="ios-menu"
                            />
                        </TouchableOpacity>
                    )}
                </Left>
                <Body style={this.headingStyle}>
                    <Title style={[styles.pageTitle]}>{this.props.title}</Title>
                </Body>
                <Right>
                </Right>
            </Header>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    header: {
    },
    pageTitle: {
        paddingTop: 15,
        flex: 1,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme,
        marginLeft: 15

    },
    black_text: {
        color: colors.sub_theme,
        paddingLeft: 12,
    },
});

//make this component available to the app
export default HeaderComponent;
