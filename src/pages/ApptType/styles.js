import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },

    mainContainer: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        // alignItems: 'center',
        // marginTop: 10,
        height: Dimensions.get('window').height,

    },
    headingText: {
        margin: 30,
        marginTop: 30,
        marginBottom: 20,
        fontFamily: 'OpenSans-Bold',
        fontSize: 25,
        color: colors.sub_theme
    },



    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        margin: 20,
        marginTop: 40,
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

    checkboxContainer: {
        marginRight: 25,
        marginTop: 3,
        paddingLeft: 4,
        borderRadius: 5
    },
    checkboxText: {
        color: colors.sub_theme,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
    },
});
