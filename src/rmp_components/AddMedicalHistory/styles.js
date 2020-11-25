import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../../common';
const { width: Width } = Dimensions.get('window')
export default StyleSheet.create({



    saveButtonContainer: {
        height: 60,
        borderRadius: 5,
        backgroundColor: colors.THEME_YELLOW,
        justifyContent: "center"
    },
    editButtonContainer: {

        height: 60,
        borderRadius: 5,
        backgroundColor: colors.danger,
        justifyContent: "center"
    },
    inchesWrapperStyle: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginHorizontal: 5,
        // alignSelf: 'flex-start'
    },
    feetWrapperStyles: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: colors.PLACEHOLDER_TEXT,
        borderRadius: 5
    },
    headingTextWrapper: {

        height: 45,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginBottom: 15,
        marginTop: 5,
        justifyContent: "center",
        paddingLeft: 15


    },
    inputStyle: {

        borderWidth: 0.5,
        borderColor: colors.PLACEHOLDER_TEXT,
        width: '90%',
        height: 45,
        color: colors.BLACK_TEXT,
        paddingLeft: 5,
        borderRadius: 5,
        fontSize: 15
    },
    subCaptionInputStyle: {
        fontSize: 13,
        color: colors.PLACEHOLDER_TEXT
    },

    inputStyleForWeight: {
        borderWidth: 0.5,
        borderColor: colors.PLACEHOLDER_TEXT,
        width: '100%',
        height: 45,
        color: colors.BLACK_TEXT,
        paddingLeft: 15,
        borderRadius: 5,
        fontSize: 15
    },
    inputCaptionStyle: {
        fontSize: 15,
        color: colors.sub_theme,
        marginLeft: 20,
        marginBottom: 3,
        fontFamily: 'OpenSans-Regular',
    },
    inputCaptionStyleForFirstCol: {
        fontSize: 15,
        color: colors.sub_theme,
        marginBottom: 3,
        fontFamily: 'OpenSans-Regular',

    },
    stateCouncilTxt: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: colors.BLACK_TEXT,

        paddingLeft: 5,


    },
    bmiWrapper: {
        flex: 1,
        borderWidth: 0.5,
        width: '90%',
        alignSelf: "flex-end",
        borderRadius: 5,
        height: 45,
        borderColor: colors.PLACEHOLDER_TEXT,
        paddingLeft: 5,
        justifyContent: "center"

    },
    inputStyleDate: {
        borderWidth: 0.5,
        borderColor: colors.PLACEHOLDER_TEXT,
        width: '90%',
        height: 45,
        borderRadius: 5,
        justifyContent: 'center'

    },
    textAreaStyle: {
        fontFamily: 'OpenSans-Regular',
        borderRadius: 5,
        width: Width - 40 //need to give the width of the text area so that I use ' Width 'this there is no other option 

    },
    oddTextCaptionStyle: {
        alignSelf: 'flex-start',
        color: '#00A6FF',
        fontWeight: "bold",
        // backgroundColor: 'white',
        marginTop: 20,
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
    },
    evenTextAreaCaptionStyle: {
        fontFamily: 'OpenSans-Regular',
        alignSelf: 'flex-start',
        color: colors.THEME_YELLOW,
        fontWeight: "bold",
        //  backgroundColor: 'white',
        marginTop: 20,
        fontSize: 15,
    },
    calenderIcon: {
        width: 30,
        height: 30,
        right: 30,
        top: 12,
        position: 'absolute'
    },
    headingDateText: {
        fontSize: 18,
        color: colors.sub_theme,
        fontWeight: "bold",
        marginBottom: 5,
        fontFamily: 'OpenSans-Regular',
    },
    inputWraperStyle: {
        flexDirection: "row",
        alignItems: "center",

        marginTop: 5
    }



})