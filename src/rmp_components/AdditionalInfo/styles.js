import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
const { width: Width } = Dimensions.get('window')
import { colors } from '../../common/index';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({

    mainContainer: {
        flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
        height: Dimensions.get('window').height
    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 25,
        color: colors.sub_theme
    },
    subheadingText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.sub_theme,
        lineHeight: 30,
        textAlign: "center",
        marginTop: 10
    },
    textAreatStyle: {
        width: "100%",
        borderRadius: 5,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginTop: 20,
        paddingTop: 20,
        color: colors.BLACK_TEXT
    },
    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        width: Width - 40,
        justifyContent: 'center',
        height: 60,
        marginBottom: 20,
        borderRadius: 5
    },
    nextButton: {
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
    }
})