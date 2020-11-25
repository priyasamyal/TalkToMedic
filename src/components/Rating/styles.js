import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    main_container: {
        marginTop: 50,
        padding: 20
    },
    thanks_heading: {
        fontSize: 22,
        color: colors.sub_theme,
        textAlign: 'center',
        fontFamily: 'OpenSans-Bold',
        marginBottom: 20
    },
    notification_text: {
        fontSize: 20,
        color: colors.danger,
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
        marginBottom: 20
    },
    rate_text: {
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: 'center',
        fontFamily: 'OpenSans-Bold',
        marginBottom: 20
    },
    icon_img: {
        alignSelf: 'center',
        width: 80,
        height: 80,
        resizeMode: 'contain',

    },
    container1: {
        flex: 1,
        width: width - 120,
        alignSelf: 'center',
        marginBottom: 50,
        justifyContent: 'space-around',
    },
    value: {
        marginTop: 15,
        marginBottom: 10,
        fontFamily: 'OpenSans-Bold',
        fontSize: 25,
        textAlign: 'center',
        letterSpacing: 0.8,
        color: colors.sub_theme,
    },
    btncontainer: {
        width: width,
        paddingRight: 40,
        paddingLeft: 40,
        marginBottom: 10,
    },
    btn_inner: {
        backgroundColor: colors.THEME_YELLOW,
        height: 55,
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
