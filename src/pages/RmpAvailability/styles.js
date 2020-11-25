import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        // flex: 1,
        // alignItems: 'center',
        // padding: 20
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        //   height: Dimensions.get('window').height,

    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        color: colors.sub_theme
    },
    numberInputContainer: {
        // flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 5,
        width: width - 40
    },
    numberInputContainerRow: {
        // flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,

        marginTop: 5,
    },
    stateCouncilTxt: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.BLACK_TEXT,
        paddingBottom: 5,
        paddingLeft: 5
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        padding: 7,
        paddingBottom: 9,
        // width: "70%",
    },

    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        // margin: 20,
        width: width - 20,
        justifyContent: 'center',
        height: 50,
        // marginBottom: 50
        //  alignItems:'center'
        // width: "100%",
        // alignSelf: 'flex-end',
        // paddingTop: 10,
        // position: 'absolute',
        // bottom: "10%",
    },
    nextButton: {
        textAlign: 'center',
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,
    },
    headingInfoText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 17,
        color: colors.sub_theme,
        padding: 2,
        paddingBottom: 0
    },
    headingDateText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme
    },
    headingSubInfoText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 12,
        color: colors.GREY_TEXT
    },
    slotContainer: {
        padding: 4,
        borderWidth: 1,
        borderColor: colors.sub_theme,
        borderRadius: 5,
        margin: 5,
        width: 70,
        alignItems: 'center',
    },
    slotText: {
        color: colors.sub_theme,
        fontFamily: "OpenSans-Regular",
        fontSize: 12
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    flexRowSpace: {
        flexDirection: "row",
        //   justifyContent: "space-between",
        // alignItems: "center",
        // backgroundColor: 'red',
        alignItems: 'flex-start',
        // borderBottomWidth: 1
    },
    black_text: {
        color: colors.sub_theme,
        paddingLeft: 12,
    },
    drDetails: {
        marginLeft: 25,

    },
    DrName: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        color: colors.sub_theme,
        padding: 5,
        paddingBottom: 0
    },
    // black_text: {
    //     color: colors.BLACK,
    //     paddingLeft: 10,
    // },
    profileContainer: {
        //resizeMode: 'contain',
        height: 70,
        width: 70,
        marginTop: 10,
        padding: 30,
        borderWidth: 1,
        borderColor: colors.PLACEHOLDER_TEXT,
        borderRadius: 5,
        backgroundColor: colors.PLACEHOLDER_TEXT
    },
});