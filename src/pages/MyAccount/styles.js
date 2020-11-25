import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        paddingBottom: 0
    },
    profileContainer: {
        //resizeMode: 'contain',
        height: 100, width: 100,
        padding: 50,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: colors.PLACEHOLDER_TEXT,
        borderColor: colors.PLACEHOLDER_TEXT,
    },
    userName: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 23,
        color: colors.THEME_YELLOW,
        marginTop: 15,
        marginBottom: 5
    },
    itemIcon: {
        alignSelf: 'center',
        color: colors.sub_theme,
        paddingRight: 5,
        marginTop: 10,
        paddingTop: 5,
    },
    itemText: {
        alignSelf: 'center',
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.sub_theme,
        marginTop: 10,
        marginLeft: 10
    }

    // mainContent: {
    //     flex: 1,
    //     alignItems: 'center',
    //     //   height: Dimensions.get('window').height,

    // },
    // headingText: {
    //     fontFamily: 'OpenSans-Regular',
    //     fontSize: 15,
    //     color: colors.sub_theme
    // },
    // numberInputContainer: {
    //     // flexDirection: 'row',
    //     borderRadius: 5,
    //     borderWidth: 1,
    //     borderColor: colors.BORDER_COLOR,
    //     paddingBottom: 3,
    //     padding: 5,
    //     marginTop: 5,
    //     width: width - 40
    // },
    // numberInputContainerRow: {
    //     // flexDirection: 'row',
    //     borderRadius: 5,
    //     borderWidth: 1,
    //     borderColor: colors.BORDER_COLOR,
    //     paddingBottom: 3,
    //     padding: 5,

    //     marginTop: 5,
    // },
    // numberInput: {
    //     fontFamily: 'OpenSans-Regular',
    //     fontSize: 18,
    //     padding: 7,
    //     paddingBottom: 9,
    //     width: "70%",
    // },
    // checkboxText: {
    //     color: colors.GREY_TEXT,
    //     fontFamily: 'OpenSans-Regular',
    //     fontSize: 15
    // },
    // checkboxContainer: {
    //     marginRight: 15,
    //     paddingTop: 0,
    //     paddingLeft: 4,
    //     borderRadius: 5
    // },
    // nextButtonContainer: {
    //     backgroundColor: colors.THEME_YELLOW,
    //     margin: 20,
    //     width: width - 40,
    //     justifyContent: 'center',
    //     height: 50,
    //     // marginBottom: 50
    //     //  alignItems:'center'
    //     // width: "100%",
    //     // alignSelf: 'flex-end',
    //     // paddingTop: 10,
    //     // position: 'absolute',
    //     // bottom: "10%",
    // },
    // nextButton: {

    //     textAlign: 'center',
    //     color: colors.LIGHT_COLOR,
    //     fontFamily: 'OpenSans-Regular',
    //     fontSize: 22,

    // },
    // // black_text: {
    // //     color: colors.BLACK,
    // //     paddingLeft: 10,
    // // },
});
