import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../../common'
const { width: Width } = Dimensions.get('window')
export default StyleSheet.create({



    buttonContainer: {
        height: 80,
        borderRadius: 10,
        backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center'
    },
    buttonText: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: 'OpenSans-Regular',

    },
    pickerWrapper: {
        height: 50,
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginTop: 10
    },
    pickerText: {
        fontFamily: 'OpenSans-Regular',
        color: colors.BLACK_TEXT,
        width: "85%"
    },

    headingText: {
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: "center",
        //  lineHeight: 35,
        alignItems: 'center',
        fontFamily: 'OpenSans-Bold',
        marginBottom: 20
    },
    subHeadingText: {
        fontSize: 18,
        color: colors.sub_theme,
        //textAlign: "center",
        //   lineHeight: 30,
        fontFamily: 'OpenSans-Regular',

    },
    mainContainer: {
        flex: 1,
        marginTop: 50,
        justifyContent: 'center',
        // alignItems: 'center',
        padding: 30
    },
    textAreatStyle: {
        width: "100%",
        borderRadius: 5,
        borderColor: colors.PLACEHOLDER_TEXT,
        marginTop: 10,
        paddingTop: 10,
        color: colors.BLACK_TEXT
    },
})