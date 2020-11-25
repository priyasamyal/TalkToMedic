import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({

    mainContainer: {
        flex: 1,

        padding: 25,
        paddingTop: 10,
    
    },
    headingTextMain: {
        margin: 10,
        marginTop: 0,
        marginBottom:0,
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,
        color: colors.sub_theme
    },
    numberInputContainerRow: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.BORDER_COLOR,
        paddingBottom: 3,
        padding: 5,
        marginTop: 8,
    },
    headingText: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 17,
        color: colors.sub_theme
    },
    numberInputContainerBlock: {
        flex: 1,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.sub_theme,

        marginLeft: 0, margin: 5,
        marginTop: 10,
        padding: 15,
        width: 0,
        justifyContent: 'center',
        alignItems: 'center',

    },
    body_style: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 15,
        color: colors.sub_theme,

    },
    nextButtonContainer: {
        height: 50,
        backgroundColor: colors.danger,
        width: width - 40,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    nextButton: {
        color: colors.LIGHT_COLOR,
        fontFamily: 'OpenSans-Bold',
        fontSize: 20,

    },
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 17,
        textAlign: "left",
        paddingLeft: 0,
        marginLeft: 5,
        // padding: 7,
        //    paddingBottom: 9,

        color: colors.BLACK_TEXT
    },

    checkboxContainer: {
        marginRight: 25,
        marginTop: 3,
        // paddingLeft: 4,
        borderRadius: 5
    },
    checkboxText: {
        color: colors.sub_theme,
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
    },

});
