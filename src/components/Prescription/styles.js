import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,

        padding: 10,
        paddingTop: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingTextRelation: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 20,
        color: colors.sub_theme,
        padding: 5
    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme,
        //  marginTop: 10
    },
    headingSubText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.sub_theme
    },
    medicinetext: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.sub_theme,
        fontSize: 20,
        marginTop: 10
    },
    longText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: colors.PLACEHOLDER_TEXT
    },
    numberInputContainerRow: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        //   paddingBottom: 3,
        padding: 5,
        // marginTop: 8,
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: "left",
        paddingLeft: 0,
        // marginLeft: 5,
        color: colors.sub_theme
    },
    dateContainer: {
        paddingBottom: 3,
        // padding: 5,
        //marginTop: 10,
    },
    dateInnerContainer: {
        padding: 10,
        //  marginTop: 0,
        ///marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
    },
    nextButtonContainer: {
        height: 50,
        backgroundColor: colors.danger,
        width: "100%",
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,


    },
    headerWrapper: {
        borderBottomColor: colors.PLACEHOLDER_TEXT,
        borderBottomWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
    },
});
