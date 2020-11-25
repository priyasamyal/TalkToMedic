import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        padding: 20
    },
    inner_container: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        width: "90%",
        alignSelf: 'center',
    },
    header_text: {
        fontSize: 28,
        fontFamily: 'OpenSans-Bold',
        // color: colors.THEME_YELLOW,
        color: colors.danger,
        paddingBottom: 10
    },
    description_text: {
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
        color: colors.GREY_TEXT,
        letterSpacing: 0.8,
        paddingBottom: 15,
        paddingRight: 25,
        paddingLeft: 25,
        alignSelf: 'center',
        textAlign: 'center'
    },
    back_btn: {
        borderWidth: 2,
        borderColor: colors.GREY_TEXT,
        backgroundColor: 'transparent',
        width: "95%",
        justifyContent: 'center',
        margin: 8,
        height: 55
    },
    back_btn_txt: {
        color: colors.GREY_TEXT,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
    },

    end_btn: {
        borderWidth: 1,
        // borderColor: colors.THEME_YELLOW,
        // backgroundColor: colors.THEME_YELLOW,
        borderColor: colors.danger,
        backgroundColor: colors.danger,
        width: "95%",
        justifyContent: 'center',
        margin: 8,
        height: 55
    },
    end_btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
    }


})