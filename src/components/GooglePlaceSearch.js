import React from "react"
import { View, PermissionsAndroid } from "react-native"
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { p } from "../common/normalize";
import MapView, { PROVIDER_GOOGLE, Callout, } from 'react-native-maps';

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

    return (
      <View style={{ height: p(150) }}>

        <Callout style={{
          marginHorizontal: 20, flex: 1, width: '95%',
        }}>
          <GooglePlacesAutocomplete
            placeholder='Search'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            fetchDetails={true}

            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true                
              this.props.onClick(details.geometry.location.lat, details.geometry.location.lng)
            }}

            query={{
              key: 'AIzaSyB1I2oX-x9KEe-qqmW5ZmiB5WzgOuqQc4c',
              language: 'en', // language of the results
              types: 'address', // default: 'geocode'
            }}

            styles={{
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              textInput: {
                height: p(25),
                width: '100%',
                fontSize: p(14)
              },
              textInputContainer: {
                height: p(32),
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                elevation: p(2),
                borderRadius: p(4),
                marginTop: p(20)
              },
              listView: {
                backgroundColor: '#fff'
              }
            }}

            // debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.


            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}


            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

            predefinedPlacesAlwaysVisible={true}
          />
        </Callout>

      </View>

    )
  }
}