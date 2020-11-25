import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    header: {
        margin: 5,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
    },
    pageTitle: {
        fontFamily: 'OpenSans-Bold',
        fontWeight: 'bold',
        fontSize: 20,
        paddingTop: 5,
        color: colors.sub_theme,
        marginLeft: 15
    },
    skipText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.THEME_YELLOW,
        // paddingBottom: 25,
        textDecorationLine: "underline",

    },
    image: {
        width: 450,
        height: 250,
        resizeMode: 'contain',
        // margin: 20,
        // marginBottom: 20,
        marginTop: 20,
    },
    content_block: {},
    title: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 24,
        color: colors.sub_theme,
        backgroundColor: 'transparent',
        textAlign: 'center',
        fontWeight: 'bold',
        width: width,
    },
    text: {
        paddingTop: 10,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        color: colors.sub_theme,
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    activeDot: {
        backgroundColor: colors.THEME_YELLOW,
        // width: 11,
        // height: 12,
        borderRadius: 15,
        padding: 6,
    },
    dotStyle: {
        backgroundColor: colors.LIGHT_YELLOW,
        borderRadius: 15,
        padding: 6,
    },
    nextBtn: {
        backgroundColor: colors.THEME_YELLOW,
        // backgroundColor: "red",
        fontFamily: 'OpenSans-Bold',
        // marginRight: 50,
        // marginLeft: 50,
        // paddingBottom: 2,
        // marginBottom: 20,
        // borderRadius: 5,
        padding: 15,
    },
    nextBtnTxt: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        color: colors.LIGHT_COLOR
    },
});