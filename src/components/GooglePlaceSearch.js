import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, FlatList, Dimensions } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import lookUpPlaceByID from '../common/config';
import { p } from '../common/normalize';
import { images } from '../common/images';

type Props = {};
type State = {
  addressQuery: string,
  predictions: Array<any>
}

export default class GooglePlaceSearch extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showInput: false,
      addressQuery: '',
      predictions: []
    };
  }

  onQueryChange = (text) => {
    this.setState({ addressQuery: text });
    RNGooglePlaces.getAutocompletePredictions(this.state.addressQuery)
      .then((places) => {
        console.log(places);
        debugger;
        this.setState({ predictions: places });
      })
      .catch(error => console.log(error.message));
  }

  onSelectSuggestion(placeID) {
    console.log(placeID);
    // getPlaceByID call here
    RNGooglePlaces.lookUpPlaceByID(placeID)
      .then((results) => console.log(results))
      .catch((error) => console.log(error.message));

    this.setState({
      showInput: false,
      predictions: []
    });
  }

  onGetCurrentPlacePress = () => {
    RNGooglePlaces.getCurrentPlace()
      .then((results) => console.log(results))
      .catch((error) => console.log(error.message));
  }

  onGetPlaceByIDPress = () => {
    RNGooglePlaces.lookUpPlaceByID(lookUpPlaceByID)
      .then((results) => console.log(results))
      .catch((error) => console.log(error.message));
  }

  keyExtractor = item => item.placeID;

  renderItem = ({ item }) => {
    return (
      <View style={styles.listItemWrapper}>
        <TouchableOpacity style={styles.listItem}
          onPress={() => this.onSelectSuggestion(item.placeID)}>
          <View style={styles.avatar}>
            <Image style={styles.listIcon} source={images.markder_qumrahmarker} />
          </View>
          <View style={styles.placeMeta}>
            <Text style={styles.primaryText}>{item.primaryText}</Text>
            <Text style={styles.secondaryText}>{item.secondaryText}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.divider} />
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, width: "100%", padding: p(20) }}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={input => this.pickUpInput = input}
            style={styles.input}
            value={this.props.addressQuery}
            onChangeText={this.onQueryChange}
            placeholder={'Where to meet?'}
            placeholderTextColor='gray'
            underlineColorAndroid={'transparent'}
          />
        </View>

        <View style={styles.list}>
          <FlatList
            data={this.state.predictions}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#263238',
    flexDirection: 'row',
    height: p(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(10)
  },
  buttonText: {
    color: 'white'
  },
  inputLauncher: {
    backgroundColor: '#F3F7F9',
    width: '100%',
    borderRadius: p(4),
    height: p(35),
    justifyContent: 'center',
    paddingLeft: p(10),
    marginBottom: p(16)
  },
  inputWrapper: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: p(7),
    justifyContent: 'center',
    elevation: 4
  },
  input: {
    color: '#222B2F',
    height: p(60),
    fontSize: p(12),
    paddingVertical: p(4),
    width: "90%",
    paddingLeft: p(8),
  },
  list: {
    marginTop: p(16),
    height: Dimensions.get('window').height - p(70)
  },
  listItemWrapper: {
    backgroundColor: 'white', //'transparent',
    height: p(60),
    width: "90%"

  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: p(16),
    height: '100%'
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'blue',
    width: '92%',
    marginHorizontal: p(16),
    opacity: 0.6
  },
  primaryText: {
    color: 'black',
    fontSize: p(18),
    marginBottom: 3
  },
  placeMeta: {
    flex: 1,
    marginLeft: p(15)
  },
  secondaryText: {
    color: 'gray',
    fontSize: p(16),
  },
  listIcon: {
    width: p(30),
    height: p(25)
  }
});