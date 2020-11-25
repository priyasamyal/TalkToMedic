import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
  },
  pageTitle: {
    fontFamily: 'OpenSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
  },
  mainContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    // marginTop: 10,
    height: Dimensions.get('window').height,
  },
  headingText: {
    margin: 40,
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    textAlign: 'center',
  },
  numberInputContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    paddingBottom: 3,
    padding: 5,
    marginTop: 20,
  },
  numberInput: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 18,
    padding: 7,
    paddingBottom: 9,
    width: '70%',
  },
  nextButtonContainer: {
    justifyContent: 'flex-end',
    width: Dimensions.get('window').width,
    // alignSelf: 'flex-end',
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    position: 'absolute',
    bottom: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nextButton: {
    color: colors.THEME_YELLOW,
    fontFamily: 'OpenSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
    opacity: 0.4,
    letterSpacing: 0.8
  },
  forgotPassword: {
    color: colors.GREY_TEXT,
    fontFamily: 'OpenSans-Regular',
    fontSize: 22,
    fontWeight: 'bold',
  },
  black_text: {
    color: colors.BLACK,
    paddingLeft: 10,
  },
});
