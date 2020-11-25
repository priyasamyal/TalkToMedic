import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    // header: {
    //     margin: 5,
    // },
    // pageTitle: {
    //     fontFamily: 'PTSans-Bold',
    //     fontWeight: 'bold',
    //     fontSize: 20,
    //     paddingTop: 10
    // },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        height: Dimensions.get('window').height
    },
    headingText: {
        margin: 40,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center',
        color: colors.sub_theme,
        marginTop:0,
        //marginBottom:20,
    },
    mainContainer: {
        flex: 1,
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        height: 58,
        width: width - 80
    },
    numberContainer: {
        width: '20%',
        alignItems: 'center',
        borderRightWidth: 0.8,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginRight: 5,
        paddingRight: 3,
        marginTop: 5,
        marginBottom: 6,
    },
    inputContainer: {
        marginLeft: 6,
        width: '60%',
        justifyContent: 'center',
        paddingBottom: 1,
    },
    countryCodeText: {
        color: colors.sub_theme,
        padding: 5,
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
    },
    numberInputInnerContainer: {
        width: 1,
        borderLeftWidth: 1,
        borderColor: colors.GREY_TEXT,
        backgroundColor: 'red',
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.sub_theme,
        paddingLeft: 7,
    },
    nextButtonContainer: {
        justifyContent: 'flex-end',
        width: width,
        alignSelf: 'flex-end',
        paddingTop: 10,
        position: 'absolute',
        right: 0,
        bottom: '10%',
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
        justifyContent:'flex-end',
        marginBottom:30
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