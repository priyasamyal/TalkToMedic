import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: "OpenSans-Regular",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 7,
    },
    mainContainer: {
        flex: 1,
    },
    mainContent: {
        flex: 2,
        alignItems: 'center',
        marginTop: 10,
        height: Dimensions.get('window').height / 1.2
    },
    headingText: {
        margin: 40,
        marginTop: 0,
        marginBottom: 20,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center',
        letterSpacing: 0.8,
        color: colors.sub_theme
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        width: width - 80
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        padding: 7,
        paddingBottom: 9,
        width: "70%",
        color: colors.sub_theme

    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: width - 20,
        // alignSelf: 'flex-end',
        paddingTop: 10,
        position: 'absolute',
        bottom: "10%",
    },
    nextButton: {
        color: colors.THEME_YELLOW,
        fontFamily: 'OpenSans-Regular',
        fontSize: 22,
        fontWeight: 'bold',
        opacity: 0.4,
        letterSpacing: 0.8
    },
    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },
    continueBtnContainer: {
        width: width - 60,
        marginTop: 0,
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    continueBtn: {
        backgroundColor: colors.THEME_YELLOW,
        justifyContent: 'center',
        height: 55,
        borderRadius: 5
    },
    continueBtnTxt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        fontWeight: "600"
    }
});