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
        flex: 1,
        alignItems: 'center',
        marginTop: 10,
        // height: Dimensions.get('window').height
    },
    headingText: {
        margin: 20,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center',
        color: colors.sub_theme
    },
    headingTextLabel: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: colors.sub_theme
    },
    numberInputContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 5,
        width: width - 40
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        padding: 7,
        paddingBottom: 9,
        width: "70%",
        color: colors.BLACK_TEXT

    },
    nextButtonContainer: {
        backgroundColor: colors.danger,
        margin: 20,
        width: width - 40,
        justifyContent: 'center',
        height: 50,
        marginBottom: 50,
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,

    },
    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },
});
