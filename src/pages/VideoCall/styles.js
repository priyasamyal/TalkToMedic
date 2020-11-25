import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        height: 300,
    },
    /**Publisher Container CSS Starts */
    pub_outer: {
        width: 120, height: 150,
        position: "absolute",
        right: 0,
        bottom: 137,
        zIndex: 9,
    },
    pub_inner: {
        width: 120, height: 150,
        backgroundColor: 'black',
        borderWidth: 2,
        borderColor: colors.PLACEHOLDER_TEXT,
        zIndex: 6,
    },
    pub_text_container: {
        zIndex: 4,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'rgba(184,184,184, 0.9)',
        alignItems: 'flex-start'
        //alignItems: 'flex'
    },
    pub_user_txt: {
        color: colors.LIGHT_COLOR,
        fontSize: 15,
        fontFamily: 'OpenSans-Regular',
        padding: 5
    },
    /**Publisher Container CSS  Ends*/

    /**Header CSS */
    header_main: {
        zIndex: 2,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(6,109,174, 0.9)',
        paddingTop:30
        //  backgroundColor: 'rgba(28,27,27, 0.7)',
    },
    head_text: {
        fontFamily: 'OpenSans-Regular',
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
    },
    /**Header CSS Ends  */

      /**Refresh CSS */
      refresh_main: {
        zIndex: 2,
        position: 'absolute',
        left: 0,
        top: 69,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
    head_text: {
        fontFamily: 'OpenSans-Regular',
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
    },
    /**Header CSS Ends  */

    /**Footer CSS */
    footer_main: {
        zIndex: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        justifyContent: 'center',
        alignContent: 'space-between',
        // backgroundColor: 'rgba(184,184,184, 0.9)',
        backgroundColor: 'rgba(66,66,66, 0.8)',
    },
    userInfo: {
        color: colors.LIGHT_COLOR,
        padding: 5,
        fontSize: 20,
        fontFamily: 'OpenSans-Regular',
    },
    footer_outer: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        alignContent: 'space-between',
        backgroundColor: 'transparent',
        paddingBottom: 20,
    },
    footer_container: {
        margin: 10,
        marginTop: 10,
    },
    footer_icon: {
        height: 40,
        width: 40,
        padding: 30,
    },


    /****Confirm Identity****/
    identity_container: {
        zIndex: 2,
        position: 'absolute',
        backgroundColor: colors.LIGHT_COLOR,
        left: 0,
        bottom: 0,
        width: '100%',
        // padding: 10,
        //   height: 0
    },
    identity_heading: {
        textAlign: 'center',
        color: colors.sub_theme,
        fontSize: 20,
        fontFamily: 'OpenSans-Bold',
        marginBottom: 10
    },
    sub_heading: {
        color: colors.PLACEHOLDER_TEXT,
        fontSize: 18,
        fontFamily: 'OpenSans-Regular',
    },
    nextButtonContainer: {
        backgroundColor: colors.geen_txt,
        height: 50,
        marginBottom: 10
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
    },
    identityBtnContiner: {
        margin: 10,
        marginTop: 10,
    },
    endBtnIcon: {
        height: 50,
        width: 50,
        padding: 55,
    },

})