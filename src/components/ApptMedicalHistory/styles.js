import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,

        padding: 10,
        paddingTop: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme,
        marginTop: 10
    },
    headingSubText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.sub_theme
    },
    longText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.PLACEHOLDER_TEXT
    },
    numberInputContainerRow: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 8,
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: "left",
        paddingLeft: 0,
        // marginLeft: 5,
        color: colors.sub_theme
    },
    dateContainer: {
        paddingBottom: 3,
        // padding: 5,
        marginTop: 20,
    },
    dateInnerContainer: {
        padding: 10,
        //  marginTop: 0,
        ///marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
    },
    nextButtonContainer: {
        height: 50,
        backgroundColor: colors.sub_theme,
        width: "80%",
        justifyContent: 'center',
        alignSelf: 'center'
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,

    },
});
