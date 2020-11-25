import { StyleSheet } from 'react-native';
import { colors } from '../../common/index';
import { Dimensions } from 'react-native';
var { width, height } = Dimensions.get('window');
export default StyleSheet.create({
  header: {
    margin: 5,
  },
  pageTitle: {
    fontFamily: "OpenSans-Bold",
    fontWeight: 'bold',
    fontSize: 20,
    paddingTop: 10
  },
  black_text: {
    color:colors.sub_theme,
    paddingLeft: 10,
   // marginTop: 6,
  },

  mainContainer: {
    padding: 25,
    alignContent: 'center',
  },
  headingText: {
    fontSize: 20,
    fontFamily: 'OpenSans-Regular',
    color: colors.THEME_YELLOW
  },
  search_container: {
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: '#e8e8e8',
  },
  search_txt: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    paddingBottom: 2,
  },
  list_container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderBottomColor: "#e8e8e8",
    paddingTop: 10,
    paddingBottom: 10,
  }
});
