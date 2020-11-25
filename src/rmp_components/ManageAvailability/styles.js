import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
       // padding: 20,
    },
    // mainContent: {
    //     flex: 1,
    //     alignItems: 'center',
    //     //   height: Dimensions.get('window').height,

    // },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 15,
        color: colors.sub_theme
    },
    numberInputContainer: {
        // flexDirection: 'row',  
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        //paddingBottom: 3,
       // padding: 2,
        marginTop: 5,
        // width: width - 40
    },
    numberInputContainerRow: {
        // flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,

        marginTop: 5,
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
         padding: 5,
        paddingBottom: 7,
        color: colors.BLACK_TEXT
        //  width: "70%",
    },
    checkboxText: {
        color: colors.sub_theme,
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        justifyContent: 'center'
    },
    checkboxContainer: {
        marginRight: 25,
        //  paddingLeft: 4,
        borderRadius: 5
    },
    stateCouncilTxt: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.BLACK_TEXT,
        paddingBottom: 5,
        paddingLeft: 5
    },
    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        margin: 20,
        width: width - 40,
        justifyContent: 'center',
        height: 50,
        //marginBottom: 50

    },
    buttonContainer: {
        height: 30,
        backgroundColor: colors.PLACEHOLDER_TEXT,
        padding: 15,
        //   width: width - 40,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    nextButton: {
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,

    },
    slotButton: {
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,

    },
    // // black_text: {
    // //     color: colors.BLACK,
    // //     paddingLeft: 10,
    // // },
    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },

    columns: {
        flex: 1,
        flexDirection: 'row',
    },

    time_text: {
        color: colors.sub_theme,
        fontFamily: 'OpenSans-Bold',
        height: 20,
        margin: 5,
        marginTop: 2,
        fontSize: 12
    },
    checkboxContainer: {
        // marginRight: 15,
        // paddingTop: 0,
        // paddingLeft: 4,
        height: 20,
        margin: 5,
        marginTop: 2,
        borderRadius: 5,
        borderColor: colors.PLACEHOLDER_TEXT
    },
});
