import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { colors } from '../../common'
const { width: Width } = Dimensions.get('window')
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.LIGHT_COLOR,
        alignItems: 'center',
        padding: 20,
        justifyContent: "center"

    },
    headingText: {
        fontSize: 20,
        color: colors.sub_theme,
        textAlign: "center",
        lineHeight: 30,
        marginTop: 50,
        paddingBottom: 20,
        alignItems: "center",
        marginBottom: 50,

        fontFamily: 'OpenSans-Regular',

    },
    myAccountButtonContainer: {

        height: 60,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: colors.sub_theme,
        backgroundColor: colors.LIGHT_COLOR

    },
    myAppontmentButtonContainer: {

        height: 60,
        justifyContent: "center",
        backgroundColor: '#1DA362',
        alignItems: "center",
        borderRadius: 10,
        marginBottom: 20,


    },



})