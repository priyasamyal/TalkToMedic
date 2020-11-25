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
        height: Dimensions.get('window').height,

    },
    headingText: {
        margin: 30,
        marginTop: 30,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        textAlign: 'center',
        color: colors.sub_theme
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        marginTop: 30,
        width: width - 80,
        //width: "70%",
        padding: 15
    },
    body_style: {
        paddingBottom: 2,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.LIGHT_COLOR
    },

    black_text: {
        color: colors.BLACK,
        paddingLeft: 10,
    },
});
