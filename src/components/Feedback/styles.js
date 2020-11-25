import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    main_container: {
        marginTop: 50,
        padding: 20
    },
    thanks_heading: {
        fontSize: 25,
        color: colors.sub_theme,
        textAlign: 'center',
        fontFamily: 'OpenSans-Bold',
        marginBottom: 30
    },
    notification_text: {
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: 'center',
        fontFamily: 'OpenSans-Regular',
        marginBottom: 50
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
        width: 150,
        height: 150,
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
        marginTop: 20,
        fontFamily: 'OpenSans-Bold',
        fontSize: 30,
        textAlign: 'center',
        letterSpacing: 0.8,
        color: colors.sub_theme,
    },
    btncontainer: {
        width: width,
        paddingRight: 40,
        paddingLeft: 40,
        marginBottom: 30,
    },
    btn_inner: {
        backgroundColor: colors.geen_txt,
        // height: 60,
        margin: 10,

    },
    btn_inner1: {
        backgroundColor: 'transparent',
        // height: 60,
        margin: 10,
        borderWidth: 2,
        borderColor: colors.sub_theme
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
        flexWrap: 'wrap',
        textAlign: 'center',
    },
});
