import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    headingText: {
        margin: 40,
        marginTop: 10,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center',
        color: colors.sub_theme
    },
    headingText_inner: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 26,
        textAlign: 'center',
        color: colors.sub_theme,
    },
    headingTextStatus: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 23,
        textAlign: 'center',
        color: colors.geen_txt
    },
    instructionText: {
        color: colors.danger,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 30
    },
    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        marginTop: 50,
        justifyContent: 'center',
        height: 50,
    },
    nextButton: {
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,
    },
    mainContainer: {
        padding: 20,
    },

});
