import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        padding: 20,
        borderBottomWidth: 1,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginLeft: 10,
        marginRight: 10

    },
    boldText: {
        color: colors.sub_theme,
        fontFamily: "OpenSans-Bold",
    },
    normalFont: {
        fontFamily: "OpenSans-Regular",
    },
    normalFontSize: {
        fontSize: 18,
    },

    largeFontSize: {
        fontSize: 18,
    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: 'center',
        marginTop: 70
    },

});
