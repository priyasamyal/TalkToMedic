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
        padding: 10
    },
    thanks_heading: {
        fontSize: 20,
        color: colors.sub_theme,
        fontFamily: 'OpenSans-Regular',
        marginBottom: 30
    },

    btncontainer: {
        width: width,
        paddingRight: 20,
        paddingLeft: 20,
        marginBottom: 30,
    },
    btn_inner: {
        backgroundColor: colors.THEME_YELLOW,
        margin: 10,
    },
    btn_txt: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
        flexWrap: 'wrap'
    },
    checkboxContainer: {
        marginRight: 25,
        marginTop: 10,
        paddingLeft: 2,
        borderRadius: 5
    },
});
