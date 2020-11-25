import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    noteText: {
        fontSize: 16.67,
        fontFamily: "OpenSans-Regular",
        color: colors.sub_theme,
        fontWeight: "400",
        lineHeight: 30
    },
    uploadContainer: {
        padding: 15,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        borderRadius: 8,
        width: width - 40,
        marginTop: 10
    },
    uploadImag: {
        width: 65,
        height: 65
    },
    flexRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    uploadText: {
        fontSize: 22,
        color: colors.sub_theme,
        fontWeight: "700",
        textAlign: "left",
        lineHeight: 24.67,
        fontFamily: "OpenSans-Regular"
    },
    noteSubText: {
        fontFamily: "OpenSans-Regular",
        color: colors.danger,
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 30
    },
    addMore: {
        color: colors.sub_theme,
        textAlign: "left",
        fontSize: 16,
        fontWeight: "700"
    },
    date: {
        fontWeight: "700",
        fontSize: 18.67,
        color: colors.sub_theme,
        fontFamily: "OpenSans-Bold",
    },
    arrow_down: {
        color: colors.GREY_TEXT,
        fontSize: 26
    },
    contentContainer: {
        paddingTop: 20, 
        paddingBottom: 10
    },
    reportImage: {
        width: 65,
        height: 65
    },
    filenametext: {
        fontSize: 15,
        color: colors.sub_theme,
        fontWeight: "400",
        lineHeight: 25,
        fontFamily: "OpenSans-Regular",
        paddingLeft: 15
    },
    removeIcon: {
        color: colors.danger,
    },
    divider: {
        borderTopWidth: .4, 
        borderColor: colors.BORDER_COLOR,
        marginVertical: 5
    },
    selectListContainer: {
        // width: width - 40,
        // padding: 10,
        // borderWidth: 1,
        // borderColor: colors.BORDER_COLOR,
        // borderRadius: 8,
        // marginTop: 25,
    },
    numberInputContainerRow: {
        width: width - 40,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 15,
    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        textAlign: "left",
        paddingLeft: 0,
        marginLeft: 5,
        color: colors.BLACK_TEXT
    },
    editBtn: {
        fontSize: 18, 
        color: colors.sub_theme,
        fontFamily: "OpenSans-Regular",
        fontWeight: "400"
    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,
        color: colors.sub_theme,
        marginTop: 10
    },
});