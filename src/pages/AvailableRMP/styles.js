import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        //   height: Dimensions.get('window').height,

    },
    headingText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
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
    numberInput: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        padding: 7,
        paddingBottom: 9,
        width: "70%",
    },

    nextButtonContainer: {
        backgroundColor: colors.danger,
        padding: 0,
        paddingRight: 20,
        paddingLeft: 20,
        // width: width - 40,
        // justifyContent: 'center',
        //height: 50,
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
        fontSize: 18,


    },
    // black_text: {
    //     color: colors.BLACK,
    //     paddingLeft: 10,
    // },

    memberName: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        color: colors.sub_theme,
        padding: 2
    },
    memberDesc: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 13,
        lineHeight: 18,
        color: colors.sub_theme,
        // marginTop:5,
        padding: 5,
        //textAlign: 'center'
    },
    iconText: {
        fontSize: 18,
        color: colors.THEME_YELLOW,
        fontFamily: 'OpenSans-Bold',
    },
    profileContainer: {
        //resizeMode: 'contain',
        height: 70, width: 70,
        padding: 30,
        borderWidth: 1,
        borderColor: colors.PLACEHOLDER_TEXT,
        borderRadius: 5,
        backgroundColor: colors.PLACEHOLDER_TEXT
    },

    /*Cards*/
    card: {
        flex: .8,
        marginTop: -40,
        borderRadius: 8,
        shadowRadius: 25,
        shadowColor: '#000',
        // shadowOpacity: 0.05,
        // shadowOffset: { width: 5, height: 5 },
        //justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.grey_bg,
        // backgroundColor:'#f9f9f9',
        // backgroundColor: "#e9e7e7",
        borderWidth: 1,
        borderColor: colors.card_border_outline,
        // padding: 10,
    },

    cardImage: {
        width: 200,
        height: 400,
        flex: 1,
        alignSelf: 'center',
        resizeMode: 'contain'
    },
    cardLocation: {
        paddingTop: 15,
        fontFamily: 'OpenSans-Bold', color: colors.danger, fontSize: 18, textAlign: 'center'
    },
    cardTextTitle: {
        fontFamily: 'OpenSans-Bold', color: colors.BLACK_TEXT, fontSize: 20
    },
    cardTextPrice: {
        fontFamily: 'OpenSans-Bold', color: colors.sub_theme, fontSize: 20
    },
    cardTextDescriptionSpec: {
        fontFamily: 'OpenSans-Regular', color: colors.sub_theme, fontSize: 17
    },
    cardTextDescription: {
        fontFamily: 'OpenSans-Regular', color: colors.grey_heading, fontSize: 16
    },
    cardTextDescriptionReg: {
        fontFamily: 'OpenSans-Light',
        color: colors.grey_heading,
        fontSize: 16
    },
    cardTextConatiner: {
        width: "100%",
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
    },
    cardBtnContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 50
    },
});
