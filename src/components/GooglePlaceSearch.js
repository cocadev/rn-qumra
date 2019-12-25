import React from "react"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { p } from "../common/normalize";
import { Callout } from 'react-native-maps';

export default class GooglePlacesSearch extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      signedIn: false,
      name: "",
      photoUrl: "",
      location: { lat: 19.076090, lng: 72.877426, },
    }
  }

  render() {
    // console.log(' listViewDisplayed______________________ ', listViewDisplayed)
    return (
      <Callout style={{
        marginHorizontal: p(10),
        marginTop: p(60),
        flex: 1,
        width: '95%',
        // backgroundColor: 'red'
      }}>
        <GooglePlacesAutocomplete
          placeholder='Search'
          minLength={2} // minimum length of text to search
          autoFocus={false}
          fetchDetails={true}
          listViewDisplayed={this.props.listViewDisplayed}    // true/false/undefined
          // onFocus = {()=>{console.log('upset;;;;'); this.props.onFocus()}}
          textInputProps={{
            onFocus: () => { console.log('hello Worlda____________1'); this.props.onFocus() },
            onBlur: () => console.log('hello Worldb____________2'),
            onChangeText: (text) => { console.log('hello Worldb____________3', text) },
            onTouchStart: () => { this.props.onTouchStart() }
          }}
          onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true         
            this.props.onClick(details.geometry.location.lat, details.geometry.location.lng)
          }}

          query={{
            key: 'AIzaSyB1I2oX-x9KEe-qqmW5ZmiB5WzgOuqQc4c',
            language: 'en', // language of the results
            types: ['colloquial_area', 'administrative_area_level_1', 'establishment', 'locality'], // default: 'geocode'
          }}

          styles={{
            description: {
              fontWeight: 'bold',
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            textInput: {
              fontSize: p(14),
              height: p(32),

            },
            textInputContainer: {
              height: p(33),
              marginHorizontal: p(6),

              backgroundColor: 'rgba(0,0,0,0)',
              borderTopWidth: 0,
              borderRadius: p(4),
              marginTop: p(0)
            },
            listView: {
              marginHorizontal: p(10),
              backgroundColor: '#fff'
            }
          }}

          // debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.


          currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
          nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
          GoogleReverseGeocodingQuery={{
            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          }}


          filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

        // predefinedPlacesAlwaysVisible={true}

        />
        {/* <TouchableOpacity 
            style={{ position: 'absolute', right: p(18), top: p(29), backgroundColor: 'transparent', width: p(22), height: p(20), justifyContent:'center', alignItems: 'center'}}
            onPress={()=>this.setState({ display: false})}
          >
             <Icon name="ios-close-circle-outline" color={'#888'} size={p(26)} />
          </TouchableOpacity> */}



      </Callout>


    )
  }
}