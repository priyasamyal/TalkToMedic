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
        paddingTop: 75,
        height: height
    },
    inner_container: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        width: "90%",
        height: "100%",
        alignSelf: 'center',
        // borderWidth: 1,
        // borderColor: colors.THEME_YELLOW
    },
    header_text: {
        fontSize: 25,
        fontFamily: 'OpenSans-Bold',
        color: colors.THEME_YELLOW,
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
        //width: "95%",
        justifyContent: 'center',
        //  margin: 8,
        height: 55,
        marginTop: 10
    },
    back_btn_txt: {
        color: colors.GREY_TEXT,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
    },

    end_btn: {
        borderWidth: 1,
        borderColor: colors.THEME_YELLOW,
        backgroundColor: colors.THEME_YELLOW,
        //width: "95%",
        justifyContent: 'center',
        marginTop: 15,
        // margin: 8,
        height: 55
    },
    end_btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        //  padding: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    numberInputContainer: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 5,
        width: "100%"
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        padding: 7,
        paddingBottom: 9,
        // width: "70%",
        color: colors.sub_theme

    },

})