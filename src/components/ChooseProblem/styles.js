import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {

    },
    pageTitle: {
        paddingTop: 5,

        //  flex: 1,
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: colors.PLACEHOLDER_TEXT
    },
    black_text: {
        color: colors.PLACEHOLDER_TEXT,
        marginLeft: 5,
        fontSize: 25,
        justifyContent: 'center'
    },
    headingText: {
        margin: 5,
        marginTop: 0,
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        //textAlign: 'center',
        color: colors.sub_theme
    },
    headingTextSub: {

        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        textAlign: 'center',
        color: colors.PLACEHOLDER_TEXT
    },
    numberInputContainer: {
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.geen_txt,
        margin: 5,
        padding: 7,
        width: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    body_style: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        color: colors.geen_txt,
        textAlign: "center"

    },
    mainContainer: {
        flex: 1,
    
        padding: 15,
        paddingTop:0,
    },
    mainContent: {
        flex: 1,
        marginTop: 10,
        // height: Dimensions.get('window').height
    },

    nextButtonContainer: {
        height: 50,
        backgroundColor: colors.THEME_YELLOW,
        width: width - 40,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,

    },
    numberInputContainer1: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingTop: 2,
        paddingLeft: 5,
        marginLeft: 5,
        marginBottom: 5,
        width: width - 40
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        padding: 5,
        paddingBottom: 8,
        width: "87%",
        color: colors.BLACK_TEXT
    },

});