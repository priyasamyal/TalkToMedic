//import liraries
import React, { Component } from 'react';
import {
    StyleSheet, YellowBox
} from 'react-native';
import AppContainer from './routes';
import { Root } from 'native-base';
import SplashScreen from 'react-native-splash-screen'
// import { createStore, combineReducers } from 'redux';
// import UserReducer from "./reducers/userReducer";
// import { Provider } from 'react-redux';
// create a component


YellowBox.ignoreWarnings([
    'VirtualizedLists should never be nested',
    'Sending `onAnimatedValueUpdate` with no listeners registered.',
    "Warning: VirtualizedLists should never be nested inside plain ScrollViews with the same orientation",
    "Warning: DatePickerIOS has been merged with DatePickerAndroid",
    "Sending `Proximity`",
    "Warning: Sending `Proximity`",
    "Warning: Sending `Proximity` with no listeners registered",
    'Warning: Failed prop type',
    'Warning: Failed prop type: Invalid prop `children` supplied to `OTSession`',
    'Task orphaned',
    'Warning: componentWillMount is deprecated',
    'Warning: Each child in a list should have a unique "key" prop',
    'Warning: Task orphaned for request',
    'Warning: componentWillUpdate is deprecated',
    'Warning: componentWillReceiveProps is deprecated',
    "Warning: Can't perform a React state update on an unmounted component",
    "Warning: componentWillReceiveProps has been renamed",
    "Warning: componentWillMount has been renamed",
    "Warning: Task orphaned for request",
    "Warning: Sending `onAnimatedValueUpdate` with no listeners registered",
    "Warning: Sending onAnimatedValueUpdate with no listeners registered",
    "Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`",
    "Animated.event now requires a second argument for options"
]);
class App extends Component {
    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return (
            <Root>
                <AppContainer></AppContainer>
            </Root>

        );
    }


}


export default App;
