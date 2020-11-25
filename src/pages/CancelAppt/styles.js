import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },
    pageTitle: {
        fontFamily: "OpenSans-Bold",
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 10
    },
    mainContainer: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        // marginTop: 10,
        height: Dimensions.get('window').height,

    },
    headingText: {
        margin: 30,
        marginTop: 30,
        marginBottom: 0,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        textAlign: 'center',
        color: colors.sub_theme
    },
    headingTextDec: {
        marginBottom: 10,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center',
        color: colors.PLACEHOLDER_TEXT
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.geen_txt,
        marginTop: 30,
        width: width - 80,
        //width: "70%",
        padding: 15
    },
    body_style: {
        paddingBottom: 2,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.geen_txt
    },

    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },

    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        margin: 20,
        width: width - 40,
        justifyContent: 'center',
        height: 50,
    },
    nextButton: {
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,

    },
});
