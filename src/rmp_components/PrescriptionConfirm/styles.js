import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../../common'
const { width: Width } = Dimensions.get('window')
export default StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
        marginTop: 10
        //  padding: 20

    },
    headingText: {
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: "center",
        lineHeight: 30,
        marginTop: 50,
        paddingBottom: 20,
        alignItems: "center",
        fontFamily: 'OpenSans-Regular',
    },
    confirmButtonContainer: {
        width: '100%',
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.THEME_YELLOW,
        borderRadius: 10
    },
    cancelButtonContainer: {
        width: '80%',
        height: 60,
        borderWidth: 2,
        borderColor: 'red',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },

    buttonWrapper: {
        flexDirection: "row",
        padding: 20,
    },
    pickerText: {
        padding: 0,
        justifyContent: 'center'
    },
    thirdRow: {
        fontFamily: 'OpenSans-Light',
        fontSize: 18,
        color: colors.sub_theme,
    },
    thirdRowContainer: { borderRightWidth: 0, borderColor: colors.sub_theme, marginRight: 10, paddingRight: 10 },
    secondRow: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,
        color: colors.sub_theme,
    },
    stateCouncilTxt: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15
    },

    numberInputContainer: {
        // flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 5,
        height: 50
        // width: width - 40
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
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        padding: 7,
        paddingBottom: 9,
        color: colors.BLACK_TEXT
        //  width: "70%",
    },
    headingTextForm: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: colors.sub_theme
    },
    nextButtonContainer: {
        backgroundColor: colors.THEME_YELLOW,
        marginTop: 10,
        width: Width - 40,

        justifyContent: 'center',
        height: 50,
        marginBottom: 10,
        alignItems: 'center'

    },
    nextButton: {
        textAlign: 'center',
        alignSelf: 'center',
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,

    },

})