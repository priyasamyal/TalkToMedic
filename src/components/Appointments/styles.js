import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({

    tabText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        padding: 5,
        color: colors.sub_theme
    },
    tabStyle: {
        borderColor: colors.sub_theme,

    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: 'center',
        marginTop: 70
    },

    activeTabStyle: {
        backgroundColor: colors.sub_theme,
    },
    activeTabTextStyle: {
        color: colors.LIGHT_COLOR
    },
    btnText: {
        fontSize: 14,
        fontFamily: 'OpenSans-Bold',
        paddingLeft: 10,
        paddingRight: 10,
        color: colors.LIGHT_COLOR,
        textAlign: 'center'
    },
    mainContainer: {
        padding: 20,
        // paddingRight: 0,
        // flex: 1,
        // flexGrow: 1
    },
    thirdRow: {
        fontFamily: 'OpenSans-Light',
        fontSize: 18,
        color: colors.sub_theme,
    },
    thirdRowContainer: { borderRightWidth: 1, borderColor: colors.sub_theme, marginRight: 10, paddingRight: 10 },
    secondRow: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,
        color: colors.sub_theme,
    },
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
    //     fontFamily: 'OpenSans-Bold',
    //     fontSize: 22,

    // },
    // // black_text: {
    // //     color: colors.BLACK,
    // //     paddingLeft: 10,
    // // },
});