import React, { Component } from 'react';

import HeaderComponent from '@components/HeaderComponent';

import { colors, constant } from '../../common/index';
import styles from './styles';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import {
  Container,
  Left,
  Header,
  Item,
  Input,
  Button,
  Text,
  Radio,
  Right,
  Icon,
  Body,
  Title
} from 'native-base';
import { black } from 'ansi-colors';
import commonData from '../../common/data';
const hitSlop = { top: 20, left: 20, right: 20, bottom: 20 };
import { connect } from "react-redux";
class StateListing extends Component {
  constructor(props) {
    super(props);
    console.log(props, 'props');
    this.state = {
      countryCodes: this.temp_country_list,
      modalVisible: this.props.modalVisible,
      searchedText: '',
      selectedCountry: {},
      // selectedCountry: props.itemName,
      noResutFound: false,
      searchIcon: false,
      value: '',
      temp_country_list: this.props.states

    };
    //  console.log(this.props, "hello", this.state)


    if (this.props.titleText == "Select Relation") {
      this.temp_country_list = this.props.FAMILY_RELATIONS;
    } else {
      this.temp_country_list = this.props.states;
    }

    switch (this.props.titleText) {
      case "Select Relation":
        this.temp_country_list = this.props.FAMILY_RELATIONS;
        break;

      case "Select State":
        this.temp_country_list = this.props.states;
        break;

      case "Select City":
        this.temp_country_list = this.props.city;
        break;

      default:
        break;
    }
    const { childRef } = this.props;
    childRef(this);

    console.log(this.temp_country_list, "const call")

  }


  componentDidMount() {
    console.log("did mount calling")
  }

  componentWillUnmount() {
    const { childRef } = this.props;
    childRef(undefined);
  }
  setModalVisibility = (visibility, selectedcountry, status) => {
    console.log('set modal visibility', visibility);
    this.setState({ modalVisible: visibility, selectedCountry: selectedcountry });
    switch (this.props.titleText) {
      case "Select Relation":
        this.temp_country_list = this.props.FAMILY_RELATIONS;
        break;

      case "Select State":
        this.temp_country_list = this.props.states;
        break;

      case "Select City":
        this.temp_country_list = this.props.city;
        break;

      default:
        break;
    }
    // switch (status) {
    //   case "states":
    //     this.setState({ modalVisible: visibility, selectedCountry: selectedcountry });
    //     break;

    //   case "city":
    //     this.setState({ modalVisible: visibility, selectedCountry: selectedcountry });
    //     break;

    //   default:
    //     break;
    // }

  };
  hideModal = item => {
    this.props.closeModal(item);
    this.setState({ modalVisible: false });
  };
  clearText = () => {
    this.temp_country_list = this.props.country;
    this.setState({ value: '', countryCodes: this.props.country });
    this.setState({ noResutFound: false });
    this.setState({ searchIcon: false });
  };


  selectItem = (type, item) => {
    console.log(item, "Item Selected");
    switch (type) {
      case "state":
        this.setState({ selectedCountry: item });
        this.hideModal(item);
        console.log(this.state)
        break;
      case "relation":
        this.setState({ selectedCountry: item });
        this.hideModal(item);
        console.log(this.state)
      default:
        break;
    }

  };
  onChangeSearchText = text => {
    text
      ? this.setState({ searchIcon: true })
      : this.setState({ searchIcon: false });
    this.setState({ value: text });
    switch (this.props.titleText) {
      case "Select Relation":
        this.temp_country_list = this.props.FAMILY_RELATIONS;
        break;

      case "Select State":
        this.temp_country_list = this.props.states;
        break;

      case "Select City":
        this.temp_country_list = this.props.city;
        break;

      default:
        break;
    }
    //this.temp_country_list = this.proSisterps.country;
    var val = text;
    if (this.props.titleText == "Select Relation") {
      if (val && val.trim() != '') {
        this.temp_country_list = this.temp_country_list.filter(item => {
          return item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      }
    }
    // if (val && val.trim() != '') {
    //   this.temp_country_list = this.temp_country_list.filter(item => {
    //     return item.country_name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    //   });
    // }
    this.setState({ countryCodes: this.temp_country_list });
    if (this.temp_country_list.length == 0) {
      this.setState({ noResutFound: true });
    } else {
      this.setState({ noResutFound: false });
    }
  };
  navigator = action => {
    console.log(action);
    this.hideModal()
  }
  render() {
    const { isVisible, message, textValue, itemName } = this.props;
    return (
      <Modal
        animationType="slide"
        transparent={false}
        itemName={itemName}
        visible={this.state.modalVisible}
        backdropColor={'white'}
        onRequestClose={() => this.props.closeModal(this.state.selectedCountry)}
        style={{ margin: 0 }}>
        <Container>
          <Header searchBar transparent rounded>
            <Left style={{ flex: 0.2 }}>
              <Button
                transparent
                hitSlop={hitSlop}
                onPress={() => this.hideModal()}>
                <Icon
                  style={[
                    styles.black_text,
                    // {fontSize: Platform.OS === 'ios' ? 35 : 30}
                  ]}
                  name="arrow-back"
                />

              </Button>
            </Left>


            <Item style={styles.search_container}>
              <Icon name="ios-search" />
              <Input
                style={styles.search_txt}
                placeholder="Search"
                value={this.state.value}
                selectionColor={colors.THEME_YELLOW}
                onChangeText={text => this.onChangeSearchText(text)}
              />
              {this.state.searchIcon && (
                <TouchableOpacity onPress={() => this.clearText()}>
                  <Icon name="ios-close-circle" />
                </TouchableOpacity>
              )}
            </Item>

          </Header>

          <View style={styles.mainContainer}>
            {this.state.noResutFound && (
              <View style={{ alignContent: 'center' }}>
                <Text
                  style={{ textAlign: 'center', fontFamily: 'OpenSans-Regular' }}>
                  No Result Found
                </Text>
              </View>
            )}
            {!this.state.noResutFound && (
              <View>
                <Text style={styles.headingText}>
                  {this.props.titleText}
                </Text>
              </View>
            )}
            {!this.state.noResutFound && (
              <View style={{ paddingTop: 20, marginBottom: 150 }}>
                <FlatList
                  data={this.temp_country_list}
                  showsVerticalScrollIndicator={false}
                  renderItem={(item) => this._renderItem(item)}
                  // renderItem={({ item }) => (
                  //   // <View style={styles.list_container}>
                  //   //   <TouchableOpacity
                  //   //     style={{
                  //   //       flex: 1,
                  //   //       flexDirection: 'row',
                  //   //     }}
                  //   //     onPress={() => this.selectCountry(item)}>
                  //   //     <Text
                  //   //       style={
                  //   //         item.country_id ===
                  //   //           this.state.selectedCountry.country_id
                  //   //           ? {
                  //   //             color: colors.THEME_YELLOW,
                  //   //             fontFamily: 'OpenSans-Regular',
                  //   //           }
                  //   //           : {
                  //   //             color: colors.BLACK_TEXT,
                  //   //             fontFamily: 'OpenSans-Regular',
                  //   //           }
                  //   //       }>
                  //   //       +{item.phone_code} {item.country_name}
                  //   //     </Text>
                  //   //     <Right>
                  //   //       <Radio
                  //   //         color={'#f0ad4e'}
                  //   //         selectedColor={colors.THEME_YELLOW}
                  //   //         selected={
                  //   //           item.country_id ===
                  //   //           this.state.selectedCountry.country_id
                  //   //         }
                  //   //       />
                  //   //     </Right>
                  //   //   </TouchableOpacity>
                  //   // </View>
                  // )}
                  keyExtractor={item => item.country_code}
                />
              </View>
            )}
          </View>
        </Container>
      </Modal>
    );
  }


  _renderItem = (item) => {
    return (
      <View style={styles.list_container}>
        {this.props.titleText == "Select Relation" && (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
            onPress={() => this.selectItem("relation", item.item)}>
            <Text
              style={
                item.item.id ===
                  this.state.selectedCountry.id
                  ? {
                    color: colors.THEME_YELLOW,
                    fontFamily: 'OpenSans-Regular',
                  }
                  : {
                    color: colors.BLACK_TEXT,
                    fontFamily: 'OpenSans-Regular',
                  }
              }>
              {item.item.name}
            </Text>
            <Right>
              <Radio
                color={'#f0ad4e'}
                selectedColor={colors.THEME_YELLOW}
                selected={
                  item.item.id ===
                  this.state.selectedCountry.id
                }
                onPress={() => this.selectItem("state", item.item)}
              />
            </Right>
          </TouchableOpacity>
        )}


        {this.props.titleText == "Select State" && (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
            onPress={() => this.selectItem("state", item.item)}>
            <Text
              style={
                item.item.iStateid ===
                  this.state.selectedCountry.iStateid
                  ? {
                    color: colors.THEME_YELLOW,
                    fontFamily: 'OpenSans-Regular',
                  }
                  : {
                    color: colors.BLACK_TEXT,
                    fontFamily: 'OpenSans-Regular',
                  }
              }>
              {item.item.vStateName}
            </Text>
            <Right>
              <Radio
                onPress={() => this.selectItem("state", item.item)}
                color={'#f0ad4e'}
                selectedColor={colors.THEME_YELLOW}
                selected={
                  item.item.iStateid ===
                  this.state.selectedCountry.iStateid
                }
              />
            </Right>
          </TouchableOpacity>
        )}

        {this.props.titleText == "Select City" && (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
            onPress={() => this.selectItem("state", item.item)}>
            <Text
              style={
                item.item.iCityId ===
                  this.state.selectedCountry.iCityId
                  ? {
                    color: colors.THEME_YELLOW,
                    fontFamily: 'OpenSans-Regular',
                  }
                  : {
                    color: colors.BLACK_TEXT,
                    fontFamily: 'OpenSans-Regular',
                  }
              }>
              {item.item.vCityName}
            </Text>
            <Right>
              <Radio
                onPress={() => this.selectItem("state", item.item)}
                color={'#f0ad4e'}
                selectedColor={colors.THEME_YELLOW}
                selected={
                  item.item.iCityId ===
                  this.state.selectedCountry.iCityId
                }
              />
            </Right>
          </TouchableOpacity>
        )}
      </View>
    )

  }
}

function mapStateToProps(state) {
  console.log(state, "mm")
  return {
    states: state.states,
    city: state.city,
    FAMILY_RELATIONS: state.FAMILY_RELATIONS

  }
}
export default connect(mapStateToProps, null)(StateListing);
